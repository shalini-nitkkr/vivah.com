const express = require('express')
const router = require('express').Router()
const path = require('path')
const multer = require('multer')
const User = require('../models/User')
const { protect } = require('../middleware/auth')
const neo4j = require('neo4j-driver')

// Neo4j driver (reused across requests)
let _driver = null
function getDriver() {
  if (!_driver) {
    _driver = neo4j.driver(
      process.env.NEO4J_URI || 'bolt://127.0.0.1:7687',
      neo4j.auth.basic(
        process.env.NEO4J_USER || 'neo4j',
        process.env.NEO4J_PASS || 'password'
      ),
      { encrypted: false, trust: 'TRUST_ALL_CERTIFICATES' }
    )
  }
  return _driver
}

// Helper — get degree (1/2/3) for a list of phones relative to myPhone
// Returns map: { "9876543210": 1, "9123456789": 2, ... }
// async function getDegreesFromNeo4j(myPhone, targetPhones) {
//   if (!myPhone || !targetPhones.length) return {}
//   const session = getDriver().session()
//   try {
//     const result = await session.run(`
//       MATCH (me:User {phone: $myPhone})
//       UNWIND $phones AS tp
//       OPTIONAL MATCH p1 = (me)-[:HAS_CONTACT]->(:User {phone: tp})
//       OPTIONAL MATCH p2 = (me)-[:HAS_CONTACT]->(:User)-[:HAS_CONTACT]->(:User {phone: tp})
//       WITH tp,
//         CASE
//           WHEN p1 IS NOT NULL THEN 1
//           WHEN p2 IS NOT NULL THEN 2
//           ELSE 3
//         END AS degree
//       RETURN tp AS phone, degree
//     `, { myPhone, phones: targetPhones })

//     const map = {}
//     result.records.forEach(r => {
//       map[r.get('phone')] = r.get('degree').toNumber()
//     })
//     return map
//   } catch (err) {
//     console.error('Neo4j degree query failed:', err.message)
//     return {}  // fall back gracefully — all profiles show as unknown
//   } finally {
//     await session.close()
//   }
// }

async function getDegreesFromNeo4j(myPhone, targetPhones) {
  if (!myPhone || !targetPhones.length) return {}
  const session = getDriver().session()
  try {
    const result = await session.run(`
      MATCH (me:User {phone: $myPhone})
      UNWIND $phones AS tp
      OPTIONAL MATCH (me)-[:HAS_CONTACT]->(direct:User {phone: tp})
      OPTIONAL MATCH (me)-[:HAS_CONTACT]->(via:User)-[:HAS_CONTACT]->(friend:User {phone: tp})
      WITH tp,
        CASE
          WHEN direct IS NOT NULL THEN 1
          WHEN via IS NOT NULL THEN 2
          ELSE 3
        END AS degree,
        CASE
          WHEN via IS NOT NULL THEN via.name
          ELSE null
        END AS viaName
      RETURN tp AS phone, degree, viaName
    `, { myPhone, phones: targetPhones })

    const map = {}
    result.records.forEach(r => {
      map[r.get('phone')] = {
        degree: r.get('degree').toNumber(),
        viaName: r.get('viaName') || null,
      }
    })
    return map
  } catch (err) {
    console.error('Neo4j degree query failed:', err.message)
    return {}
  } finally {
    await session.close()
  }
}

// Multer setup — save photos to server/uploads/
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads')),
  filename: (req, file, cb) => cb(null, `${req.user._id}_${Date.now()}${path.extname(file.originalname)}`)
})
const upload = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 }, // 3MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true)
    else cb(new Error('Only image files allowed'))
  }
})

// GET /api/profile/me
router.get('/me', protect, async (req, res) => {
  res.json({ user: req.user })
})

