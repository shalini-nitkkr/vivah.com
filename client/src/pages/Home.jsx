// import { Link } from 'react-router-dom'
// import VivahLogo from '../components/VivahLogo'
// import { useAuth } from '../context/AuthContext'

// export default function Home() {
//   const { user } = useAuth()
//   return (
//     <div>
//       {/* Hero */}
//       <section className="hero">
//         <div className="container">
//           <div className="grid-2" style={{ alignItems: 'center', gap: 40, minHeight: '100vh' }}>
//             <div className="hero-content">
//               <div style={{marginBottom:16}}><VivahLogo size={52} showText={true} /></div>
//               <h1 className="hero-title">
//                 Find Your <span>Perfect Life</span> Partner
//               </h1>
//               <p className="hero-sub">
//                 Vivah is a trust-based matrimonial platform where real friends vouch for each other.
//                 No fake profiles. No bots. Just genuine connections.
//               </p>
//               <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
//                 {user ? (
//                   <Link to="/browse" className="btn btn-primary" style={{ fontSize: 16, padding: '12px 32px' }}>
//                     Browse Profiles →
//                   </Link>
//                 ) : (
//                   <>
//                     <Link to="/register" className="btn btn-primary" style={{ fontSize: 16, padding: '12px 32px' }}>
//                       Register Free →
//                     </Link>
//                     <Link to="/login" className="btn btn-outline" style={{ fontSize: 16, padding: '12px 32px' }}>
//                       Login
//                     </Link>
//                   </>
//                 )}
//               </div>
//               <div style={{ display: 'flex', gap: 32, marginTop: 40 }}>
//                 {[['10,000+', 'Profiles'], ['5,000+', 'Matches'], ['100%', 'Free']].map(([n, l]) => (
//                   <div key={l}>
//                     <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--primary)', fontFamily: 'Playfair Display,serif' }}>{n}</div>
//                     <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{l}</div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//             <div className="hero-image"></div>
//           </div>
//         </div>
//       </section>

//       {/* Features */}
//       <section className="section" style={{ background: 'var(--white)' }}>
//         <div className="container">
//           <h2 className="section-title">Why Choose Vivah?</h2>
//           <p className="section-sub">Built on trust, designed for real connections</p>
//           <div className="grid-3">
//             {[
//               { icon: '🛡', title: 'Trust Chain', desc: 'Friends vouch for friends. Get verified by 3 real people you know to become a Trusted member.' },
//               { icon: '🔍', title: 'Smart Search', desc: 'Filter by age, religion, city, education and more to find the most compatible profiles.' },
//               { icon: '💌', title: 'Send Interest', desc: 'Like a profile? Send them an interest. Both sides can accept or decline privately.' },
//               { icon: '🤝', title: 'Real Matches', desc: 'When both accept each other, you become a match and can see contact details.' },
//               { icon: '👤', title: 'Rich Profiles', desc: 'Add photo, education, occupation, income, about me and partner preferences.' },
//               { icon: '🔒', title: 'Privacy First', desc: 'Phone and email are only shared after both parties accept each other.' },
//             ].map(f => (
//               <div key={f.title} className="card feature-card">
//                 <div className="feature-icon">{f.icon}</div>
//                 <div className="feature-title">{f.title}</div>
//                 <p className="feature-desc">{f.desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* How it works */}
//       <section className="section">
//         <div className="container">
//           <h2 className="section-title">How It Works</h2>
//           <p className="section-sub">4 simple steps to find your partner</p>
//           <div className="grid-2" style={{ gap: 40, alignItems: 'center' }}>
//             <div>
//               {[
//                 { step: '1', title: 'Register', desc: 'Create your free account with name, email and basic details.' },
//                 { step: '2', title: 'Complete Profile', desc: 'Add your photo, education, occupation and what you are looking for.' },
//                 { step: '3', title: 'Browse & Connect', desc: 'Search profiles and send interest to people you like.' },
//                 { step: '4', title: 'Get Trusted', desc: 'Ask 3 Level-2 friends to vouch for you to unlock full access.' },
//               ].map((s, i) => (
//                 <div key={s.step} style={{ display: 'flex', gap: 20, marginBottom: i < 3 ? 32 : 0 }}>
//                   <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, flexShrink: 0 }}>{s.step}</div>
//                   <div>
//                     <div style={{ fontWeight: 600, fontSize: 17, marginBottom: 4 }}>{s.title}</div>
//                     <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>{s.desc}</div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <div style={{ textAlign: 'center', fontSize: 120 }}></div>
//           </div>
//         </div>
//       </section>

//       <footer className="footer">
//         <p></p>
//         <p style={{ marginTop: 8, fontSize: 13 }}></p>
//       </footer>
//     </div>
//   )
// }





