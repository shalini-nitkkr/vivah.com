// import { useState, useEffect } from 'react'
// import axios from 'axios'
// import { useToast } from '../context/ToastContext'
// import { useNavigate } from 'react-router-dom'

// export default function Admin() {
//   const { showToast } = useToast()
//   const [stats, setStats] = useState(null)
//   const [users, setUsers] = useState([])
//   const [tab, setTab] = useState('stats')
//   const [loading, setLoading] = useState(true)
//   const [network, setNetwork] = useState(null)
//   const navigate = useNavigate()

//   const fetchStats = async () => {
//     const [s, u] = await Promise.all([
//       axios.get('/api/admin/stats'),
//       axios.get('/api/admin/users'),
//     ])
//     setStats(s.data)
//     setUsers(u.data.users)
//     setLoading(false)
//   }

//   useEffect(() => { fetchStats() }, [])

//   const toggleUser = async (id) => {
//     try {
//       const res = await axios.put(`/api/admin/users/${id}/toggle`)
//       showToast(res.data.message)
//       setUsers(u => u.map(x => x._id === id ? { ...x, active: res.data.active } : x))
//     } catch {
//       showToast('Action failed', 'error')
//     }
//   }

//   const loadNetwork = async (id) => {

//     try {

//       const res = await axios.get(`/api/admin/network/${id}`)
//       console.log(res.data)
//       setNetwork(res.data)

//     } catch {

//       showToast('Could not load network', 'error')

//     }
//   }

//   if (loading) return <div className="loading"><div className="spinner" /></div>

//   return (
//     <div className="page">
//       <div className="container">
//         <h1 style={{ fontSize: 30, marginBottom: 28 }}>⚙️ Admin Panel</h1>

//         <div className="tabs">
//           <button className={`tab-btn ${tab === 'stats' ? 'active' : ''}`} onClick={() => setTab('stats')}>Dashboard</button>
//           <button className={`tab-btn ${tab === 'users' ? 'active' : ''}`} onClick={() => setTab('users')}>Users ({users.length})</button>
//         </div>

//         {tab === 'stats' && stats && (
//           <div className="grid-3" style={{ marginTop: 8 }}>
//             {[
//               { icon: '👥', num: stats.totalUsers, label: 'Total Users' },
//               { icon: '💌', num: stats.totalInterests, label: 'Total Interests' },
//               { icon: '💑', num: stats.matches, label: 'Successful Matches' },
//               { icon: '🛡', num: stats.trusted, label: 'Trusted Members' },
//             ].map(s => (
//               <div key={s.label} className="stat-card">
//                 <div style={{ fontSize: 36, marginBottom: 8 }}>{s.icon}</div>
//                 <div className="stat-num">{s.num}</div>
//                 <div className="stat-label">{s.label}</div>
//               </div>
//             ))}
//           </div>
//         )}

//         {tab === 'users' && (
//           <div style={{ overflowX: 'auto' }}>
//             <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--white)', borderRadius: 12, overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
//               <thead>
//                 <tr style={{ background: 'var(--bg)', borderBottom: '2px solid var(--border)' }}>
//                   {['Name', 'Email', 'Gender', 'Trust', 'Role', 'Status', 'Action', 'Network'].map(h => (
//                     <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)' }}>{h}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {users.map(u => (
//                   <tr key={u._id} style={{ borderBottom: '1px solid var(--border)' }}>
//                     <td style={{ padding: '12px 16px' }}>
//                       <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//                         {u.photo
//                           ? <img src={u.photo} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} alt={u.name} />
//                           : <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👤</div>
//                         }
//                         <span style={{ fontWeight: 500 }}>{u.name}</span>
//                       </div>
//                     </td>
//                     <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-muted)' }}>{u.email}</td>
//                     <td style={{ padding: '12px 16px', fontSize: 13, textTransform: 'capitalize' }}>{u.gender}</td>
//                     <td style={{ padding: '12px 16px' }}>
//                       <span className={`badge ${u.trustLevel >= 2 ? 'badge-trusted' : 'badge-basic'}`}>
//                         L{u.trustLevel}
//                       </span>
//                     </td>
//                     <td style={{ padding: '12px 16px' }}>
//                       <span className={`badge ${u.role === 'admin' ? 'badge-trusted' : 'badge-basic'}`}>{u.role}</span>
//                     </td>
//                     <td style={{ padding: '12px 16px' }}>
//                       <span className={`badge ${u.active ? 'badge-trusted' : ''}`} style={!u.active ? { background: '#fee2e2', color: '#991b1b' } : {}}>
//                         {u.active ? 'Active' : 'Suspended'}
//                       </span>
//                     </td>
//                     <td style={{ padding: '12px 16px' }}>
//                       {u.role !== 'admin' && (
//                         <button
//                           className={`btn btn-sm ${u.active ? 'btn-danger' : 'btn-success'}`}
//                           onClick={() => toggleUser(u._id)}
//                         >
//                           {u.active ? 'Suspend' : 'Activate'}
//                         </button>
//                       )}
//                     </td>
//                     <td style={{ padding: '12px 16px' }}>

