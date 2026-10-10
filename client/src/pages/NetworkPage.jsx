// // // import { useEffect, useState } from 'react'
// // // import { useParams } from 'react-router-dom'
// // // import axios from 'axios'

// // // export default function NetworkPage() {

// // //   const { id } = useParams()

// // //   const [network, setNetwork] = useState(null)

// // //   useEffect(() => {

// // //     const fetchNetwork = async () => {

// // //       try {

// // //         const token = localStorage.getItem('token')

// // //         const res = await axios.get(
// // //           `/api/admin/network/${id}`,
// // //           {
// // //             headers: {
// // //               Authorization: `Bearer ${token}`
// // //             }
// // //           }
// // //         )

// // //         setNetwork(res.data)

// // //       } catch (err) {

// // //         console.log(err)

// // //       }
// // //     }

// // //     fetchNetwork()

// // //   }, [id])

// // //   if (!network) {
// // //     return <div className="loading">Loading...</div>
// // //   }

// // //   return (

// // //     <div
// // //       style={{
// // //         minHeight: '100vh',
// // //         background: '#f3f4f6',
// // //         padding: 40
// // //       }}
// // //     >

// // //       <h1
// // //         style={{
// // //           textAlign: 'center',
// // //           marginBottom: 60,
// // //           fontSize: 34,
// // //           fontWeight: 700
// // //         }}
// // //       >
// // //         🌐 Relationship Graph
// // //       </h1>

// // //       {/* Main User */}
// // //       <div
// // //         style={{
// // //           display: 'flex',
// // //           justifyContent: 'center',
// // //           marginBottom: 70
// // //         }}
// // //       >

// // //         <div
// // //           style={{
// // //             padding: '18px 30px',
// // //             borderRadius: 16,
// // //             background: '#fee2e2',
// // //             border: '2px solid #ef4444',
// // //             fontWeight: 700,
// // //             fontSize: 22,
// // //             minWidth: 240,
// // //             textAlign: 'center'
// // //           }}
// // //         >
// // //           👤 {network.user}
// // //         </div>

// // //       </div>

// // //       {/* Graph */}
// // //       <div
// // //         style={{
// // //           display: 'flex',
// // //           justifyContent: 'center',
// // //           gap: 70,
// // //           flexWrap: 'wrap',
// // //           alignItems: 'flex-start'
// // //         }}
// // //       >

// // //         {network.graph?.map((item, i) => (

// // //           <div
// // //             key={i}
// // //             style={{
// // //               display: 'flex',
// // //               flexDirection: 'column',
// // //               alignItems: 'center'
// // //             }}
// // //           >

// // //             {/* Line From Main User */}
// // //             <div
// // //               style={{
// // //                 width: 2,
// // //                 height: 45,
// // //                 background: '#9ca3af'
// // //               }}
// // //             />

// // //             {/* Friend Node */}
// // //             <div
// // //               style={{
// // //                 padding: '14px 24px',
// // //                 borderRadius: 14,
// // //                 background: '#d1fae5',
// // //                 border: '2px solid #10b981',
// // //                 fontWeight: 700,
// // //                 minWidth: 220,
// // //                 textAlign: 'center',
// // //                 fontSize: 18
// // //               }}
// // //             >
// // //               👥 {item.friend}
// // //             </div>

// // //             {/* Contact Nodes */}
// // //             <div
// // //               style={{
// // //                 marginTop: 40,
// // //                 display: 'flex',
// // //                 flexDirection: 'column',
// // //                 gap: 28,
// // //                 alignItems: 'center'
// // //               }}
// // //             >

// // //               {item.contacts?.slice(0, 5).map((contact, idx) => (

// // //                 <div
// // //                   key={idx}
// // //                   style={{
// // //                     display: 'flex',
// // //                     flexDirection: 'column',
// // //                     alignItems: 'center'
// // //                   }}
// // //                 >

// // //                   {/* Line */}
// // //                   <div
// // //                     style={{
// // //                       width: 2,
// // //                       height: 28,
// // //                       background: '#9ca3af'
// // //                     }}
// // //                   />

// // //                   {/* Contact */}
// // //                   <div
// // //                     style={{
// // //                       padding: '12px 20px',
// // //                       borderRadius: 12,
// // //                       background: '#dbeafe',
// // //                       border: '2px solid #3b82f6',
// // //                       fontWeight: 600,
// // //                       minWidth: 200,
// // //                       textAlign: 'center'
// // //                     }}
// // //                   >
// // //                     🔵 {contact}
// // //                   </div>

// // //                 </div>

// // //               ))}

// // //             </div>

// // //           </div>

// // //         ))}

// // //       </div>

// // //     </div>
// // //   )
// // // }


// // import { useEffect, useState } from 'react'
// // import { useParams, useNavigate } from 'react-router-dom'
// // import axios from 'axios'

// // // Degree badge
// // const DegreeBadge = ({ degree }) => {
// //   if (degree === 1) return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">🟢 Direct</span>
// //   if (degree === 2) return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700">🔵 Friend's</span>
// //   return null
// // }

// // // Single friend column in the graph
// // function FriendColumn({ item, index }) {
// //   const [expanded, setExpanded] = useState(false)
// //   const shown = expanded ? item.contacts : item.contacts.slice(0, 3)

// //   return (
// //     <div className="flex flex-col items-center" style={{ minWidth: 180 }}>
// //       {/* Vertical line from root */}
// //       <div className="w-0.5 h-10 bg-gray-300"/>

// //       {/* Friend node — Degree 1 */}
// //       <div className="bg-green-50 border-2 border-green-400 rounded-2xl px-4 py-3 text-center shadow-sm w-full">
// //         <div className="text-lg mb-0.5">👥</div>
// //         <div className="font-semibold text-green-800 text-sm leading-tight">{item.friend}</div>
// //         <DegreeBadge degree={1}/>
// //       </div>

