const express  = require('express')
const router   = express.Router()
const Message  = require('../models/Message')
const Interest = require('../models/Interest')
const { protect } = require('../middleware/auth')

// Helper: canonical matchId from two user IDs
function makeMatchId(a, b) {
  return [a.toString(), b.toString()].sort().join('_')
}

// Verify the two users have an accepted interest (mutual match)
async function isMatch(uid1, uid2) {
  const interest = await Interest.findOne({
    $or: [
      { sender: uid1, receiver: uid2 },
      { sender: uid2, receiver: uid1 },
    ],
    status: 'accepted',
  })
  return !!interest
}

// GET /api/chat/:userId — load chat history with a matched user
router.get('/:userId', protect, async (req, res) => {
  try {
    const matched = await isMatch(req.user._id, req.params.userId)
    if (!matched) return res.status(403).json({ message: 'You are not matched with this user.' })

    const matchId = makeMatchId(req.user._id, req.params.userId)
    const messages = await Message.find({ matchId })
      .sort({ createdAt: 1 })
      .limit(200)
      .populate('sender', 'name photo gender')

    // Mark unread messages as read
    await Message.updateMany(
      { matchId, sender: { $ne: req.user._id }, read: false },
      { read: true }
    )

    res.json({ messages })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/chat/:userId — send a message
router.post('/:userId', protect, async (req, res) => {
  try {
    const { text } = req.body
    if (!text?.trim()) return res.status(400).json({ message: 'Message text is required.' })

    const matched = await isMatch(req.user._id, req.params.userId)
    if (!matched) return res.status(403).json({ message: 'You are not matched with this user.' })

    const matchId = makeMatchId(req.user._id, req.params.userId)
    const msg = await Message.create({ matchId, sender: req.user._id, text: text.trim() })
    const populated = await msg.populate('sender', 'name photo gender')

    // Emit via Socket.io if available
    const io = req.app.get('io')
    if (io) {
      io.to(matchId).emit('newMessage', populated)
    }

    res.status(201).json({ message: populated })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
module.exports.makeMatchId = makeMatchId
