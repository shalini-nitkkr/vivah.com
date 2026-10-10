import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../context/ToastContext'

function calcAge(dob) {
  if (!dob) return ''
  return Math.floor((Date.now() - new Date(dob)) / (365.25 * 24 * 60 * 60 * 1000))
}

function InterestCard({ interest, type, onAccept, onReject }) {
  const person = type === 'received' ? interest.sender : interest.receiver
  const navigate = useNavigate()
  if (!person) return null

  const statusColor = { pending: 'badge-pending', accepted: 'badge-trusted', rejected: '' }

  return (
    <div className="interest-card">
      <div onClick={() => navigate(`/profile/${person._id}`)} style={{ cursor: 'pointer' }}>
        {person.photo
          ? <img src={person.photo} alt={person.name} className="interest-photo" />
          : <div className="interest-photo-placeholder">{person.gender === 'female' ? 'F' : 'M'}</div>
        }
      </div>
      <div className="interest-info">
        <div className="interest-name" style={{ cursor: 'pointer' }} onClick={() => navigate(`/profile/${person._id}`)}>
          {person.name}
        </div>
        <div className="interest-meta">
          {calcAge(person.dob) && `${calcAge(person.dob)} yrs`}
          {person.city && ` · ${person.city}`}
          {person.gender && ` · ${person.gender}`}
        </div>
        {interest.message && <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4, fontStyle: 'italic' }}>"{interest.message}"</div>}
        <span className={`badge ${statusColor[interest.status] || 'badge-basic'}`} style={{ marginTop: 6 }}>
          {interest.status === 'pending' ? '⏳ Pending' : interest.status === 'accepted' ? 'Accepted' : 'Rejected'}
        </span>
      </div>
      {type === 'received' && interest.status === 'pending' && (
        <div className="interest-actions">
          <button className="btn btn-success btn-sm" onClick={() => onAccept(interest._id)}>✓ Accept</button>
          <button className="btn btn-danger btn-sm" onClick={() => onReject(interest._id)}>✕ Reject</button>
        </div>
      )}
    </div>
  )
}

export default function Interests() {
  const { showToast } = useToast()
  const [tab, setTab] = useState('received')
  const [received, setReceived] = useState([])
  const [sent, setSent] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [r, s] = await Promise.all([
        axios.get('/api/interest/received'),
        axios.get('/api/interest/sent'),
      ])
      setReceived(r.data.interests)
      setSent(s.data.interests)
    } catch {
      showToast('Could not load interests', 'error')
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchAll() }, [])

  const respond = async (id, action) => {
    try {
      await axios.put(`/api/interest/${id}/respond`, { action })
      showToast(action === 'accept' ? 'Interest accepted! 🎉' : 'Interest rejected.')
      fetchAll()
    } catch (err) {
      showToast(err.response?.data?.message || 'Action failed', 'error')
    }
  }

  const pendingCount = received.filter(i => i.status === 'pending').length

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 700 }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 30, marginBottom: 8 }}>Interests</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage the interests you received and sent</p>
        </div>

        <div className="tabs">
          <button className={`tab-btn ${tab === 'received' ? 'active' : ''}`} onClick={() => setTab('received')}>
            Received {pendingCount > 0 && <span style={{ background: 'var(--primary)', color: '#fff', borderRadius: '50%', width: 20, height: 20, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, marginLeft: 6 }}>{pendingCount}</span>}
          </button>
          <button className={`tab-btn ${tab === 'sent' ? 'active' : ''}`} onClick={() => setTab('sent')}>
            Sent ({sent.length})
          </button>
        </div>

        {loading ? (
          <div className="loading"><div className="spinner" /></div>
        ) : tab === 'received' ? (
          received.length === 0 ? (
            <div className="empty"><div className="empty-icon"></div><p>No interests received yet</p></div>
          ) : (
            received.map(i => <InterestCard key={i._id} interest={i} type="received"
              onAccept={id => respond(id, 'accept')} onReject={id => respond(id, 'reject')} />)
          )
        ) : (
          sent.length === 0 ? (
            <div className="empty"><div className="empty-icon"></div><p>You haven't sent any interests yet</p></div>
          ) : (
            sent.map(i => <InterestCard key={i._id} interest={i} type="sent" />)
          )
        )}
      </div>
    </div>
  )
}
