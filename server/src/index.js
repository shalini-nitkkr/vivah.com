require('dotenv').config()
const express   = require('express')
const cors      = require('cors')
const path      = require('path')
const http      = require('http')
const { Server } = require('socket.io')
const jwt       = require('jsonwebtoken')
const connectDB = require('./config/db')
const driver = require('./config/Neo4j')

async function startServer() {
  try {
    // MongoDB connection
    await connectDB()
    console.log("MongoDB Connected")

    // Neo4j connection
    await driver.verifyConnectivity()
    console.log("Neo4j Connected")

    // Start server
    server.listen(PORT, () =>
      console.log(`\nServer running on http://localhost:${PORT}\n`)
    )

  } catch (err) {
    console.error("Startup Error:", err)
  }
}

const app    = express()
const server = http.createServer(app)
const io     = new Server(server, {
  cors: { origin: 'http://localhost:5173', credentials: true }
})

app.set('io', io)

// Helper: canonical match room ID
function makeMatchId(a, b) {
  return [a.toString(), b.toString()].sort().join('_')
}

// Socket.io auth
io.use((socket, next) => {
  const token = socket.handshake.auth?.token
  if (!token) return next(new Error('No token'))
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    socket.userId = decoded.id || decoded._id
    next()
  } catch {
    next(new Error('Invalid token'))
  }
})

io.on('connection', (socket) => {
  socket.on('joinChat', ({ withUserId }) => {
    if (!withUserId) return
    const roomId = makeMatchId(socket.userId, withUserId)
    socket.join(roomId)
  })
  socket.on('leaveChat', ({ withUserId }) => {
    if (!withUserId) return
    const roomId = makeMatchId(socket.userId, withUserId)
    socket.leave(roomId)
  })
})

app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

app.use('/api/auth',     require('./routes/auth'))
app.use('/api/profile',  require('./routes/profile'))
app.use('/api/interest', require('./routes/interest'))
app.use('/api/chat',     require('./routes/chat'))
app.use('/api/kundli',   require('./routes/kundli'))
app.use('/api/admin',    require('./routes/admin'))

app.get('/', (req, res) => res.json({ message: 'Vivah Matrimonial API running!' }))

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: err.message || 'Something went wrong.' })
})

const PORT = process.env.PORT || 5000
// server.listen(PORT, () => console.log(`\nServer running on http://localhost:${PORT}\n`))

startServer()