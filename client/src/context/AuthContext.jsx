import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [token,   setToken]   = useState(() => localStorage.getItem('token') || null)
  const [loading, setLoading] = useState(true)

  // Set axios default header whenever token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      localStorage.setItem('token', token)
    } else {
      delete axios.defaults.headers.common['Authorization']
      localStorage.removeItem('token')
    }
  }, [token])

  // Load user on page refresh if token exists
  useEffect(() => {
    const load = async () => {
      if (!token) { setLoading(false); return }
      try {
        const res = await axios.get('/api/auth/me')
        setUser(res.data.user)
      } catch {
        setToken(null)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const login = (userData, jwt) => {
    setToken(jwt)
    setUser(userData)
    axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`
  }

  const logout = () => {
    setToken(null)
    setUser(null)
  }

  const refreshUser = async () => {
    try {
      const res = await axios.get('/api/auth/me')
      setUser(res.data.user)
    } catch {}
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
