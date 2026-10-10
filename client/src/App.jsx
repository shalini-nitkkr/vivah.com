import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'

import Home        from './pages/Home'
import Login       from './pages/Login'
import Register    from './pages/Register'
import VerifyOtp   from './pages/VerifyOtp'
import Browse      from './pages/Browse'
import ProfileView from './pages/ProfileView'
import MyProfile   from './pages/MyProfile'
import Interests   from './pages/Interests'
import Matches     from './pages/Matches'
import Chat        from './pages/Chat'
import KundliMatch from './pages/KundliMatch'
import Admin       from './pages/Admin'
import Footer from "./components/Footer"
import NetworkPage from './pages/NetworkPage'

function Private({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="loading"><div className="spinner" /></div>
  return user ? children : <Navigate to="/login" replace />
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="loading"><div className="spinner" /></div>
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/"         element={<Home />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />

        <Route path="/browse"       element={<Private><Browse /></Private>} />
        <Route path="/profile"      element={<Private><MyProfile /></Private>} />
        <Route path="/profile/:id"  element={<Private><ProfileView /></Private>} />
        <Route path="/interests"    element={<Private><Interests /></Private>} />
        <Route path="/matches"      element={<Private><Matches /></Private>} />
        <Route path="/chat/:userId" element={<Private><Chat /></Private>} />
        <Route path="/kundli/:userId" element={<Private><KundliMatch /></Private>} />

        <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
        <Route path="/network/:id" element={<AdminRoute><NetworkPage /></AdminRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
       
      </Routes>
      <Footer />
    </>
  )
}
