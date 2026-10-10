const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  phone: { type: String, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  dob: { type: Date, required: true },
  religion: { type: String, default: '' },
  caste: { type: String, default: '' },
  city: { type: String, default: '' },
  state: { type: String, default: '' },
  education: { type: String, default: '' },
  occupation: { type: String, default: '' },
  income: { type: String, default: '' },
  about: { type: String, default: '' },
  photo: { type: String, default: '' },
  // partner preferences
  prefAgeMin: { type: Number, default: 18 },
  prefAgeMax: { type: Number, default: 50 },
  prefReligion: { type: String, default: '' },
  prefCity: { type: String, default: '' },
  prefIncomeMin: { type: String, default: '' },
  prefEducation: { type: String, default: '' },
  // friend vouch trust system
  // trustLevel: { type: Number, default: 1 },  // 1=basic, 2=trusted
  // vouchCount: { type: Number, default: 0 },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  active: { type: Boolean, default: true },

  // Email OTP verification
  isVerified: { type: Boolean, default: false },
  otp: { type: String, default: null, select: false },
  otpExpiry: { type: Date, default: null, select: false },

  myContacts: { type: [String], default: [] },
}, { timestamps: true })

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

// Compare password
userSchema.methods.matchPassword = function (entered) {
  return bcrypt.compare(entered, this.password)
}

module.exports = mongoose.model('User', userSchema)
