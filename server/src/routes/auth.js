const express = require('express')
const router  = express.Router()
const jwt     = require('jsonwebtoken')
const crypto  = require('crypto')
const User    = require('../models/User')
const { protect } = require('../middleware/auth')
const { sendOtpEmail } = require('../config/mailer')

const makeToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })

const OTP_EXPIRY_MS = (Number(process.env.OTP_EXPIRY_MINUTES) || 10) * 60 * 1000

const generateOtp = () => crypto.randomInt(100000, 999999).toString() // 6-digit code

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, gender, dob } = req.body

    if (!name || !email || !password || !phone || !gender || !dob)
      return res.status(400).json({ message: 'Please fill all required fields.' })

    const exists = await User.findOne({ email })
    if (exists) return res.status(409).json({ message: 'Email already registered.' })

    const otp = generateOtp()

    const user = await User.create({
      name, email, password, phone, gender, dob,
      isVerified: false,
      otp,
      otpExpiry: Date.now() + OTP_EXPIRY_MS,
    })

    try {
      await sendOtpEmail(user.email, user.name, otp)
    } catch (mailErr) {
      // Roll back the created user if the email couldn't be sent, so they can retry cleanly.
      await User.findByIdAndDelete(user._id)
      console.error('Failed to send OTP email:', mailErr.message)
      return res.status(500).json({ message: 'Could not send verification email. Please try again.' })
    }

    // No token yet — user must verify OTP before they can log in.
    res.status(201).json({
      message: 'Registration successful. Please check your email for the OTP to verify your account.',
      email: user.email,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body
    if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required.' })

    const user = await User.findOne({ email }).select('+otp +otpExpiry')
    if (!user) return res.status(404).json({ message: 'User not found.' })

    if (user.isVerified)
      return res.status(400).json({ message: 'Account is already verified. Please log in.' })

    if (!user.otp || !user.otpExpiry || user.otpExpiry < Date.now())
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' })

    if (user.otp !== otp)
      return res.status(400).json({ message: 'Invalid OTP. Please try again.' })

    user.isVerified = true
    user.otp = null
    user.otpExpiry = null
    await user.save()

    res.json({
      message: 'Email verified successfully!',
      token: makeToken(user._id),
      user: { _id: user._id, name: user.name, email: user.email, gender: user.gender,
              photo: user.photo, trustLevel: user.trustLevel, role: user.role }
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/auth/resend-otp
router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ message: 'Email is required.' })

    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ message: 'User not found.' })

    if (user.isVerified)
      return res.status(400).json({ message: 'Account is already verified. Please log in.' })

    const otp = generateOtp()
    user.otp = otp
    user.otpExpiry = Date.now() + OTP_EXPIRY_MS
    await user.save()

    await sendOtpEmail(user.email, user.name, otp)

    res.json({ message: 'A new OTP has been sent to your email.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required.' })

    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ message: 'Invalid email or password.' })

    const match = await user.matchPassword(password)
    if (!match) return res.status(401).json({ message: 'Invalid email or password.' })

    if (!user.active) return res.status(403).json({ message: 'Your account has been suspended.' })

    if (!user.isVerified)
      return res.status(403).json({ message: 'Please verify your email before logging in.', needsVerification: true, email: user.email })

    res.json({
      token: makeToken(user._id),
      user: { _id: user._id, name: user.name, email: user.email, gender: user.gender,
              photo: user.photo, trustLevel: user.trustLevel, role: user.role }
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  res.json({ user: req.user })
})

module.exports = router