// //       {/* Contacts of this friend — Degree 2 */}
// //       {shown.length > 0 && (
// //         <div className="flex flex-col items-center gap-0 mt-0 w-full">
// //           {shown.map((contact, idx) => (
// //             <div key={idx} className="flex flex-col items-center w-full">
// //               <div className="w-0.5 h-6 bg-gray-200"/>
// //               <div className="bg-blue-50 border-2 border-blue-300 rounded-xl px-3 py-2 text-center w-full shadow-sm">
// //                 <div className="text-sm">🔵</div>
// //                 <div className="font-medium text-blue-800 text-xs leading-tight mt-0.5">{contact.name}</div>
// //                 <DegreeBadge degree={2}/>
// //               </div>
// //             </div>
// //           ))}

// //           {item.contacts.length > 3 && (
// //             <button onClick={() => setExpanded(v => !v)}
// //               className="mt-2 text-xs text-gray-400 hover:text-primary-500 font-medium transition-colors">
// //               {expanded ? '▲ Show less' : `▼ +${item.contacts.length - 3} more`}
// //             </button>
// //           )}
// //         </div>
// //       )}

// //       {shown.length === 0 && (
// //         <div className="mt-2 text-xs text-gray-300">No further contacts</div>
// //       )}
// //     </div>
// //   )
// // }

// // export default function NetworkPage() {
// //   const { id }     = useParams()
// //   const navigate   = useNavigate()
// //   const [network,  setNetwork]  = useState(null)
// //   const [loading,  setLoading]  = useState(true)
// //   const [error,    setError]    = useState('')

// //   useEffect(() => {
// //     axios.get(`/api/admin/network/${id}`)
// //       .then(r => setNetwork(r.data))
// //       .catch(err => setError(err.response?.data?.message || 'Failed to load network'))
// //       .finally(() => setLoading(false))
// //   }, [id])

// //   if (loading) return (
// //     <div className="flex justify-center items-center min-h-screen bg-gray-50">
// //       <div className="text-center">
// //         <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"/>
// //         <p className="text-gray-500">Loading relationship graph...</p>
// //       </div>
// //     </div>
// //   )

// //   if (error) return (
// //     <div className="flex justify-center items-center min-h-screen bg-gray-50">
// //       <div className="text-center">
// //         <div className="text-5xl mb-4">⚠️</div>
// //         <p className="text-gray-600 font-medium">{error}</p>
// //         <button onClick={() => navigate('/admin')} className="mt-4 text-primary-500 hover:underline text-sm">← Back to Admin</button>
// //       </div>
// //     </div>
// //   )

// //   if (!network) return null

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">

// //       {/* Header */}
// //       <div className="bg-white border-b border-gray-100 shadow-sm px-8 py-5">
// //         <div className="max-w-7xl mx-auto flex items-center justify-between">
// //           <div>
// //             <button onClick={() => navigate('/admin')}
// //               className="text-sm text-gray-400 hover:text-gray-600 mb-2 flex items-center gap-1 transition-colors">
// //               ← Back to Admin
// //             </button>
// //             <h1 className="font-display text-2xl font-bold text-gray-900">
// //               🌐 Network Graph — {network.user}
// //             </h1>
// //             <p className="text-gray-500 text-sm mt-1">
// //               Contact relationship map (Degree 1 & 2)
// //             </p>
// //           </div>

// //           {/* Stats pills */}
// //           <div className="flex gap-3 flex-wrap">
// //             {[
// //               { label: 'Direct Contacts',    value: network.stats?.directCount  || 0, color: 'bg-green-100 text-green-700', icon: '🟢' },
// //               { label: "Friends' Contacts",  value: network.stats?.fofCount     || 0, color: 'bg-blue-100 text-blue-700',   icon: '🔵' },
// //               { label: 'Total Reach',        value: network.stats?.totalReach   || 0, color: 'bg-purple-100 text-purple-700', icon: '🌐' },
// //             ].map(s => (
// //               <div key={s.label} className={`${s.color} px-4 py-2.5 rounded-2xl text-center min-w-[100px]`}>
// //                 <div className="text-xl font-bold">{s.value}</div>
// //                 <div className="text-xs font-medium opacity-80">{s.icon} {s.label}</div>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </div>

// //       {/* Graph area */}
// //       <div className="max-w-7xl mx-auto px-8 py-10 overflow-x-auto">

// //         {/* Legend */}
// //         <div className="flex items-center gap-6 mb-8 flex-wrap">
// //           <span className="text-sm font-semibold text-gray-500">Legend:</span>
// //           <div className="flex items-center gap-2 text-sm">
// //             <div className="w-4 h-4 rounded-full bg-red-400 border-2 border-red-600"/>
// //             <span className="text-gray-600">Root User</span>
// //           </div>
// //           <div className="flex items-center gap-2 text-sm">
// //             <div className="w-4 h-4 rounded-full bg-green-400 border-2 border-green-600"/>
// //             <span className="text-gray-600">Degree 1 — Direct Contact</span>
// //           </div>
// //           <div className="flex items-center gap-2 text-sm">
// //             <div className="w-4 h-4 rounded-full bg-blue-400 border-2 border-blue-600"/>
// //             <span className="text-gray-600">Degree 2 — Friend's Contact</span>
// //           </div>
// //         </div>

// //         {network.graph?.length === 0 ? (
// //           <div className="text-center py-20 text-gray-400">
// //             <div className="text-6xl mb-4">🌐</div>
// //             <p className="text-xl font-semibold">No network data found</p>
// //             <p className="text-sm mt-2">This user may not have uploaded contacts or Neo4j graph is empty</p>
// //           </div>
// //         ) : (
// //           <div className="flex flex-col items-center">

