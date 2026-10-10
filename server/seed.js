// // Run this once to create the admin account
// // Command: node seed.js

// require('dotenv').config()
// const mongoose = require('mongoose')
// const bcrypt   = require('bcryptjs')
// const User     = require('./src/models/User')

// async function seed() {
//   await mongoose.connect(process.env.MONGO_URI)
//   console.log('Connected to MongoDB')

//   const existing = await User.findOne({ email: 'admin@vivah.com' })
//   if (existing) {
//     console.log('Admin already exists! Email: admin@vivah.com / Password: admin123')
//     process.exit(0)
//   }

//   await User.create({
//     name:       'Admin User',
//     email:      'admin@vivah.com',
//     password:   'admin123',
//     phone:      '9999999999',
//     gender:     'male',
//     dob:        new Date('1990-01-01'),
//     role:       'admin',
//     trustLevel: 2,
//     vouchCount: 3,
//     city:       'Delhi',
//   })

//   console.log('✅ Admin created!')
//   console.log('   Email:    admin@vivah.com')
//   console.log('   Password: admin123')
//   process.exit(0)
// }

// seed().catch(err => { console.error(err); process.exit(1) })
