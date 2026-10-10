// import { useState, useEffect } from 'react'
// import axios from 'axios'
// import { useAuth } from '../context/AuthContext'
// import { useToast } from '../context/ToastContext'

// const NEEDED = 3

// export default function Trust() {
//   const { user, refreshUser } = useAuth()
//   const { showToast } = useToast()
//   const [tab, setTab]           = useState('status')
//   const [myVouches, setMyVouches]   = useState([])
//   const [pending, setPending]       = useState([])
//   const [given, setGiven]           = useState([])
//   const [loading, setLoading]       = useState(true)
//   const [voucherEmail, setVoucherEmail] = useState('')
//   const [message, setMessage]       = useState('')
//   const [requesting, setRequesting] = useState(false)

//   const fetchAll = async () => {
//     setLoading(true)
//     try {
//       const [s, p, g] = await Promise.all([
//         axios.get('/api/vouch/mystatus'),
//         axios.get('/api/vouch/pending'),
//         axios.get('/api/vouch/given'),
//       ])
//       setMyVouches(s.data.vouches)
//       setPending(p.data.vouches)
//       setGiven(g.data.vouches)
//     } catch {
//       showToast('Could not load trust data', 'error')
//     } finally { setLoading(false) }
//   }

//   useEffect(() => { fetchAll() }, [])

//   const requestVouch = async (e) => {
//     e.preventDefault()
//     setRequesting(true)
//     try {
//       await axios.post('/api/vouch/request', { voucherEmail, message })
//       showToast('Vouch request sent!')
//       setVoucherEmail('')
//       setMessage('')
//       fetchAll()
//     } catch (err) {
//       showToast(err.response?.data?.message || 'Failed to send request', 'error')
//     } finally { setRequesting(false) }
//   }

//   const respond = async (id, action) => {
//     try {
//       await axios.put(`/api/vouch/${id}/respond`, { action })
//       showToast(action === 'accept' ? '✅ Vouch accepted!' : 'Vouch rejected.')
//       fetchAll()
//       refreshUser()
//     } catch (err) {
//       showToast(err.response?.data?.message || 'Action failed', 'error')
//     }
//   }

//   const activeCount = myVouches.filter(v => v.status === 'accepted').length
//   const pct = Math.min((activeCount / NEEDED) * 100, 100)
//   const isTrusted = user?.trustLevel >= 2

//   return (
//     <div className="page">
//       <div className="container" style={{ maxWidth:700 }}>
//         <div style={{ marginBottom:28 }}>
//           <h1 style={{ fontSize:30, marginBottom:8 }}>🛡 Trust Chain</h1>
//           <p style={{ color:'var(--text-muted)' }}>Get vouched by real friends to become a Trusted member</p>
//         </div>

//         {/* Trust level card */}
//         <div className="card" style={{ marginBottom:24 }}>
//           <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16, flexWrap:'wrap', gap:12 }}>
//             <div>
//               <h2 style={{ fontSize:20, marginBottom:4 }}>Your Trust Level</h2>
//               <span className={`badge ${isTrusted ? 'badge-trusted' : 'badge-basic'}`} style={{ fontSize:13 }}>
//                 {isTrusted ? '🛡 Level 2 — Trusted Member' : '⭐ Level 1 — Basic Member'}
//               </span>
//             </div>
//             <div style={{ textAlign:'center' }}>
//               <div style={{ fontSize:32, fontWeight:700, color: isTrusted ? 'var(--success)' : 'var(--primary)' }}>
//                 {activeCount}/{NEEDED}
//               </div>
//               <div style={{ fontSize:12, color:'var(--text-muted)' }}>vouches received</div>
//             </div>
//           </div>

//           <div className="trust-bar-wrap">
//             <div className="trust-bar" style={{ width:`${pct}%`, background: isTrusted ? 'var(--success)' : 'var(--primary)' }}/>
//           </div>

//           {isTrusted ? (
//             <div className="alert alert-success" style={{ marginTop:16 }}>
//               🎉 You are a Trusted Member! You can now vouch for others and have full access to the platform.
//             </div>
//           ) : (
//             <div className="alert alert-info" style={{ marginTop:16 }}>
//               You need <strong>{NEEDED - activeCount} more vouch{NEEDED - activeCount !== 1 ? 'es' : ''}</strong> from Level-2 Trusted members to become Trusted yourself.
//             </div>
//           )}
//         </div>

//         <div className="tabs">
//           <button className={`tab-btn ${tab==='status'?'active':''}`}  onClick={() => setTab('status')}>My Vouches</button>
//           <button className={`tab-btn ${tab==='request'?'active':''}`} onClick={() => setTab('request')}>Ask a Friend</button>
//           <button className={`tab-btn ${tab==='pending'?'active':''}`} onClick={() => setTab('pending')}>
//             Requests for Me {pending.length > 0 && <span style={{ background:'var(--primary)', color:'#fff', borderRadius:'50%', width:18, height:18, display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:11, marginLeft:6 }}>{pending.length}</span>}
//           </button>
//           <button className={`tab-btn ${tab==='given'?'active':''}`}   onClick={() => setTab('given')}>Vouches I Gave</button>
//         </div>