// //             {/* Root node */}
// //             <div className="bg-red-50 border-3 border-red-400 rounded-2xl px-8 py-4 shadow-md text-center mb-0"
// //               style={{ border: '3px solid #ef4444', minWidth: 220 }}>
// //               <div className="text-3xl mb-1">👤</div>
// //               <div className="font-bold text-red-800 text-lg">{network.user}</div>
// //               <div className="text-xs text-red-500 font-medium mt-0.5">Root User</div>
// //             </div>

// //             {/* Horizontal line */}
// //             {network.graph.length > 0 && (
// //               <div className="flex items-start justify-center gap-10 mt-0 overflow-x-auto pb-8 pt-0 w-full">
// //                 {network.graph.map((item, i) => (
// //                   <FriendColumn key={i} item={item} index={i}/>
// //                 ))}
// //               </div>
// //             )}
// //           </div>
// //         )}

// //         {/* Direct contacts list — full list */}
// //         {network.directContacts?.length > 0 && (
// //           <div className="mt-10 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
// //             <h3 className="font-semibold text-gray-900 mb-4">
// //               🟢 All Direct Contacts ({network.directContacts.length})
// //             </h3>
// //             <div className="flex flex-wrap gap-2">
// //               {network.directContacts.map((c, i) => (
// //                 <span key={i} className="bg-green-50 border border-green-200 text-green-700 text-sm px-3 py-1.5 rounded-full font-medium">
// //                   👤 {c.name}
// //                 </span>
// //               ))}
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   )
// // }


// import { useEffect, useRef, useState } from 'react'
// import { useParams, useNavigate } from 'react-router-dom'
// import axios from 'axios'

// const MAX_NODES = 7 // 1 center + up to 3 direct + up to 3 FoF

// const COLORS = {
//   center:  { fill: '#7C3AED', stroke: '#5B21B6', text: '#fff' },
//   direct:  { fill: '#DB2777', stroke: '#9D174D', text: '#fff' },
//   fof:     { fill: '#0F766E', stroke: '#0D5C55', text: '#fff' },
//   edge:    '#C084FC',
//   fofEdge: '#5EEAD4',
//   common:  '#F59E0B',
// }

// function buildGraph(data) {
//   if (!data) return { nodes: [], edges: [] }

//   const nodes = []
//   const edges = []
//   const seen = new Set()

//   // Center
//   const centerName = data.user || 'User'
//   nodes.push({ id: 'center', label: centerName, type: 'center' })
//   seen.add(centerName)

//   // Limit graph items: 1 center + up to 3 direct + up to 3 FoF
//   const graph = (data.graph || []).slice(0, 3)

//   const directMap = {} // friendName -> nodeId

//   graph.forEach((item, i) => {
//     const friendName = item.friend
//     if (!friendName || seen.has(friendName)) return
//     seen.add(friendName)

//     const fid = `d-${i}`
//     nodes.push({ id: fid, label: friendName, type: 'direct' })
//     edges.push({ from: 'center', to: fid, type: 'direct' })
//     directMap[friendName] = fid
//   })

//   // FoF — limit to 3 across all direct nodes
//   const fofAdded = []
//   for (const item of graph) {
//     if (fofAdded.length >= 3) break
//     const fofList = (item.contacts || []).slice(0, 3 - fofAdded.length)
//     const directId = directMap[item.friend]
//     if (!directId) continue

//     fofList.forEach((fofName, j) => {
//       if (!fofName || seen.has(fofName)) return
//       seen.add(fofName)
//       const fofId = `fof-${fofAdded.length}`
//       nodes.push({ id: fofId, label: fofName, type: 'fof' })
//       edges.push({ from: directId, to: fofId, type: 'fof' })
//       fofAdded.push({ id: fofId, name: fofName })
//     })
//   }

//   // Detect common friends: FoF nodes reachable via multiple direct nodes
//   const fofToDirects = {}
//   graph.forEach((item) => {
//     const directId = directMap[item.friend]
//     if (!directId) return
//     ;(item.contacts || []).forEach((fofName) => {
//       const fofNode = nodes.find((n) => n.label === fofName && n.type === 'fof')
//       if (!fofNode) return
//       if (!fofToDirects[fofNode.id]) fofToDirects[fofNode.id] = []
//       if (!fofToDirects[fofNode.id].includes(directId))
//         fofToDirects[fofNode.id].push(directId)
//     })
//   })

//   // Mark common + add extra edges
//   Object.entries(fofToDirects).forEach(([fofId, directs]) => {
//     if (directs.length > 1) {
//       const fofNode = nodes.find((n) => n.id === fofId)
//       if (fofNode) fofNode.isCommon = true
//       // Add edges from each extra direct
//       directs.slice(1).forEach((did) => {
//         edges.push({ from: did, to: fofId, type: 'common' })
//       })
//     }
//   })

//   return { nodes, edges }
// }

// function positionNodes(nodes) {
//   const W = 520, H = 520, cx = W / 2, cy = H / 2

//   const center = nodes.find((n) => n.type === 'center')
//   const directs = nodes.filter((n) => n.type === 'direct')
//   const fofs = nodes.filter((n) => n.type === 'fof')

//   if (center) { center.x = cx; center.y = cy; center.r = 38 }

//   const r1 = 140
//   directs.forEach((n, i) => {
//     const angle = (2 * Math.PI * i) / Math.max(directs.length, 1) - Math.PI / 2
//     n.x = cx + r1 * Math.cos(angle)
//     n.y = cy + r1 * Math.sin(angle)
//     n.r = 30
//   })

//   const r2 = 230
//   fofs.forEach((n, i) => {
//     const angle = (2 * Math.PI * i) / Math.max(fofs.length, 1) - Math.PI / 2 + (Math.PI / Math.max(fofs.length, 1))
//     n.x = cx + r2 * Math.cos(angle)
//     n.y = cy + r2 * Math.sin(angle)
//     n.r = 24
//   })

