const express  = require('express')
const router   = express.Router()
const Interest = require('../models/Interest')
const User     = require('../models/User')
const { protect } = require('../middleware/auth')

// ─── Ashtakoot Guna Milan (simplified) ────────────────────────────────────────
// Nakshatra mapping: Birth date → lunar nakshatra approximation (cyclic 27)
function getNakshatra(dob) {
  if (!dob) return 0
  const d = new Date(dob)
  // Simplified: use day-of-year mod 27 as proxy nakshatra index
  const start = new Date(d.getFullYear(), 0, 0)
  const diff = d - start
  const dayOfYear = Math.floor(diff / 86400000)
  return dayOfYear % 27
}

function getRashi(dob) {
  if (!dob) return 0
  const d = new Date(dob)
  const month = d.getMonth() + 1
  const day = d.getDate()
  // Approximate zodiac sign (0-11)
  const zodiacs = [
    [1,20],[2,19],[3,21],[4,20],[5,21],[6,21],
    [7,23],[8,23],[9,23],[10,23],[11,22],[12,22]
  ]
  for (let i = 0; i < 12; i++) {
    const [m, cutoff] = zodiacs[i]
    if (month === m && day <= cutoff) return i
    if (month === ((m % 12) + 1) && day > cutoff) return (i + 1) % 12
  }
  return month - 1
}

// Varna (1 point) — caste/spiritual compatibility
const VARNA_ORDER = { brahmin: 4, kshatriya: 3, vaishya: 2, shudra: 1, '': 2 }
function varna(boy, girl) {
  const bv = VARNA_ORDER[boy.caste?.toLowerCase()] || 2
  const gv = VARNA_ORDER[girl.caste?.toLowerCase()] || 2
  return bv >= gv ? 1 : 0
}

// Vashya (2 points) — attraction/control
function vashya(boy, girl) {
  const br = getRashi(boy.dob) % 5
  const gr = getRashi(girl.dob) % 5
  if (br === gr) return 2
  if (Math.abs(br - gr) === 1) return 1
  return 0
}

// Tara (3 points) — destiny/health
function tara(boy, girl) {
  const bn = getNakshatra(boy.dob)
  const gn = getNakshatra(girl.dob)
  const diff = ((gn - bn) % 27 + 27) % 27
  const taraNum = (diff % 9) + 1
  const auspicious = [1,2,4,6,8]
  return auspicious.includes(taraNum) ? 3 : taraNum === 5 ? 1.5 : 0
}

// Yoni (4 points) — intimate compatibility
function yoni(boy, girl) {
  const bn = getNakshatra(boy.dob) % 14
  const gn = getNakshatra(girl.dob) % 14
  if (bn === gn) return 4
  if (Math.abs(bn - gn) <= 2) return 2
  return 1
}

// Graha Maitri (5 points) — mental compatibility / moon sign lords
function grahaMaitri(boy, girl) {
  const br = getRashi(boy.dob)
  const gr = getRashi(girl.dob)
  const diff = Math.abs(br - gr)
  if (diff === 0) return 5
  if (diff <= 2) return 4
  if (diff <= 4) return 3
  if (diff <= 6) return 1
  return 0
}

// Gana (6 points) — temperament: 0=deva, 1=manava, 2=rakshasa
function getGana(dob) {
  const n = getNakshatra(dob)
  const devaStars = [0,5,6,13,17,20,23,25,26]
  const manaStars = [2,3,4,7,10,11,14,16,18,19,21]
  if (devaStars.includes(n)) return 0
  if (manaStars.includes(n)) return 1
  return 2
}
function gana(boy, girl) {
  const bg = getGana(boy.dob), gg = getGana(girl.dob)
  if (bg === gg) return 6
  if (bg === 0 && gg === 1) return 5
  if (bg === 1 && gg === 0) return 4
  if (bg === 0 && gg === 2) return 1
  return 0
}

// Bhakoot (7 points) — love/family
function bhakoot(boy, girl) {
  const br = getRashi(boy.dob) + 1
  const gr = getRashi(girl.dob) + 1
  const diff = Math.abs(br - gr)
  const inauspicious = [6, 8, 12]
  if (inauspicious.includes(diff) || inauspicious.includes(12 - diff)) return 0
  return 7
}

// Nadi (8 points) — health/progeny (most important)
function getNadi(dob) { return getNakshatra(dob) % 3 } // 0=aadi, 1=madhya, 2=antya
function nadi(boy, girl) {
  return getNadi(boy.dob) !== getNadi(girl.dob) ? 8 : 0
}

// Total Guna score out of 36
function calcGunas(boy, girl) {
  return {
    varna:       Math.round(varna(boy, girl)),
    vashya:      Math.round(vashya(boy, girl)),
    tara:        Math.round(tara(boy, girl)),
    yoni:        Math.round(yoni(boy, girl)),
    grahaMaitri: Math.round(grahaMaitri(boy, girl)),
    gana:        Math.round(gana(boy, girl)),
    bhakoot:     Math.round(bhakoot(boy, girl)),
    nadi:        Math.round(nadi(boy, girl)),
  }
}

