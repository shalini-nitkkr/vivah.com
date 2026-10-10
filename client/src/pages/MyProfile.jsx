import { useState, useRef } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

function calcAge(dob) {
  if (!dob) return ''
  return Math.floor((Date.now() - new Date(dob)) / (365.25 * 24 * 60 * 60 * 1000))
}

export default function MyProfile() {
  const { user, refreshUser } = useAuth()
  const { showToast } = useToast()
  const fileRef = useRef()
  const [editing, setEditing] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: user?.name || '', phone: user?.phone || '', religion: user?.religion || '',
    caste: user?.caste || '', city: user?.city || '', state: user?.state || '',
    education: user?.education || '', occupation: user?.occupation || '',
    income: user?.income || '', about: user?.about || '',
    prefAgeMin: user?.prefAgeMin || 18, prefAgeMax: user?.prefAgeMax || 50,
    prefReligion: user?.prefReligion || '', prefCity: user?.prefCity || '',
    prefIncomeMin: user?.prefIncomeMin || '', prefEducation: user?.prefEducation || '',
  })

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const save = async e => {
    e.preventDefault()
    setSaving(true)
    try {
      await axios.put('/api/profile/update', form)
      await refreshUser()
      setEditing(false)
      showToast('Profile updated!')
    } catch (err) {
      showToast(err.response?.data?.message || 'Update failed', 'error')
    } finally { setSaving(false) }
  }

  const uploadPhoto = async e => {
    const file = e.target.files[0]
    if (!file) return
    const fd = new FormData()
    fd.append('photo', file)
    setUploading(true)
    try {
      await axios.post('/api/profile/photo', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      await refreshUser()
      showToast('Photo uploaded!')
    } catch (err) {
      showToast(err.response?.data?.message || 'Upload failed', 'error')
    } finally { setUploading(false) }
  }

  if (!user) return <div className="loading"><div className="spinner" /></div>

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 720 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <h1 style={{ fontSize: 30 }}>My Profile</h1>
          <button className="btn btn-outline" onClick={() => setEditing(v => !v)}>
            {editing ? 'Cancel' : ' Edit Profile'}
          </button>
        </div>

        {/* Photo + basic info */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              {user.photo
                ? <img src={user.photo} alt={user.name} style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary-light)' }} />
                : <div style={{ width: 120, height: 120, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56 }}>
                  {user.gender === 'female' ? 'F' : 'M'}
                </div>
              }
              <button className="btn btn-sm btn-outline" style={{ marginTop: 10, width: 120 }}
                onClick={() => fileRef.current.click()} disabled={uploading}>
                {uploading ? 'Uploading...' : 'Change Photo'}
              </button>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={uploadPhoto} />
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: 24, marginBottom: 6 }}>{user.name}</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: 10 }}>
                {calcAge(user.dob) && `${calcAge(user.dob)} years`}
                {user.city && ` · ${user.city}`}
                {user.religion && ` · ${user.religion}`}
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <span className={`badge ${user.trustLevel >= 2 ? 'badge-trusted' : 'badge-basic'}`}>
                  {user.trustLevel >= 2 ? '🛡 Trusted Member' : 'Basic Member'}
                </span>
                {user.vouchCount > 0 && (
                  <span className="badge badge-pending">👥 {user.vouchCount} vouches</span>
                )}
              </div>
              {user.about && <p style={{ marginTop: 12, fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>{user.about}</p>}
            </div>
          </div>
        </div>

        {/* Edit form */}
        {editing ? (
          <div className="card">
            <h3 style={{ marginBottom: 20, fontSize: 18 }}>Edit Details</h3>
            <form onSubmit={save}>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Name</label>
                  <input className="form-input" value={form.name} onChange={set('name')} /></div>
                <div className="form-group"><label className="form-label">Phone</label>
                  <input className="form-input" value={form.phone} onChange={set('phone')} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Religion</label>
                  <input className="form-input" placeholder="e.g. Hindu" value={form.religion} onChange={set('religion')} /></div>
                <div className="form-group"><label className="form-label">Caste</label>
                  <input className="form-input" placeholder="e.g. Brahmin" value={form.caste} onChange={set('caste')} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">City</label>
                  <input className="form-input" placeholder="e.g. Mumbai" value={form.city} onChange={set('city')} /></div>
                <div className="form-group"><label className="form-label">State</label>
                  <input className="form-input" placeholder="e.g. Maharashtra" value={form.state} onChange={set('state')} /></div>
              </div>


              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Preferred Min Income</label>
                  <select className="form-input form-select" value={form.prefIncomeMin} onChange={set('prefIncomeMin')}>
                    <option value="">Any</option>
                    <option value="2-5 LPA">2-5 LPA</option>
                    <option value="5-10 LPA">5-10 LPA</option>
                    <option value="10-20 LPA">10-20 LPA</option>
                    <option value="Above 20 LPA">Above 20 LPA</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Preferred Education</label>
                  <select className="form-input form-select" value={form.prefEducation} onChange={set('prefEducation')}>
                    <option value="">Any</option>
                    {['B.Tech', 'MBA', 'MCA', 'BCA', 'MBBS', 'B.Com', 'M.Tech', 'PhD'].map(e =>
                      <option key={e} value={e}>{e}</option>
                    )}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group"><label className="form-label">Education</label>
                  <input className="form-input" placeholder="e.g. B.Tech" value={form.education} onChange={set('education')} /></div>
                <div className="form-group"><label className="form-label">Occupation</label>
                  <input className="form-input" placeholder="e.g. Software Engineer" value={form.occupation} onChange={set('occupation')} /></div>
              </div>
              <div className="form-group"><label className="form-label">Annual Income</label>
                <select className="form-input form-select" value={form.income} onChange={set('income')}>
                  <option value="">Select...</option>
                  {['Below 2 LPA', '2-5 LPA', '5-10 LPA', '10-20 LPA', 'Above 20 LPA'].map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div className="form-group"><label className="form-label">About Me</label>
                <textarea className="form-input" rows={3} placeholder="Write something about yourself..."
                  value={form.about} onChange={set('about')} style={{ resize: 'vertical' }} /></div>

              <h4 style={{ margin: '20px 0 12px', fontSize: 15 }}>Partner Preferences</h4>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Min Age</label>
                  <input type="number" className="form-input" min={18} max={70} value={form.prefAgeMin} onChange={set('prefAgeMin')} /></div>
                <div className="form-group"><label className="form-label">Max Age</label>
                  <input type="number" className="form-input" min={18} max={70} value={form.prefAgeMax} onChange={set('prefAgeMax')} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Preferred Religion</label>
                  <input className="form-input" placeholder="Any" value={form.prefReligion} onChange={set('prefReligion')} /></div>
                <div className="form-group"><label className="form-label">Preferred City</label>
                  <input className="form-input" placeholder="Any" value={form.prefCity} onChange={set('prefCity')} /></div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : '💾 Save Changes'}</button>
                <button type="button" className="btn btn-outline" onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </form>
          </div>
        ) : (
          /* View mode */
          <div className="card">
            <h3 style={{ marginBottom: 20, fontSize: 18 }}>Profile Details</h3>
            <div className="grid-2">
              {[
                ['Religion', user.religion], ['Caste', user.caste],
                ['City', user.city], ['State', user.state],
                ['Education', user.education], ['Occupation', user.occupation],
                ['Income', user.income], ['Phone', user.phone],
                ['Email', user.email],
              ].map(([label, val]) => val ? (
                <div key={label} style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: .04 }}>{label}</div>
                  <div style={{ fontSize: 15, marginTop: 2 }}>{val}</div>
                </div>
              ) : null)}
            </div>
            {!user.city && !user.religion && !user.education && (
              <div className="alert alert-info">
                Your profile is incomplete. Click <strong>Edit Profile</strong> to add details and attract better matches!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
