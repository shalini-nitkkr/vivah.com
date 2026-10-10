import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useToast } from '../context/ToastContext'
import Avatar from '../components/Avatar'

const RASHI_NAMES = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces']
const RASHI_SYMBOLS = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓']
const NAKSHATRA_NAMES = [
  'Ashwini','Bharani','Krittika','Rohini','Mrigashira','Ardra','Punarvasu','Pushya','Ashlesha',
  'Magha','Purva Phalguni','Uttara Phalguni','Hasta','Chitra','Swati','Vishakha','Anuradha',
  'Jyeshtha','Mula','Purva Ashadha','Uttara Ashadha','Shravana','Dhanishtha','Shatabhisha',
  'Purva Bhadrapada','Uttara Bhadrapada','Revati'
]

const GUNA_INFO = {
  varna:       { label: 'Varna',        max: 1,  desc: 'Spiritual compatibility & caste' },
  vashya:      { label: 'Vashya',       max: 2,  desc: 'Attraction & mutual control' },
  tara:        { label: 'Tara',         max: 3,  desc: 'Destiny, health & well-being' },
  yoni:        { label: 'Yoni',         max: 4,  desc: 'Intimate & physical compatibility' },
  grahaMaitri: { label: 'Graha Maitri', max: 5,  desc: 'Mental compatibility & friendship' },
  gana:        { label: 'Gana',         max: 6,  desc: 'Temperament & nature match' },
  bhakoot:     { label: 'Bhakoot',      max: 7,  desc: 'Love, family & career' },
  nadi:        { label: 'Nadi',         max: 8,  desc: 'Health, genes & progeny' },
}

function ScoreBar({ value, max, color }) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div style={{ background: '#f3f4f6', borderRadius: 999, height: 8, overflow: 'hidden', flex: 1 }}>
      <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 999, transition: 'width 0.8s ease' }} />
    </div>
  )
}

function CircleScore({ total, max = 36, color, emoji }) {
  const pct = total / max
  const r = 54, cx = 64, cy = 64
  const circ = 2 * Math.PI * r
  const dash = circ * pct
  return (
    <svg width="128" height="128" viewBox="0 0 128 128">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f3f4f6" strokeWidth="10" />
      <circle
        cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="10"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 64 64)"
        style={{ transition: 'stroke-dasharray 1s ease' }}
      />
      <text x={cx} y={cy - 8} textAnchor="middle" fontSize="26" fontWeight="bold" fill={color}>{total}</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize="12" fill="#6b7280">out of {max}</text>
      <text x={cx} y={cy + 30} textAnchor="middle" fontSize="18">{emoji}</text>
    </svg>
  )
}