function gunaInterpretation(total) {
  if (total >= 32) return { level: 'Excellent', color: '#059669', emoji: '💎' }
  if (total >= 28) return { level: 'Very Good', color: '#16a34a', emoji: '⭐' }
  if (total >= 24) return { level: 'Good',      color: '#ca8a04', emoji: '👍' }
  if (total >= 18) return { level: 'Average',   color: '#d97706', emoji: '🤔' }
  return                  { level: 'Poor',      color: '#dc2626', emoji: '⚠️' }
}

// ─── AI Cosine Compatibility ───────────────────────────────────────────────
const INCOME_MAP = { '0-2L': 1, '2-5L': 2, '5-10L': 3, '10-20L': 4, '20L+': 5, '': 3 }
const EDU_MAP = {
  'high school': 1, 'diploma': 2, 'bachelor': 3, 'graduate': 3,
  'master': 4, 'postgraduate': 4, 'phd': 5, 'doctorate': 5, '': 3
}

function getAge(dob) {
  if (!dob) return 28
  return Math.floor((Date.now() - new Date(dob)) / (365.25 * 24 * 60 * 60 * 1000))
}

function eduScore(val) {
  const v = (val || '').toLowerCase()
  for (const [k, s] of Object.entries(EDU_MAP)) if (v.includes(k)) return s
  return 3
}

function incomeScore(val) {
  return INCOME_MAP[val] || 3
}

function toVector(u) {
  return [
    getAge(u.dob) / 50,
    getRashi(u.dob) / 12,
    getNakshatra(u.dob) / 27,
    eduScore(u.education) / 5,
    incomeScore(u.income) / 5,
    u.religion === 'Hindu' ? 1 : u.religion === 'Muslim' ? 0.8 : u.religion === 'Christian' ? 0.6 : 0.4,
    getGana(u.dob) / 2,
  ]
}

function cosineSim(a, b) {
  const dot = a.reduce((s, v, i) => s + v * b[i], 0)
  const ma  = Math.sqrt(a.reduce((s, v) => s + v * v, 0))
  const mb  = Math.sqrt(b.reduce((s, v) => s + v * v, 0))
  return ma && mb ? dot / (ma * mb) : 0
}

function prefMatch(boy, girl) {
  let score = 0, total = 0
  // Age pref
  if (boy.prefAgeMin && boy.prefAgeMax) {
    total++; const age = getAge(girl.dob)
    if (age >= boy.prefAgeMin && age <= boy.prefAgeMax) score++
    else score += 0.5
  }
  if (girl.prefAgeMin && girl.prefAgeMax) {
    total++; const age = getAge(boy.dob)
    if (age >= girl.prefAgeMin && age <= girl.prefAgeMax) score++
    else score += 0.5
  }
  // Religion pref
  if (boy.prefReligion) { total++; if (boy.prefReligion === girl.religion) score++ }
  if (girl.prefReligion) { total++; if (girl.prefReligion === boy.religion) score++ }
  // City pref
  if (boy.prefCity) { total++; if (boy.prefCity === girl.city) score++ }
  if (girl.prefCity) { total++; if (girl.prefCity === boy.city) score++ }

  return total > 0 ? score / total : 0.7
}

// ─── Route ─────────────────────────────────────────────────────────────────

// GET /api/kundli/:userId
router.get('/:userId', protect, async (req, res) => {
  try {
    // Verify mutual match
    const interest = await Interest.findOne({
      $or: [
        { sender: req.user._id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user._id },
      ],
      status: 'accepted',
    })
    if (!interest) return res.status(403).json({ message: 'Kundli matching is only available after mutual acceptance.' })

    const [me, other] = await Promise.all([
      User.findById(req.user._id).select('name dob religion caste education income prefAgeMin prefAgeMax prefReligion prefCity gender'),
      User.findById(req.params.userId).select('name dob religion caste education income prefAgeMin prefAgeMax prefReligion prefCity gender'),
    ])
    if (!me || !other) return res.status(404).json({ message: 'User not found.' })

    // Determine boy/girl for Kundli
    const boy  = me.gender === 'male' ? me : other
    const girl = me.gender === 'male' ? other : me

    const gunas = calcGunas(boy, girl)
    const total = Object.values(gunas).reduce((s, v) => s + v, 0)
    const interp = gunaInterpretation(total)

    // Cosine AI compatibility
    const vA = toVector(me), vB = toVector(other)
    const cosine = cosineSim(vA, vB)
    const pref   = prefMatch(boy, girl)
    const aiScore = Math.round(((cosine * 0.5 + pref * 0.5) * 100))

    res.json({
      boy:  { name: boy.name,  dob: boy.dob,  rashi: getRashi(boy.dob),  nakshatra: getNakshatra(boy.dob) },
      girl: { name: girl.name, dob: girl.dob, rashi: getRashi(girl.dob), nakshatra: getNakshatra(girl.dob) },
      gunas,
      total,
      maxScore: 36,
      interpretation: interp,
      aiCompatibility: {
        score: aiScore,
        cosine: Math.round(cosine * 100),
        prefMatch: Math.round(pref * 100),
        label: aiScore >= 80 ? 'Highly Compatible' : aiScore >= 60 ? 'Compatible' : aiScore >= 40 ? 'Moderate' : 'Low Match',
      }
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