//   return nodes
// }

// export default function NetworkGraph() {
//   const { userId } = useParams()
//   const navigate = useNavigate()
//   const canvasRef = useRef(null)
//   const [graph, setGraph] = useState({ nodes: [], edges: [] })
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [hovered, setHovered] = useState(null)
//   const [rawData, setRawData] = useState(null)
//   const animRef = useRef(0)
//   const progressRef = useRef(0)

//   useEffect(() => {
//     if (!userId) return
//     axios.get(`/api/admin/network/${userId}`)
//       .then((res) => {
//         setRawData(res.data)
//         const { nodes, edges } = buildGraph(res.data)
//         setGraph({ nodes: positionNodes(nodes), edges })
//         setLoading(false)
//       })
//       .catch(() => {
//         setError('Could not load network data.')
//         setLoading(false)
//       })
//   }, [userId])

//   useEffect(() => {
//     if (!graph.nodes.length) return
//     const canvas = canvasRef.current
//     if (!canvas) return
//     const ctx = canvas.getContext('2d')
//     const W = canvas.width, H = canvas.height

//     let frame = 0
//     const TOTAL_FRAMES = 50

//     const draw = () => {
//       frame = Math.min(frame + 1, TOTAL_FRAMES)
//       const t = frame / TOTAL_FRAMES // 0→1 easing
//       const ease = 1 - Math.pow(1 - t, 3)

//       ctx.clearRect(0, 0, W, H)

//       // Background rings (decorative)
//       const drawRing = (r, opacity) => {
//         ctx.beginPath()
//         ctx.arc(W / 2, H / 2, r, 0, Math.PI * 2)
//         ctx.strokeStyle = `rgba(124, 58, 237, ${opacity})`
//         ctx.lineWidth = 0.5
//         ctx.setLineDash([4, 8])
//         ctx.stroke()
//         ctx.setLineDash([])
//       }
//       drawRing(140 * ease, 0.2)
//       drawRing(230 * ease, 0.12)

//       // Edges
//       graph.edges.forEach((e) => {
//         const from = graph.nodes.find((n) => n.id === e.from)
//         const to = graph.nodes.find((n) => n.id === e.to)
//         if (!from || !to) return

//         const mx = from.x + (to.x - from.x) * ease
//         const my = from.y + (to.y - from.y) * ease

//         ctx.beginPath()
//         ctx.moveTo(from.x, from.y)
//         ctx.lineTo(mx, my)

//         if (e.type === 'common') {
//           ctx.strokeStyle = COLORS.common
//           ctx.lineWidth = 2
//           ctx.setLineDash([5, 4])
//         } else if (e.type === 'fof') {
//           ctx.strokeStyle = COLORS.fofEdge
//           ctx.lineWidth = 1.2
//           ctx.setLineDash([3, 5])
//         } else {
//           ctx.strokeStyle = COLORS.edge
//           ctx.lineWidth = 1.5
//           ctx.setLineDash([])
//         }
//         ctx.globalAlpha = 0.7
//         ctx.stroke()
//         ctx.setLineDash([])
//         ctx.globalAlpha = 1
//       })

//       // Nodes
//       graph.nodes.forEach((n) => {
//         if (!n.x || !n.y) return
//         const col = COLORS[n.type] || COLORS.fof
//         const scale = n.type === 'center' ? ease : ease
//         const r = n.r * (0.2 + 0.8 * ease)
//         const isHov = hovered === n.id

//         // Glow on hover
//         if (isHov) {
//           ctx.beginPath()
//           ctx.arc(n.x, n.y, r + 10, 0, Math.PI * 2)
//           ctx.fillStyle = col.fill + '33'
//           ctx.fill()
//         }

//         // Common friend extra ring
//         if (n.isCommon) {
//           ctx.beginPath()
//           ctx.arc(n.x, n.y, r + 5, 0, Math.PI * 2)
//           ctx.strokeStyle = COLORS.common
//           ctx.lineWidth = 2
//           ctx.setLineDash([3, 3])
//           ctx.stroke()
//           ctx.setLineDash([])
//         }

//         // Circle
//         ctx.beginPath()
//         ctx.arc(n.x, n.y, r, 0, Math.PI * 2)
//         ctx.fillStyle = col.fill
//         ctx.fill()
//         ctx.strokeStyle = col.stroke
//         ctx.lineWidth = n.type === 'center' ? 3 : 2
//         ctx.stroke()

//         // Label inside
//         const fontSize = n.type === 'center' ? 11 : 9
//         ctx.fillStyle = col.text
//         ctx.font = `600 ${fontSize}px system-ui, sans-serif`
//         ctx.textAlign = 'center'
//         ctx.textBaseline = 'middle'
//         const words = (n.label || '').split(' ')
//         if (words.length > 1) {
//           ctx.fillText(words[0], n.x, n.y - fontSize * 0.6)
//           ctx.fillText(words.slice(1).join(' '), n.x, n.y + fontSize * 0.7)
//         } else {
//           ctx.fillText(n.label || '', n.x, n.y)
//         }

//         // Badge for common
//         if (n.isCommon && t > 0.8) {
//           ctx.fillStyle = COLORS.common
//           ctx.beginPath()
//           ctx.arc(n.x + r - 2, n.y - r + 2, 7, 0, Math.PI * 2)
//           ctx.fill()
//           ctx.fillStyle = '#fff'
//           ctx.font = 'bold 8px system-ui'
//           ctx.fillText('★', n.x + r - 2, n.y - r + 2.5)
//         }
//       })

//       if (frame < TOTAL_FRAMES) {
//         animRef.current = requestAnimationFrame(draw)
//       }
//     }

