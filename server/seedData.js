// // ─────────────────────────────────────────────────────────────────────────────
// // SEED SCRIPT — generates realistic Indian matrimonial profiles + contact graph
// // Run: node seedData.js
// // ─────────────────────────────────────────────────────────────────────────────
// require('dotenv').config()
// const mongoose  = require('mongoose')
// const bcrypt    = require('bcryptjs')
// const neo4j     = require('neo4j-driver')
// const User      = require('./src/models/User')
// const Interest  = require('./src/models/Interest')

// // ── Sample Indian data ────────────────────────────────────────────────────────

// const maleNames   = ['Rahul Sharma','Arjun Patel','Vikram Singh','Rohit Verma','Amit Kumar',
//                      'Suresh Mehta','Rajan Gupta','Deepak Joshi','Nikhil Rao','Sandeep Mishra']

// const femaleNames = ['Priya Sharma','Shalini Patel','Riyanshi Singh','Pooja Verma','Anjali Kumar',
//                      'Sneha Mehta','Kavya Gupta','Neha Joshi','Divya Rao','Simran Mishra']

// const cities      = ['Mumbai','Delhi','Pune','Bangalore','Hyderabad','Chennai','Kolkata','Jaipur','Ahmedabad','Lucknow']
// const states      = ['Maharashtra','Delhi','Maharashtra','Karnataka','Telangana','Tamil Nadu','West Bengal','Rajasthan','Gujarat','Uttar Pradesh']
// const religions   = ['Hindu','Hindu','Hindu','Muslim','Christian','Sikh','Hindu','Hindu','Jain','Hindu']
// const castes      = ['Brahmin','Patel','Rajput','General','General','Khatri','Gupta','Joshi','Jain','Mishra']
// const educations  = ['B.Tech','MBA','MCA','BCA','B.Sc','M.Tech','MBBS','B.Com','MA','PhD']
// const occupations = ['Software Engineer','Doctor','Teacher','Business','CA','Government Job','Lawyer','Designer','Banker','Professor']
// const incomes     = ['2–5 LPA','5–10 LPA','10–20 LPA','Above 20 LPA','5–10 LPA','10–20 LPA','2–5 LPA','5–10 LPA','10–20 LPA','Above 20 LPA']

// const abouts = [
//   'Simple and family-oriented person. Love travelling and cooking.',
//   'Looking for a life partner who is caring and understanding.',
//   'Working professional. Hobbies include reading and music.',
//   'Believe in simple living and high thinking. Family values matter.',
//   'Fun-loving person. Looking for someone who enjoys life together.',
// ]

// // Generate a random date of birth (age 22–35)
// function randomDOB(minAge = 22, maxAge = 35) {
//   const now   = new Date()
//   const year  = now.getFullYear() - Math.floor(Math.random() * (maxAge - minAge + 1)) - minAge
//   const month = Math.floor(Math.random() * 12)
//   const day   = Math.floor(Math.random() * 28) + 1
//   return new Date(year, month, day)
// }

// // Generate fake 10-digit phone number
// function fakePhone(index) {
//   return `98${String(index + 10).padStart(2,'0')}${String(Math.floor(Math.random()*1000000)).padStart(6,'0')}`
// }

// // ── Build 20 users ────────────────────────────────────────────────────────────
// function buildUsers() {
//   const users = []

//   // 10 males
//   maleNames.forEach((name, i) => {
//     users.push({
//       name,
//       email:      `${name.split(' ')[0].toLowerCase()}${i+1}@vivah.com`,
//       password:   'password123',
//       phone:      fakePhone(i),
//       gender:     'male',
//       dob:        randomDOB(24, 34),
//       city:       cities[i],
//       state:      states[i],
//       religion:   religions[i],
//       caste:      castes[i],
//       education:  educations[i],
//       occupation: occupations[i],
//       income:     incomes[i],
//       about:      abouts[i % abouts.length],
//       prefAgeMin: 20,
//       prefAgeMax: 32,
//       prefReligion: religions[i],
//       prefCity:   cities[i],
//       myContacts: [],
//     })
//   })