//                       <button
//                         className="btn btn-sm btn-outline"
//                         // onClick={() => loadNetwork(u._id)}
//                         onClick={() => navigate(`/network/${u._id}`)}
//                       >
//                         View Network
//                       </button>

//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }


import { useState, useEffect } from 'react'
import axios from 'axios'
import { useToast } from '../context/ToastContext'
import { useNavigate } from 'react-router-dom'

export default function Admin() {
  const { showToast } = useToast()
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [tab, setTab] = useState('stats')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchStats = async () => {
    const [s, u] = await Promise.all([
      axios.get('/api/admin/stats'),
      axios.get('/api/admin/users'),
    ])
    setStats(s.data)
    setUsers(u.data.users)
    setLoading(false)
  }

  useEffect(() => { fetchStats() }, [])

  const toggleUser = async (id) => {
    try {
      const res = await axios.put(`/api/admin/users/${id}/toggle`)
      showToast(res.data.message)
      setUsers(u => u.map(x => x._id === id ? { ...x, active: res.data.active } : x))
    } catch {
      showToast('Action failed', 'error')
    }
  }

  if (loading) return <div className="loading"><div className="spinner" /></div>

  return (
    <div className="page">
      <div className="container">
        <h1 style={{ fontSize: 30, marginBottom: 28 }}>⚙️ Admin Panel</h1>

        <div className="tabs">
          <button className={`tab-btn ${tab === 'stats' ? 'active' : ''}`} onClick={() => setTab('stats')}>Dashboard</button>
          <button className={`tab-btn ${tab === 'users' ? 'active' : ''}`} onClick={() => setTab('users')}>Users ({users.length})</button>
        </div>

        {tab === 'stats' && stats && (
          <div className="grid-3" style={{ marginTop: 8 }}>
            {[
              { icon: '👥', num: stats.totalUsers, label: 'Total Users' },
              { icon: '💌', num: stats.totalInterests, label: 'Total Interests' },
              { icon: '💑', num: stats.matches, label: 'Successful Matches' },
              { icon: '🛡', num: stats.trusted, label: 'Trusted Members' },
            ].map(s => (
              <div key={s.label} className="stat-card">
                <div style={{ fontSize: 36, marginBottom: 8 }}>{s.icon}</div>
                <div className="stat-num">{s.num}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {tab === 'users' && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--white)', borderRadius: 12, overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
              <thead>
                <tr style={{ background: 'var(--bg)', borderBottom: '2px solid var(--border)' }}>
                  {['Name', 'Email', 'Gender', 'Trust', 'Role', 'Status', 'Action', 'Network'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {u.photo
                          ? <img src={u.photo} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} alt={u.name} />
                          : <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👤</div>
                        }
                        <span style={{ fontWeight: 500 }}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-muted)' }}>{u.email}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, textTransform: 'capitalize' }}>{u.gender}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className={`badge ${u.trustLevel >= 2 ? 'badge-trusted' : 'badge-basic'}`}>
                        L{u.trustLevel}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className={`badge ${u.role === 'admin' ? 'badge-trusted' : 'badge-basic'}`}>{u.role}</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className={`badge ${u.active ? 'badge-trusted' : ''}`} style={!u.active ? { background: '#fee2e2', color: '#991b1b' } : {}}>
                        {u.active ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {u.role !== 'admin' && (
                        <button
                          className={`btn btn-sm ${u.active ? 'btn-danger' : 'btn-success'}`}
                          onClick={() => toggleUser(u._id)}
                        >
                          {u.active ? 'Suspend' : 'Activate'}
                        </button>
                      )}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <button
                        className="btn btn-sm btn-outline"
                        onClick={() => navigate(`/network/${u._id}`)}
                      >
                        🕸 View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}