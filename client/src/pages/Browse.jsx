import { useState, useEffect } from 'react'
import axios from 'axios'
import ProfileCard from '../components/ProfileCard'
import { useToast } from '../context/ToastContext'
import { useAuth } from '../context/AuthContext'

export default function Browse() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [sentIds, setSentIds] = useState(new Set())
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [degreeCounts, setDegreeCounts] = useState({ direct: 0, friend: 0, unknown: 0 })
  // const [filters, setFilters] = useState({
  //   gender:'', religion:'', city:'', ageMin:'', ageMax:'', degree:''
  // })

  const [filters, setFilters] = useState({
    gender: '', religion: '', city: '', ageMin: '', ageMax: '', income: '', degree: ''
  })

  // const fetchProfiles = async (p = 1) => {
  //   setLoading(true)
  //   try {
  //     const params = { page: p, limit: 12, ...filters }
  //     if (!filters.gender) params.gender = user?.gender === 'male' ? 'female' : 'male'
  //     const res = await axios.get('/api/profile/search', { params })
  //     setProfiles(res.data.users)
  //     setTotalPages(res.data.totalPages)
  //     setDegreeCounts(res.data.degreeCounts || { direct: 0, friend: 0, unknown: 0 })
  //     setPage(p)
  //   } catch {
  //     showToast('Failed to load profiles', 'error')
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  const fetchProfilesWithFilters = async (activeFilters, p = 1) => {
    setLoading(true)
    try {
      const params = { page: p, limit: 1000, ...activeFilters }
      if (!activeFilters.gender) params.gender = user?.gender === 'male' ? 'female' : 'male'
      const res = await axios.get('/api/profile/search', { params })
      setProfiles(res.data.users)
      setTotalPages(res.data.totalPages)
      setDegreeCounts(res.data.degreeCounts || { direct: 0, friend: 0, unknown: 0 })
      setPage(p)
    } catch {
      showToast('Failed to load profiles', 'error')
    } finally {
      setLoading(false)
    }
  }

  const fetchProfiles = (p = 1) => fetchProfilesWithFilters(filters, p)

  // Fetch already-sent interests
  const fetchSent = async () => {
    try {
      const res = await axios.get('/api/interest/sent')
      setSentIds(new Set(res.data.interests.map(i => i.receiver._id || i.receiver)))
    } catch { }
  }

  useEffect(() => { fetchProfiles(1); fetchSent() }, [])

  const sendInterest = async (receiverId) => {
    try {
      await axios.post('/api/interest/send', { receiverId })
      setSentIds(s => new Set([...s, receiverId]))
      showToast('Interest sent! 💌')
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not send interest', 'error')
    }
  }

  const setFilter = k => e => setFilters(f => ({ ...f, [k]: e.target.value }))

  return (
    <div className="page">
      <div className="container">
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 32, marginBottom: 8 }}>Browse Profiles</h1>
          <p style={{ color: 'var(--text-muted)' }}>Find your perfect partner</p>
        </div>

        {/* Trust degree quick filter */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
          {[
            { val: '', label: 'All Profiles', count: degreeCounts.direct + degreeCounts.friend + degreeCounts.unknown, color: 'var(--primary)' },
            { val: '1', label: '🟢 Direct Contacts', count: degreeCounts.direct, color: '#059669' },
            { val: '2', label: '🔵 Friend\'s Contacts', count: degreeCounts.friend, color: '#2563eb' },
            { val: '3', label: '🟡 Unknown', count: degreeCounts.unknown, color: '#d97706' },
          ].map(f => (
            <button
              key={f.val}
              onClick={() => {
                const newFilters = { ...filters, degree: f.val }
                setFilters(newFilters)
                fetchProfilesWithFilters(newFilters, 1)
              }}
              style={{
                padding: '7px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600,
                cursor: 'pointer', transition: 'all .2s',
                background: filters.degree === f.val ? f.color : 'var(--white)',
                color: filters.degree === f.val ? '#fff' : f.color,
                border: `1.5px solid ${f.color}`,
              }}
            >
              {f.label} ({f.count})
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="card" style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: '1 1 120px' }}>
              <label className="form-label">Gender</label>
              <select className="form-input form-select" value={filters.gender} onChange={setFilter('gender')}>
                <option value="">All</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div style={{ flex: '1 1 140px' }}>
              <label className="form-label">Religion</label>
              <input className="form-input" placeholder="e.g. Hindu" value={filters.religion} onChange={setFilter('religion')} />
            </div>
            <div style={{ flex: '1 1 140px' }}>
              <label className="form-label">City</label>
              <input className="form-input" placeholder="e.g. Mumbai" value={filters.city} onChange={setFilter('city')} />
            </div>
            <div style={{ flex: '1 1 90px' }}>
              <label className="form-label">Age Min</label>
              <input type="number" className="form-input" placeholder="18" min={18} max={70}
                value={filters.ageMin} onChange={setFilter('ageMin')} />
            </div>
            <div style={{ flex: '1 1 90px' }}>
              <label className="form-label">Age Max</label>
              <input type="number" className="form-input" placeholder="50" min={18} max={70}
                value={filters.ageMax} onChange={setFilter('ageMax')} />
            </div>

            <div style={{ flex: '1 1 140px' }}>
              <label className="form-label">Income</label>
              <select className="form-input form-select" value={filters.income} onChange={setFilter('income')}>
                <option value="">Any</option>
                <option value="Below 2 LPA">Below 2 LPA</option>
                <option value="2-5 LPA">2-5 LPA</option>
                <option value="5-10 LPA">5-10 LPA</option>
                <option value="10-20 LPA">10-20 LPA</option>
                <option value="Above 20 LPA">Above 20 LPA</option>
              </select>
            </div>
            <button className="btn btn-primary" onClick={() => fetchProfiles(1)} style={{ flexShrink: 0 }}>
              Search
            </button>
            <button className="btn btn-outline"
              onClick={() => {
                const reset = { gender: '', religion: '', city: '', ageMin: '', ageMax: '', income: '', degree: '' }
                setFilters(reset)
                fetchProfilesWithFilters(reset, 1)
              }}>
              Reset
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading"><div className="spinner" /></div>
        ) : profiles.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">search</div>
            <p style={{ fontSize: 18, fontWeight: 600 }}>No profiles found</p>
            <p style={{ marginTop: 8 }}>Try different filters</p>
          </div>
        ) : (
          <>
            <div className="grid-3">
              {profiles.map(p => (
                <ProfileCard key={p._id} user={p}
                  interestSent={sentIds.has(p._id)}
                  onSendInterest={sendInterest} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32 }}>
                <button className="btn btn-outline btn-sm" disabled={page <= 1}
                  onClick={() => fetchProfiles(page - 1)}>← Prev</button>
                <span style={{ padding: '6px 16px', fontSize: 14, color: 'var(--text-muted)' }}>
                  Page {page} of {totalPages}
                </span>
                <button className="btn btn-outline btn-sm" disabled={page >= totalPages}
                  onClick={() => fetchProfiles(page + 1)}>Next →</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