//   // 10 females
//   femaleNames.forEach((name, i) => {
//     users.push({
//       name,
//       email:      `${name.split(' ')[0].toLowerCase()}${i+11}@vivah.com`,
//       password:   'password123',
//       phone:      fakePhone(i + 10),
//       gender:     'female',
//       dob:        randomDOB(21, 30),
//       city:       cities[i],
//       state:      states[i],
//       religion:   religions[i],
//       caste:      castes[i],
//       education:  educations[i],
//       occupation: occupations[i],
//       income:     incomes[i],
//       about:      abouts[i % abouts.length],
//       prefAgeMin: 24,
//       prefAgeMax: 36,
//       prefReligion: religions[i],
//       prefCity:   cities[i],
//       myContacts: [],
//     })
//   })

//   // Admin user
//   users.push({
//     name:       'Admin User',
//     email:      'admin@vivah.com',
//     password:   'admin123',
//     phone:      '9000000000',
//     gender:     'male',
//     dob:        new Date('1990-01-01'),
//     city:       'Delhi',
//     state:      'Delhi',
//     religion:   'Hindu',
//     education:  'MBA',
//     occupation: 'Administrator',
//     income:     'Above 20 LPA',
//     about:      'Platform administrator.',
//     role:       'admin',
//     myContacts: [],
//   })

//   return users
// }

// // ── Contact graph design ──────────────────────────────────────────────────────
// //
// //  We create 3 friend chains to demonstrate all 3 trust levels:
// //
// //  Chain 1:  Rahul(0) → Shalini(10) → Riyanshi(12) → Pooja(13)
// //  Chain 2:  Arjun(1) → Priya(10)   → Anjali(14)
// //  Chain 3:  Vikram(2) → Kavya(16)  → Neha(17)
// //
// //  So when Rahul searches:
// //    Shalini  = Degree 1 (direct)
// //    Riyanshi = Degree 2 (friend of Shalini)
// //    Pooja    = Degree 3 (friend of Riyanshi — 3 hops, shown as Unknown)
// //    Everyone else = Unknown
// //

// function buildContactGraph(savedUsers) {
//   // savedUsers is array indexed 0-20
//   // males: index 0-9, females: index 10-19, admin: index 20
//   const edges = []

//   // Chain 1 — Rahul (male[0]) knows female network
//   edges.push({ from: 0,  to: 10 })  // Rahul → Shalini (Degree 1 for Rahul)
//   edges.push({ from: 10, to: 12 })  // Shalini → Riyanshi (Degree 2 for Rahul)
//   edges.push({ from: 12, to: 13 })  // Riyanshi → Pooja (Degree 3 for Rahul = unknown)

//   // Chain 2 — Arjun knows Priya directly
//   edges.push({ from: 1,  to: 10 })  // Arjun → Priya (Degree 1 for Arjun)
//   edges.push({ from: 10, to: 14 })  // Priya → Anjali (Degree 2 for Arjun)

//   // Chain 3 — Vikram's network
//   edges.push({ from: 2,  to: 16 })  // Vikram → Kavya
//   edges.push({ from: 16, to: 17 })  // Kavya → Neha

//   // Chain 4 — Rohit knows Sneha and Divya
//   edges.push({ from: 3,  to: 15 })  // Rohit → Sneha (Degree 1)
//   edges.push({ from: 15, to: 18 })  // Sneha → Divya (Degree 2 for Rohit)

//   // Save contacts back into user objects
//   edges.forEach(({ from, to }) => {
//     if (savedUsers[from] && savedUsers[to]) {
//       if (!savedUsers[from].myContacts) savedUsers[from].myContacts = []
//       savedUsers[from].myContacts.push(savedUsers[to].phone)
//     }
//   })

//   return edges
// }

// // ── Main seed function ────────────────────────────────────────────────────────
// async function seed() {
//   // 1. Connect MongoDB
//   await mongoose.connect(process.env.MONGO_URI)
//   console.log('\n✅ MongoDB connected')

//   // 2. Clear existing data
//   await User.deleteMany({})
//   await Interest.deleteMany({})
//   console.log('🗑  Cleared existing users and interests')

//   // 3. Create users
//   const rawUsers = buildUsers()
//   const hash = await bcrypt.hash('password123', 10)
//   const adminHash = await bcrypt.hash('admin123', 10)