// PUT /api/profile/update
router.put('/update', protect, async (req, res) => {
  try {
    // const fields = ['name', 'phone', 'religion', 'caste', 'city', 'state', 'education',
    //   'occupation', 'income', 'about', 'prefAgeMin', 'prefAgeMax', 'prefReligion', 'prefCity']

    const fields = ['name', 'phone', 'religion', 'caste', 'city', 'state', 'education',
      'occupation', 'income', 'about', 'prefAgeMin', 'prefAgeMax',
      'prefReligion', 'prefCity', 'prefIncomeMin', 'prefEducation']

    const update = {}
    fields.forEach(f => { if (req.body[f] !== undefined) update[f] = req.body[f] })

    const user = await User.findByIdAndUpdate(req.user._id, update, { new: true }).select('-password')
    res.json({ message: 'Profile updated!', user })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/profile/photo
router.post('/photo', protect, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded.' })
    const photoUrl = `/uploads/${req.file.filename}`
    const user = await User.findByIdAndUpdate(req.user._id, { photo: photoUrl }, { new: true }).select('-password')
    res.json({ message: 'Photo uploaded!', photo: photoUrl, user })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/profile/search  — browse profiles sorted by Neo4j contact degree
router.get('/search', protect, async (req, res) => {
  try {
    // const { gender, religion, city, ageMin, ageMax, degree, page = 1, limit = 12 } = req.query

    const { gender, religion, city, ageMin, ageMax, income, degree, page = 1, limit = 1000 } = req.query

    // ── Step 1: Build MongoDB filter ────────────────────────────────────────
    const query = { _id: { $ne: req.user._id }, active: true }

    if (gender) query.gender = gender
    if (religion) query.religion = { $regex: religion, $options: 'i' }
    if (city) query.city = { $regex: city, $options: 'i' }
    if (income) query.income = income

    // ── Auto-apply user preferences if no manual filter given ──────────────
    // Opposite gender auto filter
    if (!gender && req.user.gender) {
      query.gender = req.user.gender === 'male' ? 'female' : 'male'
    }

    // Preferred religion
    // if (!religion && req.user.prefReligion) {
    //   query.religion = { $regex: req.user.prefReligion, $options: 'i' }
    // }

    // Preferred city
    if (!city && req.user.prefCity) {
      query.city = { $regex: req.user.prefCity, $options: 'i' }
    }



    // if (ageMin || ageMax) {
    //   const today = new Date()
    //   query.dob = {}
    //   if (ageMin) query.dob.$lte = new Date(today.getFullYear() - parseInt(ageMin), today.getMonth(), today.getDate())
    //   if (ageMax) query.dob.$gte = new Date(today.getFullYear() - parseInt(ageMax), today.getMonth(), today.getDate())
    // }

    // Use manual age filters OR fall back to user preferences
    const effectiveAgeMin = ageMin 
    // || req.user.prefAgeMin
    const effectiveAgeMax = ageMax 
    // || req.user.prefAgeMax

    if (effectiveAgeMin || effectiveAgeMax) {
      const today = new Date()
      query.dob = {}
      if (effectiveAgeMin) query.dob.$lte = new Date(today.getFullYear() - parseInt(effectiveAgeMin), today.getMonth(), today.getDate())
      if (effectiveAgeMax) query.dob.$gte = new Date(today.getFullYear() - parseInt(effectiveAgeMax), today.getMonth(), today.getDate())
    }


    // ── Step 2: Fetch all matching users from MongoDB (without pagination yet)
    // We fetch all first so Neo4j can sort them by degree before we paginate
    const allUsers = await User.find(query)
      .select('-password -email')   // keep phone — needed for Neo4j lookup
      .lean()                       // plain JS objects, faster

    if (allUsers.length === 0) {
      return res.json({ users: [], total: 0, page: 1, totalPages: 0 })
    }

    // ── Step 3: Ask Neo4j for degree of each profile ─────────────────────────
    const myPhone = req.user.phone?.replace(/\D/g, '').slice(-10)
    const targetPhones = allUsers
      .map(u => u.phone?.replace(/\D/g, '').slice(-10))
      .filter(Boolean)

    const degreeMap = await getDegreesFromNeo4j(myPhone, targetPhones)

    // ── Step 4: Attach degree + compatibility score to each user ─────────────
    // const withDegree = allUsers.map(u => {
    //   const phone10 = u.phone?.replace(/\D/g, '').slice(-10)
    //   const deg = degreeMap[phone10] || 3   // default = unknown

    const withDegree = allUsers.map(u => {
      const phone10 = u.phone?.replace(/\D/g, '').slice(-10)
      const degInfo = degreeMap[phone10] || { degree: 3, viaName: null }
      const deg = degInfo.degree
      const viaName = degInfo.viaName

      // Compatibility score — how well do they match your preferences?
      let compatScore = 0
      if (req.user.prefCity && u.city === req.user.prefCity) compatScore += 3
      if (req.user.prefReligion && u.religion === req.user.prefReligion) compatScore += 2
      if (req.user.prefAgeMin && req.user.prefAgeMax && u.dob) {
        const age = Math.floor((Date.now() - new Date(u.dob)) / (365.25 * 24 * 60 * 60 * 1000))
        if (age >= req.user.prefAgeMin && age <= req.user.prefAgeMax) compatScore += 2
      }

      // Hide phone from response (only show after match)
      const safe = { ...u }
      delete safe.phone

      // return { ...safe, contactDegree: deg, compatScore }
      return { ...safe, contactDegree: deg, viaName: deg === 2 ? viaName : null, compatScore }
    })

    // ── Step 5: Filter by degree if requested (degree=1 or degree=2) ─────────
    let filtered = withDegree
    if (degree) {
      filtered = withDegree.filter(u => u.contactDegree === parseInt(degree))
    }

    // ── Step 6: Sort — degree first (1→2→3), then compatScore, then newest ───
    filtered.sort((a, b) => {
      if (a.contactDegree !== b.contactDegree) return a.contactDegree - b.contactDegree
      if (b.compatScore !== a.compatScore) return b.compatScore - a.compatScore
      return new Date(b.createdAt) - new Date(a.createdAt)
    })

    // ── Step 7: Paginate after sorting ───────────────────────────────────────
    const total = filtered.length
    const pageNum = parseInt(page)
    const limitNum = parseInt(limit)
    const paginated = filtered.slice((pageNum - 1) * limitNum, pageNum * limitNum)

    res.json({
      users: paginated,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      degreeCounts: {
        direct: withDegree.filter(u => u.contactDegree === 1).length,
        friend: withDegree.filter(u => u.contactDegree === 2).length,
        unknown: withDegree.filter(u => u.contactDegree === 3).length,
      }
    })
  } catch (err) {
    console.error('Search error:', err)
    res.status(500).json({ message: err.message })
  }
})

// GET /api/profile/:id — view one profile
// router.get('/:id', protect, async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id).select('-password -email -phone')
//     if (!user) return res.status(404).json({ message: 'Profile not found.' })
//     res.json({ user })
//   } catch (err) {
//     res.status(500).json({ message: err.message })
//   }
// })

// GET /api/profile/:id — view one profile
router.get('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -email').lean()
    if (!user) return res.status(404).json({ message: 'Profile not found.' })

    // Attach contact degree + viaName from Neo4j
    const myPhone = req.user.phone?.replace(/\D/g, '').slice(-10)
    const theirPhone = user.phone?.replace(/\D/g, '').slice(-10)

    let contactDegree = 3, viaName = null
    if (myPhone && theirPhone) {
      const degreeMap = await getDegreesFromNeo4j(myPhone, [theirPhone])
      const info = degreeMap[theirPhone]
      if (info) { contactDegree = info.degree; viaName = info.viaName }
    }

    // Strip phone from response
    delete user.phone
    res.json({ user: { ...user, contactDegree, viaName } })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
