import { useNavigate } from 'react-router-dom'
import Avatar from './Avatar'

function calcAge(dob) {
  if (!dob) return ''
  const diff = Date.now() - new Date(dob).getTime()
  return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000))
}

export default function ProfileCard({ user, onSendInterest, interestSent }) {
  const navigate = useNavigate()

  return (
    <div className="profile-card" onClick={() => navigate(`/profile/${user._id}`)}>
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', paddingTop: 20 }}>
        <Avatar
          name={user.name}
          photo={user.photo}
          gender={user.gender}
          size={88}
          className="profile-card-photo"
          style={{ border: '3px solid var(--primary-light)' }}
        />
      </div>
      <div className="profile-card-body">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <div className="profile-card-name">{user.name}</div>
          {user.contactDegree === 1 && (
            <span style={{ background: '#d1fae5', color: '#065f46', border: '1px solid #6ee7b7', borderRadius: 20, padding: '3px 9px', fontSize: 11, fontWeight: 700 }}>
              Direct
            </span>
          )}
          {/* {user.contactDegree === 2 && (
            <span style={{ background: '#dbeafe', color: '#1e40af', border: '1px solid #93c5fd', borderRadius: 20, padding: '3px 9px', fontSize: 11, fontWeight: 700 }}>
              Friend&apos;s Contact
            </span>
          )} */}

          {user.contactDegree === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
              <span style={{ background: '#dbeafe', color: '#1e40af', border: '1px solid #93c5fd', borderRadius: 20, padding: '3px 9px', fontSize: 11, fontWeight: 700 }}>
                🔵 Friend&apos;s Contact
              </span>
              {user.viaName && (
                <span style={{ fontSize: 10, color: '#2563eb', fontWeight: 500 }}>
                  via {user.viaName}
                </span>
              )}
            </div>
          )}






          
          {(!user.contactDegree || user.contactDegree === 3) && (
            <span style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fcd34d', borderRadius: 20, padding: '3px 9px', fontSize: 11, fontWeight: 700 }}>
              Unknown
            </span>
          )}
        </div>
        <div className="profile-card-meta">
          {calcAge(user.dob) && <span>{calcAge(user.dob)} yrs</span>}
          {user.city && <span> · {user.city}</span>}
          {user.religion && <span> · {user.religion}</span>}<br />
          {user.education && <span>{user.education}</span>}
          {user.occupation && <span> · {user.occupation}</span>}
        </div>
        <button
          className={`btn btn-sm btn-block ${interestSent ? 'btn-outline' : 'btn-primary'}`}
          onClick={e => { e.stopPropagation(); if (!interestSent) onSendInterest(user._id) }}
          disabled={interestSent}
        >
          {interestSent ? '✓ Interest Sent' : 'Send Interest'}
        </button>
      </div>
    </div>
  )
}
