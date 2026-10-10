import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import VivahLogo from './VivahLogo'

export default function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const active = (path) => location.pathname === path ? 'nav-link active' : 'nav-link'

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <VivahLogo size={36} showText={true} />
        </Link>
        <div className="navbar-nav">
          {user ? (
            <>
              <Link to="/browse"    className={active('/browse')}>Browse</Link>
              <Link to="/interests" className={active('/interests')}>Interests</Link>
              <Link to="/matches"   className={active('/matches')}>Matches</Link>
              <Link to="/profile"   className={active('/profile')}>My Profile</Link>
              {user.role === 'admin' && <Link to="/admin" className={active('/admin')}>Admin</Link>}
              <button className="nav-btn" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login"    className={active('/login')}>Login</Link>
              <Link to="/register" className="nav-btn">Register Free</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
