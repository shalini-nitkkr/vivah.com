import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import Avatar from '../components/Avatar'

function calcAge(dob) {
  if (!dob) return ''
  return Math.floor((Date.now() - new Date(dob)) / (365.25 * 24 * 60 * 60 * 1000))
}

export default function ProfileView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { showToast } = useToast()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [interestSent, setInterestSent] = useState(false)
  const [isMatch, setIsMatch] = useState(false)

  useEffect(() => {
    axios.get(`/api/profile/${id}`)
      .then(r => setProfile(r.data.user))
      .catch(() => showToast('Profile not found', 'error'))
      .finally(() => setLoading(false))

    // Check if interest already sent
    axios.get('/api/interest/sent')
      .then(r => {
        const sent = r.data.interests.some(i => (i.receiver._id || i.receiver) === id)
        setInterestSent(sent)
      })
      .catch(() => {})

    // Check if mutual match
    axios.get('/api/interest/matches')
      .then(r => {
        const matched = r.data.matches.some(m => {
          return (m.sender._id === id || m.receiver._id === id)
        })
        setIsMatch(matched)
      })
      .catch(() => {})
  }, [id])

  const sendInterest = async () => {
    setSending(true)
    try {
      await axios.post('/api/interest/send', { receiverId: id })
      setInterestSent(true)
      showToast('Interest sent! 💌')
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not send interest', 'error')
    } finally { setSending(false) }
  }

  if (loading) return <div className="loading"><div className="spinner" /></div>
  if (!profile) return (
    <div className="page"><div className="container">
      <div className="empty"><div className="empty-icon">😕</div><p>Profile not found</p>
        <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/browse')}>Back to Browse</button>
      </div>
    </div></div>
  )

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 700 }}>
        <button className="btn btn-outline btn-sm" style={{ marginBottom: 20 }} onClick={() => navigate(-1)}>← Back</button>

        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <div>
              <Avatar
                name={profile.name}
                photo={profile.photo}
                gender={profile.gender}
                size={140}
                style={{ border: '3px solid var(--primary-light)' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              {/* <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
                <h1 style={{ fontSize: 26 }}>{profile.name}</h1>
                <span className={`badge ${profile.trustLevel >= 2 ? 'badge-trusted' : 'badge-basic'}`}>
                  {profile.trustLevel >= 2 ? '🛡 Trusted' : '⭐ Basic'}
                </span>
              </div> */}

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
                <h1 style={{ fontSize: 26 }}>{profile.name}</h1>
                <span className={`badge ${profile.trustLevel >= 2 ? 'badge-trusted' : 'badge-basic'}`}>
                  {profile.trustLevel >= 2 ? '🛡 Trusted' : '⭐ Basic'}
                </span>
                {profile.contactDegree === 1 && (
                  <span style={{ background: '#d1fae5', color: '#065f46', border: '1px solid #6ee7b7', borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>
                    🟢 Direct Contact
                  </span>
                )}
                {profile.contactDegree === 2 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ background: '#dbeafe', color: '#1e40af', border: '1px solid #93c5fd', borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>
                      🔵 Friend's Contact
                    </span>
                    {profile.viaName && (
                      <span style={{ fontSize: 11, color: '#2563eb', fontWeight: 500, paddingLeft: 4 }}>
                        via {profile.viaName}
                      </span>
                    )}
                  </div>
                )}
              </div>



              
              <p style={{ color: 'var(--text-muted)', marginBottom: 14, lineHeight: 1.8 }}>
                {calcAge(profile.dob) && <span>{calcAge(profile.dob)} years old</span>}
                {profile.city && <span> · {profile.city}</span>}
                {profile.state && <span>, {profile.state}</span>}
                {profile.religion && <><br /><span> {profile.religion}</span></>}
                {profile.caste && <span> · {profile.caste}</span>}
              </p>
              {profile.about && <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 16 }}>{profile.about}</p>}

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {/* Send interest button — hide if this is my profile */}
                {user?._id !== id && !isMatch && (
                  <button
                    className={`btn ${interestSent ? 'btn-outline' : 'btn-primary'}`}
                    onClick={sendInterest} disabled={interestSent || sending}
                  >
                    {interestSent ? '✓ Interest Sent' : sending ? 'Sending...' : '💌 Send Interest'}
                  </button>
                )}

                {/* Chat & Kundli — only for matches */}
                {isMatch && (
                  <>
                    <button className="btn btn-primary" onClick={() => navigate(`/chat/${id}`)}>
                      💬 Chat
                    </button>
                    <button
                      className="btn btn-outline"
                      style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}
                      onClick={() => navigate(`/kundli/${id}`)}
                    >
                      🔮 Kundli Match
                    </button>
                  </>
                )}
              </div>

              {isMatch && (
                <div style={{ marginTop: 12, background: '#d1fae5', border: '1px solid #6ee7b7', borderRadius: 8, padding: '8px 14px', fontSize: 13, color: '#065f46', fontWeight: 600 }}>
                  🎉 You are matched! Chat and explore Kundli compatibility.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: 20, fontSize: 18 }}>Details</h3>
          <div className="grid-2">
            {[
              ['Education', profile.education], ['Occupation', profile.occupation],
              ['Income', profile.income], ['Religion', profile.religion],
              ['Caste', profile.caste], ['City', profile.city],
            ].map(([label, val]) => val ? (
              <div key={label} style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{label}</div>
                <div style={{ fontSize: 15, marginTop: 3 }}>{val}</div>
              </div>
            ) : null)}
          </div>
        </div>
      </div>
    </div>
  )
}
