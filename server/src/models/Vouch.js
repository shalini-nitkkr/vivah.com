// const mongoose = require('mongoose')

// const vouchSchema = new mongoose.Schema({
//   requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   voucher:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   status:    { type: String, enum: ['pending','accepted','rejected'], default: 'pending' },
//   message:   { type: String, default: '' },
// }, { timestamps: true })

// vouchSchema.index({ requester: 1, voucher: 1 }, { unique: true })

// module.exports = mongoose.model('Vouch', vouchSchema)
