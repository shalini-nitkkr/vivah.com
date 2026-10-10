import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { io } from 'socket.io-client'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import Avatar from '../components/Avatar'

let socket = null

function formatTime(ts) {
  const d = new Date(ts)
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
}
function formatDate(ts) {
  const d = new Date(ts)
  const today = new Date()
  if (d.toDateString() === today.toDateString()) return 'Today'
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1)
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

export default function Chat() {
  const { userId: otherId } = useParams()
  const { user } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [otherUser, setOtherUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [connected, setConnected] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  // Load other user profile
  useEffect(() => {
    axios.get(`/api/profile/${otherId}`)
      .then(r => setOtherUser(r.data.user))
      .catch(() => showToast('Profile not found', 'error'))
  }, [otherId])

  // Load chat history
  useEffect(() => {
    axios.get(`/api/chat/${otherId}`)
      .then(r => {
        setMessages(r.data.messages)
        setLoading(false)
      })
      .catch(err => {
        if (err.response?.status === 403) {
          showToast('Chat is only available with your matches', 'error')
          navigate('/matches')
        } else {
          showToast('Could not load chat', 'error')
          setLoading(false)
        }
      })
  }, [otherId])

  // Socket.io setup
  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    socket = io('http://localhost:5000', { auth: { token } })

    socket.on('connect', () => {
      setConnected(true)
      socket.emit('joinChat', { withUserId: otherId })
    })
    socket.on('disconnect', () => setConnected(false))
    socket.on('newMessage', (msg) => {
      setMessages(prev => {
        // Avoid duplicates
        if (prev.some(m => m._id === msg._id)) return prev
        return [...prev, msg]
      })
    })

    return () => {
      socket?.emit('leaveChat', { withUserId: otherId })
      socket?.disconnect()
      socket = null
    }
  }, [otherId])

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = useCallback(async () => {
    if (!text.trim() || sending) return
    setSending(true)
    const optimistic = {
      _id: `opt_${Date.now()}`,
      sender: { _id: user._id, name: user.name, photo: user.photo, gender: user.gender },
      text: text.trim(),
      createdAt: new Date().toISOString(),
      _optimistic: true,
    }
    setMessages(prev => [...prev, optimistic])
    setText('')

    try {
      const r = await axios.post(`/api/chat/${otherId}`, { text: optimistic.text })
      setMessages(prev => prev.map(m => m._id === optimistic._id ? r.data.message : m))
    } catch {
      setMessages(prev => prev.filter(m => m._id !== optimistic._id))
      showToast('Could not send message', 'error')
      setText(optimistic.text)
    } finally {
      setSending(false)
      inputRef.current?.focus()
    }
  }, [text, sending, otherId, user])

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  if (loading) return <div className="loading"><div className="spinner" /></div>

  // Group messages by date
  const grouped = []
  let lastDate = null
  for (const msg of messages) {
    const d = formatDate(msg.createdAt)
    if (d !== lastDate) { grouped.push({ type: 'divider', label: d }); lastDate = d }
    grouped.push({ type: 'msg', msg })
  }

  return (
    <div className="page" style={{ padding: '62px 0 0', display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Header */}
      <div style={{
        background: '#fff', borderBottom: '1px solid var(--border)',
        padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 14,
        boxShadow: 'var(--shadow)',
      }}>
        <button className="btn btn-outline btn-sm" onClick={() => navigate('/matches')}>← Back</button>
        {otherUser && (
          <>
            <Avatar name={otherUser.name} photo={otherUser.photo} gender={otherUser.gender} size={42} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{otherUser.name}</div>
              <div style={{ fontSize: 12, color: connected ? '#059669' : 'var(--text-muted)' }}>
                {connected ? '● Online' : '○ Connecting...'}
              </div>
            </div>
          </>
        )}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => navigate(`/profile/${otherId}`)}
          >
            View Profile
          </button>
          <button
            className="btn btn-sm"
            style={{ background: 'var(--primary-light)', color: 'var(--primary)', border: '1px solid var(--primary)' }}
            onClick={() => navigate(`/kundli/${otherId}`)}
          >
            🔮 Kundli Match
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '20px',
        display: 'flex', flexDirection: 'column', gap: 2,
        background: 'var(--bg)',
      }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: 60, color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>💌</div>
            <p style={{ fontWeight: 600 }}>Start your conversation!</p>
            <p style={{ fontSize: 13, marginTop: 4 }}>Say hello to {otherUser?.name?.split(' ')[0]} 👋</p>
          </div>
        )}

        {grouped.map((item, i) => {
          if (item.type === 'divider') return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '12px 0' }}>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{item.label}</span>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>
          )

          const { msg } = item
          const isMe = msg.sender._id === user._id || msg.sender === user._id
          return (
            <div key={msg._id} style={{
              display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start',
              marginBottom: 6, gap: 8, alignItems: 'flex-end',
            }}>
              {!isMe && (
                <Avatar
                  name={msg.sender.name || otherUser?.name}
                  photo={msg.sender.photo || otherUser?.photo}
                  gender={msg.sender.gender || otherUser?.gender}
                  size={30}
                />
              )}
              <div style={{ maxWidth: '68%' }}>
                <div style={{
                  background: isMe ? 'var(--primary)' : '#fff',
                  color: isMe ? '#fff' : 'var(--text)',
                  padding: '10px 14px',
                  borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  fontSize: 14, lineHeight: 1.5,
                  boxShadow: '0 1px 4px rgba(0,0,0,.1)',
                  opacity: msg._optimistic ? 0.7 : 1,
                  wordBreak: 'break-word',
                }}>
                  {msg.text}
                </div>
                <div style={{
                  fontSize: 10, color: 'var(--text-muted)', marginTop: 3,
                  textAlign: isMe ? 'right' : 'left', paddingLeft: 4,
                }}>
                  {formatTime(msg.createdAt)} {msg._optimistic ? '⏳' : isMe ? '✓' : ''}
                </div>
              </div>
              {isMe && (
                <Avatar
                  name={user.name}
                  photo={user.photo}
                  gender={user.gender}
                  size={30}
                />
              )}
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div style={{
        background: '#fff', borderTop: '1px solid var(--border)',
        padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'flex-end',
      }}>
        <textarea
          ref={inputRef}
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Type a message... (Enter to send)"
          rows={1}
          style={{
            flex: 1, resize: 'none', border: '1.5px solid var(--border)',
            borderRadius: 24, padding: '10px 16px', fontSize: 14,
            fontFamily: 'Inter, sans-serif', lineHeight: 1.5,
            outline: 'none', maxHeight: 120, overflowY: 'auto',
            transition: 'border-color .2s',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--primary)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
        <button
          className="btn btn-primary"
          onClick={send}
          disabled={!text.trim() || sending}
          style={{ borderRadius: '50%', width: 44, height: 44, padding: 0, fontSize: 18, flexShrink: 0 }}
        >
          ➤
        </button>
      </div>
    </div>
  )
}