//     animRef.current = requestAnimationFrame(draw)
//     return () => cancelAnimationFrame(animRef.current)
//   }, [graph, hovered])

//   const handleMouseMove = (e) => {
//     const canvas = canvasRef.current
//     if (!canvas) return
//     const rect = canvas.getBoundingClientRect()
//     const scaleX = canvas.width / rect.width
//     const scaleY = canvas.height / rect.height
//     const mx = (e.clientX - rect.left) * scaleX
//     const my = (e.clientY - rect.top) * scaleY

//     let hit = null
//     for (const n of graph.nodes) {
//       if (!n.x || !n.y) continue
//       const dx = mx - n.x, dy = my - n.y
//       if (Math.sqrt(dx * dx + dy * dy) < n.r + 8) { hit = n.id; break }
//     }
//     setHovered(hit)
//   }

//   const handleMouseLeave = () => setHovered(null)

//   const hoveredNode = graph.nodes.find((n) => n.id === hovered)

//   const legends = [
//     { color: COLORS.center.fill,  label: 'Selected user' },
//     { color: COLORS.direct.fill,  label: '1st degree (direct contact)' },
//     { color: COLORS.fof.fill,     label: '2nd degree (friend of friend)' },
//     { color: COLORS.common,       label: 'Common friend ★' },
//   ]

//   return (
//     <div className="page">
//       <div className="container" style={{ maxWidth: 800 }}>

//         {/* Header */}
//         <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
//           <button
//             onClick={() => navigate('/admin')}
//             style={{
//               background: 'none', border: '1px solid var(--border)',
//               borderRadius: 8, padding: '6px 14px', cursor: 'pointer',
//               color: 'var(--text)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6
//             }}
//           >
//             ← Back
//           </button>
//           <h2 style={{ fontSize: 22, margin: 0 }}>Social Network</h2>
//           {rawData?.user && (
//             <span style={{
//               fontSize: 13, background: 'var(--primary-light)',
//               color: 'var(--primary)', borderRadius: 20, padding: '3px 12px'
//             }}>
//               {rawData.user}
//             </span>
//           )}
//         </div>

//         {loading && (
//           <div style={{ textAlign: 'center', padding: '80px 0' }}>
//             <div className="spinner" />
//             <p style={{ color: 'var(--text-muted)', marginTop: 12 }}>Loading network…</p>
//           </div>
//         )}

//         {error && (
//           <div style={{
//             background: '#fee2e2', color: '#991b1b',
//             padding: '14px 18px', borderRadius: 10, fontSize: 14
//           }}>
//             {error}
//           </div>
//         )}

//         {!loading && !error && graph.nodes.length === 0 && (
//           <div style={{
//             textAlign: 'center', padding: '60px 0',
//             color: 'var(--text-muted)', fontSize: 15
//           }}>
//             No network data found for this user.
//           </div>
//         )}

//         {!loading && !error && graph.nodes.length > 0 && (
//           <>
//             {/* Canvas card */}
//             <div style={{
//               background: 'var(--white)',
//               borderRadius: 16,
//               boxShadow: 'var(--shadow)',
//               padding: 24,
//               position: 'relative'
//             }}>
//               <canvas
//                 ref={canvasRef}
//                 width={520}
//                 height={520}
//                 onMouseMove={handleMouseMove}
//                 onMouseLeave={handleMouseLeave}
//                 style={{
//                   width: '100%',
//                   height: 'auto',
//                   cursor: hovered ? 'pointer' : 'default',
//                   display: 'block'
//                 }}
//               />

//               {/* Tooltip on hover */}
//               {hoveredNode && (
//                 <div style={{
//                   position: 'absolute', top: 30, right: 30,
//                   background: 'var(--white)',
//                   border: '1px solid var(--border)',
//                   borderRadius: 10,
//                   padding: '10px 16px',
//                   minWidth: 160,
//                   boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
//                   pointerEvents: 'none'
//                 }}>
//                   <div style={{
//                     display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6
//                   }}>
//                     <span style={{
//                       width: 10, height: 10, borderRadius: '50%',
//                       background: COLORS[hoveredNode.type]?.fill || '#888',
//                       flexShrink: 0
//                     }} />
//                     <strong style={{ fontSize: 13 }}>{hoveredNode.label}</strong>
//                   </div>
//                   <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
//                     {hoveredNode.type === 'center' && 'Selected user'}
//                     {hoveredNode.type === 'direct' && 'Direct contact (1st degree)'}
//                     {hoveredNode.type === 'fof' && `Friend of friend (2nd degree)${hoveredNode.isCommon ? ' · Common friend' : ''}`}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Legend */}
//             <div style={{
//               display: 'flex', flexWrap: 'wrap', gap: '10px 24px',
//               marginTop: 18, padding: '14px 18px',
//               background: 'var(--white)',
//               borderRadius: 12,
//               boxShadow: 'var(--shadow)'
//             }}>
//               {legends.map((l) => (
//                 <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//                   <span style={{
//                     width: 12, height: 12, borderRadius: '50%',
//                     background: l.color, flexShrink: 0,
//                     border: '2px solid rgba(0,0,0,0.1)'
//                   }} />
//                   <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{l.label}</span>
//                 </div>
//               ))}
//               <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//                 <span style={{
//                   width: 20, height: 2, background: COLORS.fofEdge,
//                   borderRadius: 2, borderTop: `2px dashed ${COLORS.fofEdge}`
//                 }} />
//                 <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>2nd-degree edge</span>
//               </div>
//             </div>