export default function KundliMatch() {
  const { userId: otherId } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [data, setData] = useState(null)
  const [otherUser, setOtherUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      axios.get(`/api/kundli/${otherId}`),
      axios.get(`/api/profile/${otherId}`),
    ])
      .then(([k, p]) => {
        setData(k.data)
        setOtherUser(p.data.user)
      })
      .catch(err => {
        if (err.response?.status === 403) {
          showToast('Kundli matching is only available after mutual acceptance', 'error')
          navigate('/matches')
        } else {
          showToast('Could not load Kundli data', 'error')
        }
      })
      .finally(() => setLoading(false))
  }, [otherId])

  if (loading) return <div className="loading"><div className="spinner" /></div>
  if (!data) return null

  const { boy, girl, gunas, total, interpretation, aiCompatibility } = data
  const gunaColor = interpretation.color

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 760 }}>
        <button className="btn btn-outline btn-sm" style={{ marginBottom: 20 }} onClick={() => navigate(-1)}>← Back</button>

        {/* Header */}
        <div className="card" style={{ marginBottom: 20, textAlign: 'center', background: 'linear-gradient(135deg, #fff5f5, #fff9f0)' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🔮</div>
          <h1 style={{ fontSize: 26, marginBottom: 6, color: 'var(--primary)' }}>Kundli Compatibility</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Traditional Ashtakoot Guna Milan · 36-point system</p>

          {/* Boy-Girl names */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, marginTop: 20 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>♂</div>
              <div style={{ fontWeight: 700, fontSize: 17 }}>{boy.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{RASHI_SYMBOLS[boy.rashi]} {RASHI_NAMES[boy.rashi]}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{NAKSHATRA_NAMES[boy.nakshatra]}</div>
            </div>
            <div style={{ fontSize: 36 }}>❤️</div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>♀</div>
              <div style={{ fontWeight: 700, fontSize: 17 }}>{girl.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{RASHI_SYMBOLS[girl.rashi]} {RASHI_NAMES[girl.rashi]}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{NAKSHATRA_NAMES[girl.nakshatra]}</div>
            </div>
          </div>
        </div>

        {/* Total score */}
        <div className="card" style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap' }}>
          <div style={{ flex: '0 0 auto' }}>
            <CircleScore total={total} max={36} color={gunaColor} emoji={interpretation.emoji} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: gunaColor, marginBottom: 4 }}>
              {interpretation.emoji} {interpretation.level} Match
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.7 }}>
              {total >= 32 && 'An exceptional match! This is considered a divine union with near-perfect compatibility across all dimensions.'}
              {total >= 28 && total < 32 && 'A very auspicious match. You share deep compatibility in most life areas.'}
              {total >= 24 && total < 28 && 'A good match with solid compatibility. Minor differences can be worked through.'}
              {total >= 18 && total < 24 && 'An average match. This union can work well with mutual understanding and effort.'}
              {total < 18 && 'Compatibility needs careful consideration. Seek guidance from a qualified Jyotishi.'}
            </div>
            <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {total >= 18 && (
                <span style={{ background: '#d1fae5', color: '#065f46', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                  ✓ Marriage Recommended
                </span>
              )}
              {total < 18 && (
                <span style={{ background: '#fee2e2', color: '#dc2626', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                  ⚠ Seek Expert Advice
                </span>
              )}
            </div>
          </div>
        </div>

        {/* AI Compatibility */}
        <div className="card" style={{ marginBottom: 20, background: 'linear-gradient(135deg, #eef2ff, #fdf4ff)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <span style={{ fontSize: 24 }}>🤖</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 17 }}>AI Compatibility Score</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Cosine similarity · Profile preferences · Lifestyle matching</div>
            </div>
            <div style={{ marginLeft: 'auto', fontSize: 28, fontWeight: 800, color: '#6366f1' }}>
              {aiCompatibility.score}%
            </div>
          </div>

          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 120 }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Profile Similarity</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ScoreBar value={aiCompatibility.cosine} max={100} color="#6366f1" />
                <span style={{ fontSize: 12, fontWeight: 600, minWidth: 36 }}>{aiCompatibility.cosine}%</span>
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 120 }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Preference Match</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ScoreBar value={aiCompatibility.prefMatch} max={100} color="#8b5cf6" />
                <span style={{ fontSize: 12, fontWeight: 600, minWidth: 36 }}>{aiCompatibility.prefMatch}%</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 14, background: '#fff', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#4338ca' }}>
            <strong>AI says:</strong> {
              aiCompatibility.score >= 80 ? 'Your profiles are highly aligned! You share similar life goals, backgrounds, and preferences.' :
              aiCompatibility.score >= 60 ? 'Good alignment between your profiles. Your core values and preferences are compatible.' :
              aiCompatibility.score >= 40 ? 'Moderate compatibility. You may have some differences to navigate together.' :
              'Significant differences in profile attributes. Open communication will be essential.'
            }
          </div>
        </div>

        {/* Ashtakoot Gunas table */}
        <div className="card" style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 18, marginBottom: 18 }}>🏆 Ashtakoot Guna Details</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {Object.entries(GUNA_INFO).map(([key, info]) => {
              const score = gunas[key]
              const pct = score / info.max
              const color = pct >= 0.7 ? '#059669' : pct >= 0.4 ? '#d97706' : '#dc2626'
              return (
                <div key={key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div>
                      <span style={{ fontWeight: 600, fontSize: 15 }}>{info.label}</span>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 8 }}>{info.desc}</span>
                    </div>
                    <span style={{ fontWeight: 700, color, fontSize: 15, minWidth: 52, textAlign: 'right' }}>
                      {score} / {info.max}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <ScoreBar value={score} max={info.max} color={color} />
                    <span style={{ fontSize: 12, color: pct === 1 ? '#059669' : pct === 0 ? '#dc2626' : 'var(--text-muted)', minWidth: 60, textAlign: 'right' }}>
                      {pct === 1 ? '✓ Full' : pct === 0 ? '✗ None' : `${Math.round(pct * 100)}%`}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
          <div style={{ marginTop: 18, padding: 14, background: '#f8fafc', borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: 16 }}>Total Gunas</span>
            <span style={{ fontWeight: 800, fontSize: 22, color: gunaColor }}>{total} / 36</span>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => navigate(`/chat/${otherId}`)}>
            💬 Chat Now
          </button>
          <button className="btn btn-outline" onClick={() => navigate(`/profile/${otherId}`)}>
            View Profile
          </button>
        </div>
      </div>
    </div>
  )
}