import { useState } from 'react'
import { Link } from 'react-router-dom'
import VivahLogo from '../components/VivahLogo'
import { useAuth } from '../context/AuthContext'

const features = [
  { icon:'🔵', title:'Contact Graph',   desc:'Friend-of-friend profiles appear first with trust degree badges — people your contacts know.',   bg:'#1a1a2e', text:'#e5e7eb' },
  { icon:'🛡',  title:'Trust Chain',     desc:'Get vouched by 3 real Level-2 friends to unlock Trusted Member status and full platform access.', bg:'#c0392b', text:'#fff' },
  { icon:'🔍', title:'Smart Filters',   desc:'Filter by age, city, income, religion, education and more to find the most compatible profiles.',  bg:'#1e3a5f', text:'#e5e7eb' },
  { icon:'💌', title:'Send Interest',   desc:'Like a profile? Send an interest. Both parties can accept or decline privately — no awkwardness.', bg:'#4a1942', text:'#f3e8ff' },
  { icon:'🔮', title:'Kundli Match',    desc:'AI-powered cosine similarity + traditional 36-point Ashtakoot Guna Milan compatibility score.',    bg:'#1a3a2e', text:'#d1fae5' },
  { icon:'🔒', title:'Privacy First',   desc:'Phone number and email are only revealed after both parties have mutually accepted each other.',    bg:'#2d1a0e', text:'#fed7aa' },
]