//   const savedUsers = []
//   for (const u of rawUsers) {
//     const created = await User.create({
//       ...u,
//       password: u.email === 'admin@vivah.com' ? adminHash : hash,
//     })
//     savedUsers.push(created)
//   }
//   console.log(`✅ Created ${savedUsers.length} users in MongoDB`)

//   // 4. Build contact graph edges
//   const edges = buildContactGraph(savedUsers)

//   // Update myContacts in MongoDB for each user
//   for (const u of savedUsers) {
//     if (u.myContacts?.length > 0) {
//       await User.findByIdAndUpdate(u._id, { myContacts: u.myContacts })
//     }
//   }
//   console.log(`✅ Saved contact lists to MongoDB`)

//   // 5. Create some sample interests
//   // Rahul sends interest to Shalini and Riyanshi
//   const rahul    = savedUsers[0]
//   const shalini  = savedUsers[10]
//   const riyanshi = savedUsers[12]
//   const priya    = savedUsers[11]  // female index 11 = Priya Sharma

//   await Interest.create([
//     { sender: rahul._id,   receiver: shalini._id,  status: 'accepted' },
//     { sender: rahul._id,   receiver: riyanshi._id, status: 'pending'  },
//     { sender: savedUsers[1]._id, receiver: priya._id, status: 'pending' },
//   ])
//   console.log(`✅ Created sample interests`)

//   // 6. Now seed Neo4j
//   console.log('\n🔵 Seeding Neo4j graph...')

//   let neo4jOk = false
//   try {
//     const driver = neo4j.driver(
//       process.env.NEO4J_URI  || 'bolt://localhost:7687',
//       neo4j.auth.basic(
//         process.env.NEO4J_USER || 'neo4j',
//         process.env.NEO4J_PASS || 'password'
//       )
//     )

//     await driver.verifyConnectivity()
//     const session = driver.session()

//     // Clear old graph data
//     await session.run('MATCH (n:User) DETACH DELETE n')
//     console.log('🗑  Cleared Neo4j graph')

//     // Create all user nodes
//     for (const u of savedUsers) {
//       await session.run(
//         `CREATE (:User {phone: $phone, name: $name, mongoId: $mongoId})`,
//         { phone: u.phone, name: u.name, mongoId: u._id.toString() }
//       )
//     }
//     console.log(`✅ Created ${savedUsers.length} User nodes in Neo4j`)

//     // Create HAS_CONTACT relationships
//     for (const { from, to } of edges) {
//       const fromPhone = savedUsers[from].phone
//       const toPhone   = savedUsers[to].phone
//       await session.run(`
//         MATCH (a:User {phone: $fromPhone}), (b:User {phone: $toPhone})
//         CREATE (a)-[:HAS_CONTACT]->(b)
//       `, { fromPhone, toPhone })
//     }
//     console.log(`✅ Created ${edges.length} HAS_CONTACT relationships in Neo4j`)

//     await session.close()
//     await driver.close()
//     neo4jOk = true
//   } catch (err) {
//     console.log(`⚠️  Neo4j skipped — ${err.message}`)
//     console.log('   (Start Neo4j Desktop first, then re-run this script)')
//   }

//   // 7. Print summary
//   console.log('\n' + '─'.repeat(55))
//   console.log('🎉  SEED COMPLETE!')
//   console.log('─'.repeat(55))
//   console.log('\n📋 Sample Login Accounts:')
//   console.log('   Admin  →  admin@vivah.com       / admin123')
//   console.log('   Male   →  rahul1@vivah.com       / password123')
//   console.log('   Female →  shalini11@vivah.com    / password123')
//   console.log('\n📱 Contact Graph (for Rahul):')
//   console.log('   Degree 1 (Direct)  →  Shalini Patel    🟢')
//   console.log('   Degree 2 (Friend)  →  Riyanshi Singh   🔵')
//   console.log('   Degree 3 (Unknown) →  Everyone else    🟡')
//   if (!neo4jOk) {
//     console.log('\n⚠️  Neo4j was not seeded. Start Neo4j Desktop and re-run.')
//   }
//   console.log('─'.repeat(55) + '\n')

//   process.exit(0)
// }

// seed().catch(err => { console.error(err); process.exit(1) })
