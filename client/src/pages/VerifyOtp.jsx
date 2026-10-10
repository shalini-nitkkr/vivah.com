import { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function VerifyOtp() {
  const { login } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  // email is passed via navigate('/verify-otp', { state: { email } })
  const [email] = useState(location.state?.email || '')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)

  const submit = async e => {
    e.preventDefault()
    setError('')
    if (!email) return setError('Missing email. Please register again.')
    setLoading(true)
    try {
      const res = await axios.post('/api/auth/verify-otp', { email, otp })
      login(res.data.user, res.data.token)
      showToast('Email verified! Welcome to Vivah 🎉')
      navigate('/profile')
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const resend = async () => {
    setError('')
    setResending(true)
    try {
      await axios.post('/api/auth/resend-otp', { email })
      showToast('A new OTP has been sent to your email.')
    } catch (err) {
      setError(err.response?.data?.message || 'Could not resend OTP.')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: 28 }}>Verify Your Email</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>
            We sent a 6-digit code to {email ? <strong>{email}</strong> : 'your email'}
          </p>
        </div>

        <div className="card">
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={submit}>
            <div className="form-group">
              <label className="form-label">Enter OTP</label>
              <input
                className="form-input"
                placeholder="6-digit code"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                required
                style={{ letterSpacing: 6, fontSize: 20, textAlign: 'center' }}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block" disabled={loading} style={{ marginTop: 8 }}>
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </button>
          </form>

          <button
            type="button"
            onClick={resend}
            disabled={resending}
            className="btn btn-block"
            style={{ marginTop: 12, background: 'transparent', color: 'var(--primary)' }}
          >
            {resending ? 'Resending...' : "Didn't get a code? Resend OTP"}
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text-muted)' }}>
          Wrong email? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Register again</Link>
        </p>
      </div>
    </div>
  )
}