export default function Home() {
  const { user } = useAuth()
  const [activeStory, setActiveStory] = useState(0)

  return (
    <div style={{ fontFamily:"'Inter',sans-serif", background:'var(--bg)' }}>

      {/* ── HERO — full-width background image ──────────────────────────── */}
      <section style={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}>
        {/* Full-bleed bg image */}
        <img
          src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1400&q=80"
          alt=""
          style={{
            position:'absolute', inset:0, width:'100%', height:'100%',
            objectFit:'cover', objectPosition:'center top',
            filter:'brightness(0.38)',
          }}
        />

        {/* Gradient overlay — bottom fade */}
        <div style={{
          position:'absolute', inset:0,
          background:'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(26,26,46,0.55) 60%, rgba(26,26,46,0.95) 100%)',
        }}/>

        {/* Content */}
        <div style={{ position:'relative', zIndex:2, maxWidth:1100, margin:'0 auto', width:'100%', padding:'0 24px' }}>
          <div style={{ maxWidth: 620 }}>

            {/* Logo */}
            <div style={{ marginBottom:28, filter:'brightness(1.6)' }}>
              <VivahLogo size={44} showText={true}/>
            </div>

            {/* Trust pill */}
            <div style={{
              display:'inline-flex', alignItems:'center', gap:8,
              background:'rgba(192,57,43,.25)', border:'1px solid rgba(192,57,43,.5)',
              color:'#fca5a5', padding:'6px 16px', borderRadius:999,
              fontSize:12, fontWeight:600, letterSpacing:'.06em',
              textTransform:'uppercase', marginBottom:28,
            }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:'#ef4444', flexShrink:0 }}/>
              Trust-Based Matrimonial Platform
            </div>

            <h1 style={{
              fontFamily:"'Playfair Display',serif",
              fontSize:'clamp(38px,6vw,68px)',
              fontWeight:700, lineHeight:1.14,
              color:'#fff', marginBottom:24,
            }}>
              Find Your<br/>
              <span style={{ color:'#fca5a5' }}>Perfect Life</span><br/>
              Partner
            </h1>

            <p style={{
              fontSize:17, color:'rgba(255,255,255,.75)',
              lineHeight:1.8, maxWidth:500, marginBottom:36,
            }}>
              Vivah connects you with people your friends already know — using a Neo4j contact graph
              to surface trusted profiles first, sorted by real-world connection.
            </p>

            {/* CTAs */}
            <div style={{ display:'flex', gap:14, flexWrap:'wrap', marginBottom:52 }}>
              {user ? (
                <Link to="/browse" style={btnStyles.primary}>Browse Profiles →</Link>
              ) : (
                <>
                  <Link to="/register" style={btnStyles.primary}>Get Started Free →</Link>
                  <Link to="/login"    style={btnStyles.ghost}>Sign In</Link>
                </>
              )}
            </div>

            {/* Stats */}
            <div style={{ display:'flex', gap:40, flexWrap:'wrap' }}>
              {[['1,000+','Profiles'],['500+','Matches Made'],['3-Level','Trust System']].map(([n,l]) => (
                <div key={l}>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:700, color:'#fff' }}>{n}</div>
                  <div style={{ fontSize:12, color:'rgba(255,255,255,.5)', marginTop:2, letterSpacing:'.04em' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{
          position:'absolute', bottom:32, left:'50%', transform:'translateX(-50%)',
          display:'flex', flexDirection:'column', alignItems:'center', gap:6,
          color:'rgba(255,255,255,.4)', zIndex:2,
        }}>
          <span style={{ fontSize:11, letterSpacing:'.1em', textTransform:'uppercase' }}>Scroll</span>
          <div style={{ width:1, height:40, background:'rgba(255,255,255,.2)' }}/>
        </div>
      </section>

      {/* ── FEATURES — Instagram-style story cards ───────────────────── */}
      <section style={{ background:'#fff', padding:'80px 0' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 24px' }}>
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:36, fontWeight:700, marginBottom:10, color:'#1a1a2e' }}>
              Why Choose Vivah?
            </h2>
            <p style={{ fontSize:15, color:'#6b7280', maxWidth:440, margin:'0 auto' }}>
              Built on trust, powered by graph technology
            </p>
          </div>

          {/* Story bubbles — tap to expand */}
          <div style={{ display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap', marginBottom:32 }}>
            {features.map((f,i) => (
              <button key={i} onClick={() => setActiveStory(i)}
                style={{
                  display:'flex', flexDirection:'column', alignItems:'center', gap:8,
                  background:'none', border:'none', cursor:'pointer', padding:'4px 8px',
                }}>
                <div style={{
                  width:64, height:64, borderRadius:'50%',
                  background: activeStory===i ? f.bg : '#f3f4f6',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:28,
                  border: activeStory===i ? `3px solid ${f.bg}` : '3px solid transparent',
                  outline: activeStory===i ? `2px solid #fff` : 'none',
                  outlineOffset: activeStory===i ? '-5px' : 0,
                  boxShadow: activeStory===i ? `0 0 0 3px ${f.bg}` : '0 0 0 3px #e5e7eb',
                  transition:'all .25s',
                }}>
                  {f.icon}
                </div>
                <span style={{
                  fontSize:10, fontWeight:600, letterSpacing:'.05em',
                  textTransform:'uppercase',
                  color: activeStory===i ? '#1a1a2e' : '#9ca3af',
                }}>
                  {f.title.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>

          {/* Active story card */}
          <div style={{
            maxWidth:600, margin:'0 auto',
            background: features[activeStory].bg,
            borderRadius:24, padding:'40px 36px',
            transition:'background .4s',
            minHeight:180,
          }}>
            {/* Progress bar */}
            <div style={{ display:'flex', gap:4, marginBottom:24 }}>
              {features.map((_,i) => (
                <div key={i} style={{
                  flex:1, height:2, borderRadius:2,
                  background: i<=activeStory ? 'rgba(255,255,255,.8)' : 'rgba(255,255,255,.2)',
                  transition:'background .3s',
                }}/>
              ))}
            </div>

            <div style={{ fontSize:52, marginBottom:16 }}>{features[activeStory].icon}</div>
            <h3 style={{
              fontFamily:"'Playfair Display',serif",
              fontSize:24, fontWeight:700,
              color: features[activeStory].text,
              marginBottom:12,
            }}>
              {features[activeStory].title}
            </h3>
            <p style={{ fontSize:15, lineHeight:1.8, color: features[activeStory].text, opacity:.85 }}>
              {features[activeStory].desc}
            </p>

            {/* Nav arrows */}
            <div style={{ display:'flex', gap:12, marginTop:28 }}>
              <button onClick={() => setActiveStory(s => Math.max(0,s-1))}
                disabled={activeStory===0}
                style={{
                  background:'rgba(255,255,255,.15)', border:'1px solid rgba(255,255,255,.25)',
                  color:'#fff', borderRadius:8, padding:'8px 18px', fontSize:13,
                  cursor: activeStory===0 ? 'not-allowed' : 'pointer',
                  opacity: activeStory===0 ? .4 : 1,
                }}>← Prev</button>
              <button onClick={() => setActiveStory(s => Math.min(features.length-1,s+1))}
                disabled={activeStory===features.length-1}
                style={{
                  background:'rgba(255,255,255,.25)', border:'1px solid rgba(255,255,255,.35)',
                  color:'#fff', borderRadius:8, padding:'8px 18px', fontSize:13,
                  cursor: activeStory===features.length-1 ? 'not-allowed' : 'pointer',
                  opacity: activeStory===features.length-1 ? .4 : 1,
                }}>Next →</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS — timeline ──────────────────────────────────── */}
      <section style={{ background:'#fafafa', padding:'80px 20px' }}>
        <div style={{ maxWidth:680, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:52 }}>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:36, fontWeight:700, marginBottom:10, color:'#1a1a2e' }}>
              How It Works
            </h2>
            <p style={{ fontSize:15, color:'#6b7280' }}>Up and running in 4 steps</p>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
            {[
              { step:'1', title:'Register',        desc:'Create your free account — name, email, gender and date of birth.' },
              { step:'2', title:'Complete Profile', desc:'Add photo, education, occupation, income and partner preferences.' },
              { step:'3', title:'Browse & Match',   desc:'Send interest, chat after both accept, and explore Kundli match.' },
              { step:'4', title:'Get Trusted',      desc:'Ask 3 Level-2 friends to vouch for you and unlock full access.' },
            ].map((s, i, arr) => (
              <div key={s.step} style={{ display:'flex', gap:20, position:'relative', paddingBottom: i<arr.length-1 ? 28 : 0 }}>
                {i < arr.length-1 && (
                  <div style={{ position:'absolute', left:21, top:44, width:2, height:'calc(100% - 8px)', background:'#fadbd8' }}/>
                )}
                <div style={{
                  width:44, height:44, borderRadius:'50%',
                  background:'#c0392b', color:'#fff',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:17, fontWeight:700, flexShrink:0, zIndex:1,
                  boxShadow:'0 4px 16px rgba(192,57,43,.3)',
                }}>{s.step}</div>
                <div style={{
                  background:'#fff', border:'1px solid #e5e7eb',
                  borderRadius:14, padding:'16px 22px', flex:1,
                }}>
                  <div style={{ fontWeight:700, fontSize:16, marginBottom:4, color:'#1a1a2e' }}>{s.title}</div>
                  <div style={{ color:'#6b7280', fontSize:14, lineHeight:1.7 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {!user && (
            <div style={{ textAlign:'center', marginTop:48 }}>
              <Link to="/register" style={{ ...btnStyles.primary, fontSize:16, padding:'14px 44px' }}>
                Start Your Journey →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────── */}
      <footer style={{ background:'#1a1a2e', color:'#9ca3af', padding:'56px 20px 32px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{
            display:'grid',
            gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',
            gap:40, marginBottom:40,
          }}>
            <div>
              <div style={{ filter:'brightness(1.4)', marginBottom:16 }}>
                <VivahLogo size={36} showText={true}/>
              </div>
              <p style={{ fontSize:13, lineHeight:1.8, color:'#6b7280', maxWidth:220 }}>
                Trust-based matrimonial platform. MCA college project built with MERN + Neo4j.
              </p>
            </div>
            <div>
              <p style={{ fontSize:10, fontWeight:600, letterSpacing:'.12em', textTransform:'uppercase', color:'#4b5563', marginBottom:16 }}>Platform</p>
              {[['Browse Profiles','/browse'],['My Matches','/matches'],['Interests','/interests'],['Trust Chain','/trust']].map(([l,h]) => (
                <div key={l} style={{ marginBottom:10 }}>
                  <Link to={h} style={{ color:'#9ca3af', fontSize:14, textDecoration:'none' }}>{l}</Link>
                </div>
              ))}
            </div>
            <div>
              <p style={{ fontSize:10, fontWeight:600, letterSpacing:'.12em', textTransform:'uppercase', color:'#4b5563', marginBottom:16 }}>Tech Stack</p>
              {['🍃 MongoDB Atlas','🔵 Neo4j Graph','⚛️  React + Vite','🟢 Node + Socket.io'].map(t => (
                <div key={t} style={{ fontSize:13, marginBottom:10, color:'#9ca3af' }}>{t}</div>
              ))}
            </div>
          </div>
          <div style={{
            borderTop:'1px solid #2d2d44', paddingTop:24,
            display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:12,
          }}>
            <p style={{ fontSize:13 }}>© {new Date().getFullYear()} Vivah Matrimonial</p>
            <p style={{ fontSize:13 }}>Built with ❤️ by <strong style={{ color:'#e5e7eb' }}>Riyanshi, Manisha, Shalini</strong></p>
          </div>
        </div>
      </footer>

    </div>
  )
}

const btnStyles = {
  primary: {
    display:'inline-flex', alignItems:'center', justifyContent:'center',
    background:'#c0392b', color:'#fff',
    padding:'13px 30px', borderRadius:10,
    fontSize:15, fontWeight:600, textDecoration:'none',
  },
  ghost: {
    display:'inline-flex', alignItems:'center', justifyContent:'center',
    background:'rgba(255,255,255,.12)',
    border:'1px solid rgba(255,255,255,.25)',
    color:'#fff',
    padding:'13px 30px', borderRadius:10,
    fontSize:15, fontWeight:600, textDecoration:'none',
  },
}