//             {/* Stats row */}
//             <div style={{
//               display: 'grid',
//               gridTemplateColumns: 'repeat(3, 1fr)',
//               gap: 12,
//               marginTop: 14
//             }}>
//               {[
//                 { label: 'Direct contacts', value: graph.nodes.filter(n => n.type === 'direct').length, color: COLORS.direct.fill },
//                 { label: 'Friends of friends', value: graph.nodes.filter(n => n.type === 'fof').length, color: COLORS.fof.fill },
//                 { label: 'Common friends', value: graph.nodes.filter(n => n.isCommon).length, color: COLORS.common },
//               ].map((s) => (
//                 <div key={s.label} style={{
//                   background: 'var(--white)',
//                   borderRadius: 12,
//                   padding: '14px 16px',
//                   boxShadow: 'var(--shadow)',
//                   borderLeft: `3px solid ${s.color}`
//                 }}>
//                   <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
//                   <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
//                 </div>
//               ))}
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   )
// }


import { useEffect, useRef, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

// Skeleton pulse animation injected once
const SKELETON_STYLE = `
@keyframes skPulse { 0%,100%{opacity:.35} 50%{opacity:.7} }
.sk { animation: skPulse 1.4s ease-in-out infinite; }
`
if (typeof document !== 'undefined' && !document.getElementById('sk-style')) {
  const s = document.createElement('style')
  s.id = 'sk-style'
  s.textContent = SKELETON_STYLE
  document.head.appendChild(s)
}

function NetworkSkeleton() {
  const W = 520, H = 520, cx = W / 2, cy = H / 2
  const r1 = 140, r2 = 230
  const skNodes = [
    { x: cx, y: cy, r: 38 },
    ...([0,1,2].map(i => {
      const a = (2*Math.PI*i/3) - Math.PI/2
      return { x: cx + r1*Math.cos(a), y: cy + r1*Math.sin(a), r: 30 }
    })),
    ...([0,1,2].map(i => {
      const a = (2*Math.PI*i/3) - Math.PI/2 + Math.PI/3
      return { x: cx + r2*Math.cos(a), y: cy + r2*Math.sin(a), r: 24 }
    })),
  ]
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
      {/* Rings */}
      {[140, 230].map(r => (
        <circle key={r} cx={cx} cy={cy} r={r} fill="none"
          stroke="rgba(124,58,237,0.12)" strokeWidth="0.5" strokeDasharray="4 8" />
      ))}
      {/* Edges */}
      {skNodes.slice(1,4).map((n,i) => (
        <line key={`e${i}`} x1={cx} y1={cy} x2={n.x} y2={n.y}
          stroke="rgba(192,132,252,0.3)" strokeWidth="1.5" />
      ))}
      {skNodes.slice(1,4).map((n,i) => (
        <line key={`e2${i}`} x1={n.x} y1={n.y}
          x2={skNodes[4+i]?.x || n.x} y2={skNodes[4+i]?.y || n.y}
          stroke="rgba(94,234,212,0.25)" strokeWidth="1" strokeDasharray="3 5" />
      ))}
      {/* Nodes */}
      {skNodes.map((n,i) => (
        <circle key={i} className="sk" cx={n.x} cy={n.y} r={n.r}
          fill={i===0 ? 'rgba(124,58,237,0.25)' : i<4 ? 'rgba(219,39,119,0.2)' : 'rgba(15,118,110,0.2)'}
          style={{ animationDelay: `${i*0.1}s` }} />
      ))}
    </svg>
  )
}

const MAX_NODES = 7 // 1 center + up to 3 direct + up to 3 FoF

const COLORS = {
  center:  { fill: '#7C3AED', stroke: '#5B21B6', text: '#fff' },
  direct:  { fill: '#DB2777', stroke: '#9D174D', text: '#fff' },
  fof:     { fill: '#0F766E', stroke: '#0D5C55', text: '#fff' },
  edge:    '#C084FC',
  fofEdge: '#5EEAD4',
  common:  '#F59E0B',
}

function buildGraph(data) {
  if (!data) return { nodes: [], edges: [] }

  const nodes = []
  const edges = []
  const seen = new Set()

  // Center
  const centerName = data.user || 'User'
  nodes.push({ id: 'center', label: centerName, type: 'center' })
  seen.add(centerName)

  // Limit graph items: 1 center + up to 3 direct + up to 3 FoF
  const graph = (data.graph || []).slice(0, 3)

  const directMap = {} // friendName -> nodeId

  graph.forEach((item, i) => {
    const friendName = item.friend
    if (!friendName || seen.has(friendName)) return
    seen.add(friendName)

    const fid = `d-${i}`
    nodes.push({ id: fid, label: friendName, type: 'direct' })
    edges.push({ from: 'center', to: fid, type: 'direct' })
    directMap[friendName] = fid
  })

  // FoF — limit to 3 across all direct nodes
  const fofAdded = []
  for (const item of graph) {
    if (fofAdded.length >= 3) break
    const fofList = (item.contacts || []).slice(0, 3 - fofAdded.length)
    const directId = directMap[item.friend]
    if (!directId) continue

    fofList.forEach((fofName, j) => {
      if (!fofName || seen.has(fofName)) return
      seen.add(fofName)
      const fofId = `fof-${fofAdded.length}`
      nodes.push({ id: fofId, label: fofName, type: 'fof' })
      edges.push({ from: directId, to: fofId, type: 'fof' })
      fofAdded.push({ id: fofId, name: fofName })
    })
  }

  // Detect common friends: FoF nodes reachable via multiple direct nodes
  const fofToDirects = {}
  graph.forEach((item) => {
    const directId = directMap[item.friend]
    if (!directId) return
    ;(item.contacts || []).forEach((fofName) => {
      const fofNode = nodes.find((n) => n.label === fofName && n.type === 'fof')
      if (!fofNode) return
      if (!fofToDirects[fofNode.id]) fofToDirects[fofNode.id] = []
      if (!fofToDirects[fofNode.id].includes(directId))
        fofToDirects[fofNode.id].push(directId)
    })
  })

  // Mark common + add extra edges
  Object.entries(fofToDirects).forEach(([fofId, directs]) => {
    if (directs.length > 1) {
      const fofNode = nodes.find((n) => n.id === fofId)
      if (fofNode) fofNode.isCommon = true
      // Add edges from each extra direct
      directs.slice(1).forEach((did) => {
        edges.push({ from: did, to: fofId, type: 'common' })
      })
    }
  })

  return { nodes, edges }
}

