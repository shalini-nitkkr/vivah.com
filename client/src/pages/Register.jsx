import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useToast } from '../context/ToastContext'

export default function Register() {
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name:'', email:'', password:'', confirm:'', phone:'', gender:'male', dob:''
  })

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) return setError('Passwords do not match.')
    if (form.password.length < 6)       return setError('Password must be at least 6 characters.')
    setLoading(true)
    try {
      const res = await axios.post('/api/auth/register', {
        name: form.name, email: form.email, password: form.password,
        phone: form.phone, gender: form.gender, dob: form.dob,
      })
      showToast('OTP sent to your email. Please verify to continue.')
      navigate('/verify-otp', { state: { email: res.data.email || form.email } })
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page" style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ width:'100%', maxWidth:500 }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ fontSize:48, marginBottom:8 }}>💑</div>
          <h1 style={{ fontSize:28 }}>Create Your Account</h1>
          <p style={{ color:'var(--text-muted)', marginTop:8 }}>Join thousands of people finding their partner</p>
        </div>

        <div className="card">
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={submit}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input className="form-input" placeholder="Your full name"
                value={form.name} onChange={set('name')} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input type="email" className="form-input" placeholder="you@email.com"
                  value={form.email} onChange={set('email')} required />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input className="form-input" placeholder="10-digit number"
                  value={form.phone} onChange={set('phone')} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Gender *</label>
                <select className="form-input form-select" value={form.gender} onChange={set('gender')}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Date of Birth *</label>
                <input type="date" className="form-input"
                  value={form.dob} onChange={set('dob')} required
                  max={new Date(new Date().setFullYear(new Date().getFullYear()-18)).toISOString().split('T')[0]} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Password *</label>
                <input type="password" className="form-input" placeholder="Min 6 characters"
                  value={form.password} onChange={set('password')} required />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password *</label>
                <input type="password" className="form-input" placeholder="Repeat password"
                  value={form.confirm} onChange={set('confirm')} required />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-block" disabled={loading} style={{ marginTop:8 }}>
              {loading ? 'Creating Account...' : 'Create Free Account →'}
            </button>
          </form>
        </div>

        <p style={{ textAlign:'center', marginTop:20, fontSize:14, color:'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color:'var(--primary)', fontWeight:600 }}>Sign In</Link>
        </p>
      </div>
    </div>
  )
}
