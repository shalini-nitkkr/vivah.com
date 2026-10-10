import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import Avatar from '../components/Avatar'

function calcAge(dob) {
  if (!dob) return ''
  return Math.floor((Date.now() - new Date(dob)) / (365.25 * 24 * 60 * 60 * 1000))
}

function MatchCard({ match, other }) {
  const navigate = useNavigate()

  return (
    <div
      className="card"
      style={{
        display: 'flex', gap: 20, alignItems: 'flex-start',
        border: '1px solid var(--border)',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Avatar */}
      <div style={{ cursor: 'pointer', flexShrink: 0 }} onClick={() => navigate(`/profile/${other._id}`)}>
        <Avatar
          name={other.name}
          photo={other.photo}
          gender={other.gender}
          size={90}
          style={{ border: '3px solid var(--primary-light)' }}
        />
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ marginBottom: 8 }}>
          <h3 style={{ fontSize: 20, cursor: 'pointer' }} onClick={() => navigate(`/profile/${other._id}`)}>
            {other.name}
          </h3>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 6, lineHeight: 1.7 }}>
          {calcAge(other.dob) && <span>{calcAge(other.dob)} yrs</span>}
          {other.city && <span> · {other.city}</span>}
          {other.religion && <span> · {other.religion}</span>}
          {other.occupation && <><br /><span> {other.occupation}</span></>}
        </p>

        {/* Contact info */}
        {/* <div style={{
          marginTop: 14,
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: 8, padding: 12,
        }}> */}
          {/* <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>
            📋 Contact Details
          </div>
          <div style={{ fontSize: 14, display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {other.phone && <span>📱 {other.phone}</span>}
            {other.email && <span>✉️ {other.email}</span>}
          </div> */}
        {/* </div> */}

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => navigate(`/chat/${other._id}`)}
          >
            💬 Chat
          </button>
          <button
            className="btn btn-sm"
            style={{ background: 'var(--primary-light)', color: 'var(--primary)', border: '1px solid var(--primary)' }}
            onClick={() => navigate(`/kundli/${other._id}`)}
          >
            🔮 Kundli Match
          </button>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => navigate(`/profile/${other._id}`)}>
            View Profile →
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Matches() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/interest/matches')
      .then(r => {
        const sorted = r.data.matches.sort((a, b) =>
          new Date(b.updatedAt) - new Date(a.updatedAt)
        )
        setMatches(sorted)
      })
      .catch(() => showToast('Could not load matches', 'error'))
      .finally(() => setLoading(false))
  }, [])

  const getOther = (match) =>
    match.sender._id === user?._id ? match.receiver : match.sender

  if (loading) return <div className="loading"><div className="spinner" /></div>

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 750 }}>

        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 30, marginBottom: 8 }}>💑 My Matches</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            People who accepted your interest — chat, view Kundli compatibility, and connect!
          </p>
        </div>

        {matches.length > 0 && (
          <div className="card" style={{ display: 'inline-block', textAlign: 'center', padding: '16px 32px', marginBottom: 24 }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--primary)' }}>{matches.length}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Total Matches</div>
          </div>
        )}

        {matches.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">💑</div>
            <p style={{ fontSize: 18, fontWeight: 600 }}>No matches yet</p>
            <p style={{ marginTop: 8, color: 'var(--text-muted)' }}>
              Browse profiles and send interests to get matches!
            </p>
            <a href="/browse" className="btn btn-primary" style={{ marginTop: 20, display: 'inline-block' }}>
              Browse Profiles →
            </a>
          </div>

        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {matches.map((match) => {
              const other = getOther(match)
              return <MatchCard key={match._id} match={match} other={other} />
            })}
          </div>
        )}
      </div>
    </div>
  )
}