//         {loading ? <div className="loading"><div className="spinner"/></div> : (

//           <>
//           {/* My vouches */}
//           {tab === 'status' && (
//             myVouches.length === 0 ? (
//               <div className="empty"><div className="empty-icon">🤝</div>
//                 <p>No vouches yet. Ask a trusted friend to vouch for you!</p>
//               </div>
//             ) : (
//               <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
//                 {myVouches.map(v => (
//                   <div key={v._id} className="interest-card">
//                     {v.voucher?.photo
//                       ? <img src={v.voucher.photo} className="interest-photo" alt={v.voucher.name}/>
//                       : <div className="interest-photo-placeholder">👤</div>
//                     }
//                     <div className="interest-info">
//                       <div className="interest-name">{v.voucher?.name}</div>
//                       <div className="interest-meta">{v.voucher?.city}</div>
//                     </div>
//                     <span className={`badge ${v.status==='accepted'?'badge-trusted':v.status==='pending'?'badge-pending':''}`}>
//                       {v.status === 'accepted' ? '✅ Vouched' : v.status === 'pending' ? '⏳ Pending' : '❌ Rejected'}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             )
//           )}

//           {/* Request a vouch */}
//           {tab === 'request' && (
//             <div className="card">
//               <h3 style={{ marginBottom:8 }}>Ask a Friend to Vouch for You</h3>
//               <p style={{ color:'var(--text-muted)', fontSize:14, marginBottom:20 }}>
//                 Enter the email of a friend who is already a <strong>Level 2 Trusted</strong> member. They will receive your request and can accept or reject it.
//               </p>
//               <div className="alert alert-info" style={{ marginBottom:20 }}>
//                 <strong>How it works:</strong> Your friend clicks Accept → you get +1 vouch → collect 3 vouches → become Trusted!
//               </div>
//               <form onSubmit={requestVouch}>
//                 <div className="form-group">
//                   <label className="form-label">Friend's Email</label>
//                   <input type="email" className="form-input" placeholder="friend@email.com"
//                     value={voucherEmail} onChange={e => setVoucherEmail(e.target.value)} required />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Personal Message (optional)</label>
//                   <textarea className="form-input" rows={3} style={{ resize:'vertical' }}
//                     placeholder="Hey! I'm on Vivah matrimonial platform. Can you vouch for me?"
//                     value={message} onChange={e => setMessage(e.target.value)} />
//                 </div>
//                 <button type="submit" className="btn btn-primary" disabled={requesting}>
//                   {requesting ? 'Sending...' : '📨 Send Vouch Request'}
//                 </button>
//               </form>
//             </div>
//           )}

//           {/* Pending requests for me to vouch */}
//           {tab === 'pending' && (
//             pending.length === 0 ? (
//               <div className="empty"><div className="empty-icon">📭</div><p>No pending vouch requests</p></div>
//             ) : (
//               <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
//                 {pending.map(v => (
//                   <div key={v._id} className="interest-card">
//                     {v.requester?.photo
//                       ? <img src={v.requester.photo} className="interest-photo" alt={v.requester.name}/>
//                       : <div className="interest-photo-placeholder">👤</div>
//                     }
//                     <div className="interest-info">
//                       <div className="interest-name">{v.requester?.name}</div>
//                       <div className="interest-meta">{v.requester?.city} · {v.requester?.gender}</div>
//                       {v.message && <div style={{ fontSize:13, fontStyle:'italic', color:'var(--text-muted)', marginTop:4 }}>"{v.message}"</div>}
//                     </div>
//                     <div className="interest-actions">
//                       <button className="btn btn-success btn-sm" onClick={() => respond(v._id, 'accept')}>✓ Vouch</button>
//                       <button className="btn btn-danger btn-sm"  onClick={() => respond(v._id, 'reject')}>✕</button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )
//           )}

//           {/* Vouches I gave */}
//           {tab === 'given' && (
//             given.length === 0 ? (
//               <div className="empty"><div className="empty-icon">🤲</div><p>You haven't vouched for anyone yet</p></div>
//             ) : (
//               <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
//                 {given.map(v => (
//                   <div key={v._id} className="interest-card">
//                     {v.requester?.photo
//                       ? <img src={v.requester.photo} className="interest-photo" alt={v.requester.name}/>
//                       : <div className="interest-photo-placeholder">👤</div>
//                     }
//                     <div className="interest-info">
//                       <div className="interest-name">{v.requester?.name}</div>
//                       <div className="interest-meta">{v.requester?.city}</div>
//                     </div>
//                     <span className={`badge ${v.status==='accepted'?'badge-trusted':v.status==='pending'?'badge-pending':''}`}>
//                       {v.status === 'accepted' ? '✅ Vouched' : v.status === 'pending' ? '⏳ Pending' : '❌ Rejected'}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             )
//           )}
//           </>
//         )}
//       </div>
//     </div>
//   )
// }
