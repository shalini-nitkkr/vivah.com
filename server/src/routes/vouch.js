// const express = require('express')
// const router  = express.Router()
// const Vouch   = require('../models/Vouch')
// const User    = require('../models/User')
// const { protect } = require('../middleware/auth')

// const VOUCH_THRESHOLD = 3

// // POST /api/vouch/request
// router.post('/request', protect, async (req, res) => {
//   try {
//     const { voucherEmail, message } = req.body
//     if (!voucherEmail) return res.status(400).json({ message: 'Friend email is required.' })

//     const voucher = await User.findOne({ email: voucherEmail, active: true })
//     if (!voucher) return res.status(404).json({ message: 'No user found with that email.' })
//     if (voucher._id.equals(req.user._id))
//       return res.status(400).json({ message: 'Cannot vouch for yourself.' })
//     if (voucher.trustLevel < 2)
//       return res.status(400).json({ message: 'Your friend must be Level 2 (Trusted) to vouch for you.' })

//     const existing = await Vouch.findOne({ requester: req.user._id, voucher: voucher._id, status: { $in: ['pending','accepted'] } })
//     if (existing) return res.status(409).json({ message: 'Vouch request already sent to this friend.' })

//     const vouch = await Vouch.create({ requester: req.user._id, voucher: voucher._id, message })
//     res.status(201).json({ message: 'Vouch request sent!', vouch })
//   } catch (err) {
//     res.status(500).json({ message: err.message })
//   }
// })

// // GET /api/vouch/pending — requests waiting for my response
// router.get('/pending', protect, async (req, res) => {
//   try {
//     const vouches = await Vouch.find({ voucher: req.user._id, status: 'pending' })
//       .populate('requester', 'name photo city gender')
//       .sort({ createdAt: -1 })
//     res.json({ vouches })
//   } catch (err) {
//     res.status(500).json({ message: err.message })
//   }
// })

// // PUT /api/vouch/:id/respond   body: { action: 'accept' | 'reject' }
// router.put('/:id/respond', protect, async (req, res) => {
//   try {
//     const vouch = await Vouch.findById(req.params.id)
//     if (!vouch) return res.status(404).json({ message: 'Vouch not found.' })
//     if (!vouch.voucher.equals(req.user._id))
//       return res.status(403).json({ message: 'Not your vouch to respond to.' })

//     const { action } = req.body
//     vouch.status = action === 'accept' ? 'accepted' : 'rejected'
//     await vouch.save()

//     // If accepted, recompute trust level for the requester
//     if (action === 'accept') {
//       const activeVouches = await Vouch.countDocuments({ requester: vouch.requester, status: 'accepted' })
//       const newLevel = activeVouches >= VOUCH_THRESHOLD ? 2 : 1
//       await User.findByIdAndUpdate(vouch.requester, { trustLevel: newLevel, vouchCount: activeVouches })
//     }

//     res.json({ message: `Vouch ${vouch.status}!` })
//   } catch (err) {
//     res.status(500).json({ message: err.message })
//   }
// })

// // GET /api/vouch/mystatus
// router.get('/mystatus', protect, async (req, res) => {
//   try {
//     const myVouches = await Vouch.find({ requester: req.user._id })
//       .populate('voucher', 'name photo')
//       .sort({ createdAt: -1 })
//     res.json({ vouches: myVouches, vouchCount: req.user.vouchCount, trustLevel: req.user.trustLevel, needed: VOUCH_THRESHOLD })
//   } catch (err) {
//     res.status(500).json({ message: err.message })
//   }
// })

// // GET /api/vouch/given — vouches I gave
// router.get('/given', protect, async (req, res) => {
//   try {
//     const vouches = await Vouch.find({ voucher: req.user._id })
//       .populate('requester', 'name photo city')
//       .sort({ createdAt: -1 })
//     res.json({ vouches })
//   } catch (err) {
//     res.status(500).json({ message: err.message })
//   }
// })

// module.exports = router
