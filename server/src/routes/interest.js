const express  = require('express')
const router   = express.Router()
const Interest = require('../models/Interest')
const { protect } = require('../middleware/auth')

// POST /api/interest/send
router.post('/send', protect, async (req, res) => {
  try {
    const { receiverId, message } = req.body
    if (!receiverId) return res.status(400).json({ message: 'receiverId is required.' })
    if (receiverId === req.user._id.toString())
      return res.status(400).json({ message: 'Cannot send interest to yourself.' })

    const existing = await Interest.findOne({
      $or: [
        { sender: req.user._id, receiver: receiverId },
        { sender: receiverId,   receiver: req.user._id },
      ]
    })
    if (existing) return res.status(409).json({ message: 'Interest already sent.' })

    const interest = await Interest.create({ sender: req.user._id, receiver: receiverId, message })
    res.status(201).json({ message: 'Interest sent!', interest })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PUT /api/interest/:id/respond   body: { action: 'accept' | 'reject' }
router.put('/:id/respond', protect, async (req, res) => {
  try {
    const interest = await Interest.findById(req.params.id)
    if (!interest) return res.status(404).json({ message: 'Interest not found.' })
    if (!interest.receiver.equals(req.user._id))
      return res.status(403).json({ message: 'Not your interest to respond to.' })

    const { action } = req.body
    interest.status = action === 'accept' ? 'accepted' : 'rejected'
    await interest.save()

    res.json({ message: `Interest ${interest.status}!`, interest })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/interest/received
router.get('/received', protect, async (req, res) => {
  try {
    const interests = await Interest.find({ receiver: req.user._id })
      .populate('sender', 'name photo city gender dob trustLevel')
      .sort({ createdAt: -1 })
    res.json({ interests })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/interest/sent
router.get('/sent', protect, async (req, res) => {
  try {
    const interests = await Interest.find({ sender: req.user._id })
      .populate('receiver', 'name photo city gender dob trustLevel')
      .sort({ createdAt: -1 })
    res.json({ interests })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/interest/matches — both accepted
router.get('/matches', protect, async (req, res) => {
  try {
    const matches = await Interest.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }],
      status: 'accepted'
    })
      .populate('sender',   'name photo city gender dob trustLevel vouchCount phone email')
      .populate('receiver', 'name photo city gender dob trustLevel vouchCount phone email')
      .sort({ updatedAt: -1 })
    res.json({ matches })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