function positionNodes(nodes) {
  const W = 520, H = 520, cx = W / 2, cy = H / 2

  const center = nodes.find((n) => n.type === 'center')
  const directs = nodes.filter((n) => n.type === 'direct')
  const fofs = nodes.filter((n) => n.type === 'fof')

  if (center) { center.x = cx; center.y = cy; center.r = 38 }

  const r1 = 140
  directs.forEach((n, i) => {
    const angle = (2 * Math.PI * i) / Math.max(directs.length, 1) - Math.PI / 2
    n.x = cx + r1 * Math.cos(angle)
    n.y = cy + r1 * Math.sin(angle)
    n.r = 30
  })

  const r2 = 230
  fofs.forEach((n, i) => {
    const angle = (2 * Math.PI * i) / Math.max(fofs.length, 1) - Math.PI / 2 + (Math.PI / Math.max(fofs.length, 1))
    n.x = cx + r2 * Math.cos(angle)
    n.y = cy + r2 * Math.sin(angle)
    n.r = 24
  })

  return nodes
}

export default function NetworkGraph() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const canvasRef = useRef(null)
  const [graph, setGraph] = useState({ nodes: [], edges: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [hovered, setHovered] = useState(null)
  const [rawData, setRawData] = useState(null)
  const animRef = useRef(0)
  const progressRef = useRef(0)

  useEffect(() => {
    if (!userId) return
    axios.get(`/api/admin/network/${userId}`)
      .then((res) => {
        setRawData(res.data)
        const { nodes, edges } = buildGraph(res.data)
        setGraph({ nodes: positionNodes(nodes), edges })
        setLoading(false)
      })
      .catch(() => {
        setError('Could not load network data.')
        setLoading(false)
      })
  }, [userId])

  useEffect(() => {
    if (!graph.nodes.length) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width, H = canvas.height

    let frame = 0
    const TOTAL_FRAMES = 50

    const draw = () => {
      frame = Math.min(frame + 1, TOTAL_FRAMES)
      const t = frame / TOTAL_FRAMES // 0→1 easing
      const ease = 1 - Math.pow(1 - t, 3)

      ctx.clearRect(0, 0, W, H)

      // Background rings (decorative)
      const drawRing = (r, opacity) => {
        ctx.beginPath()
        ctx.arc(W / 2, H / 2, r, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(124, 58, 237, ${opacity})`
        ctx.lineWidth = 0.5
        ctx.setLineDash([4, 8])
        ctx.stroke()
        ctx.setLineDash([])
      }
      drawRing(140 * ease, 0.2)
      drawRing(230 * ease, 0.12)

      // Edges
      graph.edges.forEach((e) => {
        const from = graph.nodes.find((n) => n.id === e.from)
        const to = graph.nodes.find((n) => n.id === e.to)
        if (!from || !to) return

        const mx = from.x + (to.x - from.x) * ease
        const my = from.y + (to.y - from.y) * ease

        ctx.beginPath()
        ctx.moveTo(from.x, from.y)
        ctx.lineTo(mx, my)

        if (e.type === 'common') {
          ctx.strokeStyle = COLORS.common
          ctx.lineWidth = 2
          ctx.setLineDash([5, 4])
        } else if (e.type === 'fof') {
          ctx.strokeStyle = COLORS.fofEdge
          ctx.lineWidth = 1.2
          ctx.setLineDash([3, 5])
        } else {
          ctx.strokeStyle = COLORS.edge
          ctx.lineWidth = 1.5
          ctx.setLineDash([])
        }
        ctx.globalAlpha = 0.7
        ctx.stroke()
        ctx.setLineDash([])
        ctx.globalAlpha = 1
      })

      // Nodes
      graph.nodes.forEach((n) => {
        if (!n.x || !n.y) return
        const col = COLORS[n.type] || COLORS.fof
        const scale = n.type === 'center' ? ease : ease
        const r = n.r * (0.2 + 0.8 * ease)
        const isHov = hovered === n.id

        // Glow on hover
        if (isHov) {
          ctx.beginPath()
          ctx.arc(n.x, n.y, r + 10, 0, Math.PI * 2)
          ctx.fillStyle = col.fill + '33'
          ctx.fill()
        }

        // Common friend extra ring
        if (n.isCommon) {
          ctx.beginPath()
          ctx.arc(n.x, n.y, r + 5, 0, Math.PI * 2)
          ctx.strokeStyle = COLORS.common
          ctx.lineWidth = 2
          ctx.setLineDash([3, 3])
          ctx.stroke()
          ctx.setLineDash([])
        }

        // Circle
        ctx.beginPath()
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2)
        ctx.fillStyle = col.fill
        ctx.fill()
        ctx.strokeStyle = col.stroke
        ctx.lineWidth = n.type === 'center' ? 3 : 2
        ctx.stroke()

        // Label inside
        const fontSize = n.type === 'center' ? 11 : 9
        ctx.fillStyle = col.text
        ctx.font = `600 ${fontSize}px system-ui, sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        const words = (n.label || '').split(' ')
        if (words.length > 1) {
          ctx.fillText(words[0], n.x, n.y - fontSize * 0.6)
          ctx.fillText(words.slice(1).join(' '), n.x, n.y + fontSize * 0.7)
        } else {
          ctx.fillText(n.label || '', n.x, n.y)
        }

        // Badge for common
        if (n.isCommon && t > 0.8) {
          ctx.fillStyle = COLORS.common
          ctx.beginPath()
          ctx.arc(n.x + r - 2, n.y - r + 2, 7, 0, Math.PI * 2)
          ctx.fill()
          ctx.fillStyle = '#fff'
          ctx.font = 'bold 8px system-ui'
          ctx.fillText('★', n.x + r - 2, n.y - r + 2.5)
        }
      })

      if (frame < TOTAL_FRAMES) {
        animRef.current = requestAnimationFrame(draw)
      }
    }

    animRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(animRef.current)
  }, [graph, hovered])

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const mx = (e.clientX - rect.left) * scaleX
    const my = (e.clientY - rect.top) * scaleY

    let hit = null
    for (const n of graph.nodes) {
      if (!n.x || !n.y) continue
      const dx = mx - n.x, dy = my - n.y
      if (Math.sqrt(dx * dx + dy * dy) < n.r + 8) { hit = n.id; break }
    }
    setHovered(hit)
  }

  const handleMouseLeave = () => setHovered(null)

  const hoveredNode = graph.nodes.find((n) => n.id === hovered)

  const legends = [
    { color: COLORS.center.fill,  label: 'Selected user' },
    { color: COLORS.direct.fill,  label: '1st degree (direct contact)' },
    { color: COLORS.fof.fill,     label: '2nd degree (friend of friend)' },
    { color: COLORS.common,       label: 'Common friend ★' },
  ]

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 800 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <button
            onClick={() => navigate('/admin')}
            style={{
              background: 'none', border: '1px solid var(--border)',
              borderRadius: 8, padding: '6px 14px', cursor: 'pointer',
              color: 'var(--text)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6
            }}
          >
            ← Back
          </button>
          <h2 style={{ fontSize: 22, margin: 0 }}>Social Network</h2>
          {rawData?.user && (
            <span style={{
              fontSize: 13, background: 'var(--primary-light)',
              color: 'var(--primary)', borderRadius: 20, padding: '3px 12px'
            }}>
              {rawData.user}
            </span>
          )}
        </div>

        {loading && (
          <div style={{
            background: 'var(--white)', borderRadius: 16,
            boxShadow: 'var(--shadow)', padding: 24
          }}>
            <NetworkSkeleton />
            <div style={{ display: 'flex', gap: 12, marginTop: 14 }}>
              {[1,2,3].map(i => (
                <div key={i} className="sk" style={{
                  flex: 1, height: 64, borderRadius: 12,
                  background: 'var(--bg)', animationDelay: `${i*0.15}s`
                }} />
              ))}
            </div>
          </div>
        )}

        {error && (
          <div style={{
            background: '#fee2e2', color: '#991b1b',
            padding: '14px 18px', borderRadius: 10, fontSize: 14
          }}>
            {error}
          </div>
        )}

        {!loading && !error && graph.nodes.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '60px 0',
            color: 'var(--text-muted)', fontSize: 15
          }}>
            No network data found for this user.
          </div>
        )}

        {!loading && !error && graph.nodes.length > 0 && (
          <>
            {/* Canvas card */}
            <div style={{
              background: 'var(--white)',
              borderRadius: 16,
              boxShadow: 'var(--shadow)',
              padding: 24,
              position: 'relative'
            }}>
              <canvas
                ref={canvasRef}
                width={520}
                height={520}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                  width: '100%',
                  height: 'auto',
                  cursor: hovered ? 'pointer' : 'default',
                  display: 'block'
                }}
              />

              {/* Tooltip on hover */}
              {hoveredNode && (
                <div style={{
                  position: 'absolute', top: 30, right: 30,
                  background: 'var(--white)',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  padding: '10px 16px',
                  minWidth: 160,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                  pointerEvents: 'none'
                }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6
                  }}>
                    <span style={{
                      width: 10, height: 10, borderRadius: '50%',
                      background: COLORS[hoveredNode.type]?.fill || '#888',
                      flexShrink: 0
                    }} />
                    <strong style={{ fontSize: 13 }}>{hoveredNode.label}</strong>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    {hoveredNode.type === 'center' && 'Selected user'}
                    {hoveredNode.type === 'direct' && 'Direct contact (1st degree)'}
                    {hoveredNode.type === 'fof' && `Friend of friend (2nd degree)${hoveredNode.isCommon ? ' · Common friend' : ''}`}
                  </div>
                </div>
              )}
            </div>

            {/* Legend */}
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: '10px 24px',
              marginTop: 18, padding: '14px 18px',
              background: 'var(--white)',
              borderRadius: 12,
              boxShadow: 'var(--shadow)'
            }}>
              {legends.map((l) => (
                <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    width: 12, height: 12, borderRadius: '50%',
                    background: l.color, flexShrink: 0,
                    border: '2px solid rgba(0,0,0,0.1)'
                  }} />
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{l.label}</span>
                </div>
              ))}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  width: 20, height: 2, background: COLORS.fofEdge,
                  borderRadius: 2, borderTop: `2px dashed ${COLORS.fofEdge}`
                }} />
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>2nd-degree edge</span>
              </div>
            </div>

            {/* Stats row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 12,
              marginTop: 14
            }}>
              {[
                { label: 'Direct contacts', value: graph.nodes.filter(n => n.type === 'direct').length, color: COLORS.direct.fill },
                { label: 'Friends of friends', value: graph.nodes.filter(n => n.type === 'fof').length, color: COLORS.fof.fill },
                { label: 'Common friends', value: graph.nodes.filter(n => n.isCommon).length, color: COLORS.common },
              ].map((s) => (
                <div key={s.label} style={{
                  background: 'var(--white)',
                  borderRadius: 12,
                  padding: '14px 16px',
                  boxShadow: 'var(--shadow)',
                  borderLeft: `3px solid ${s.color}`
                }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}