// ─────────────────────────────────────────────────────────────────────────────
// IMPORT SCRIPT — loads vivah_profiles.json into MongoDB + Neo4j
// Place this file in: vivah/server/
// Run: node import_data.js
// ─────────────────────────────────────────────────────────────────────────────
require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt   = require('bcryptjs')
const neo4j    = require('neo4j-driver')
const fs       = require('fs')
const path     = require('path')
const User     = require('./src/models/User')
const Interest = require('./src/models/Interest')

async function importData() {
  // ── 1. Load JSON file ────────────────────────────────────────────────────
  const filePath = path.join(__dirname, 'vivah_profiles.json')
  if (!fs.existsSync(filePath)) {
    console.error('❌ vivah_profiles.json not found. Place it in the server/ folder.')
    process.exit(1)
  }
  const profiles = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  console.log(`\n📂 Loaded ${profiles.length} profiles from vivah_profiles.json`)

  // ── 2. Connect MongoDB ───────────────────────────────────────────────────
  await mongoose.connect(process.env.MONGO_URI)
  console.log('✅ MongoDB connected')

  // NOTE: existing data is intentionally NOT cleared, so your manually
  // registered account stays untouched. Uncomment these two lines only
  // if you want a full wipe-and-reseed instead:
  // await User.deleteMany({})
  // await Interest.deleteMany({})

  // ── 3. Hash passwords in bulk (batch of 50 to avoid memory issues) ───────
  console.log('🔐 Hashing passwords...')
  const userHash    = await bcrypt.hash('password123', 10)
  const adminHash   = await bcrypt.hash('admin123', 10)

  // ── 4. Insert users into MongoDB ─────────────────────────────────────────
  console.log('📥 Inserting users into MongoDB...')
  const inserted = []

  const BATCH = 50
  for (let i = 0; i < profiles.length; i += BATCH) {
    const batch = profiles.slice(i, i + BATCH).map(p => ({
      name        : p.name,
      email       : p.email,
      password    : p.role === 'admin' ? adminHash : userHash,
      phone       : p.phone,
      gender      : p.gender?.toLowerCase(),
      dob         : new Date(p.dob),
      religion    : p.religion    || '',
      caste       : p.caste       || '',
      city        : p.city        || '',
      state       : p.state       || '',
      education   : p.education   || '',
      occupation  : p.occupation  || p.profession || '',
      income      : p.income      || '',
      about       : p.bio         || '',
      prefAgeMin  : p.prefAgeMin  || 22,
      prefAgeMax  : p.prefAgeMax  || 35,
      prefReligion: p.prefReligion|| '',
      prefCity    : p.prefCity    || '',
      myContacts  : p.myContacts  || [],
      active      : p.active !== false,
      role        : p.role        || 'user',
    }))

    const docs = await User.insertMany(batch, { ordered: false })
    inserted.push(...docs)

    if ((i + BATCH) % 200 === 0 || i + BATCH >= profiles.length) {
      process.stdout.write(`\r   Inserted ${Math.min(i + BATCH, profiles.length)}/${profiles.length}`)
    }
  }
  console.log(`\n✅ ${inserted.length} users inserted into MongoDB`)

  // ── 5. Build phone → mongoId map ─────────────────────────────────────────
  const phoneToId = {}
  inserted.forEach(u => {
    const p10 = u.phone?.replace(/\D/g,'').slice(-10)
    if (p10) phoneToId[p10] = u._id.toString()
  })

  // ── 6. Seed Neo4j ────────────────────────────────────────────────────────
  console.log('\n🔵 Seeding Neo4j...')
  let neo4jOk = false
  try {
    const driver = neo4j.driver(
      process.env.NEO4J_URI  || 'bolt://127.0.0.1:7687',
      neo4j.auth.basic(
        process.env.NEO4J_USER || 'neo4j',
        process.env.NEO4J_PASS || 'password'
      ),
      { encrypted: false, trust: 'TRUST_ALL_CERTIFICATES' }
    )
    await driver.verifyConnectivity()
    const session = driver.session()

    // Clear old graph
    await session.run('MATCH (n:User) DETACH DELETE n')
    console.log('🗑  Cleared Neo4j graph')

    // Create all User nodes in batches
    console.log('   Creating User nodes...')
    const nodesBatch = inserted.map(u => ({
      phone  : u.phone?.replace(/\D/g,'').slice(-10),
      name   : u.name,
      mongoId: u._id.toString()
    })).filter(n => n.phone)

    for (let i = 0; i < nodesBatch.length; i += 100) {
      const batch = nodesBatch.slice(i, i + 100)
      await session.run(`
        UNWIND $users AS u
        CREATE (:User {phone: u.phone, name: u.name, mongoId: u.mongoId})
      `, { users: batch })
    }
    console.log(`   ✅ ${nodesBatch.length} User nodes created`)

    // Create index for fast lookup
    await session.run('CREATE INDEX user_phone IF NOT EXISTS FOR (u:User) ON (u.phone)')

    // Create HAS_CONTACT relationships
    console.log('   Creating HAS_CONTACT relationships...')
    let edgeCount = 0
    for (const u of inserted) {
      const myPhone = u.phone?.replace(/\D/g,'').slice(-10)
      if (!myPhone || !u.myContacts?.length) continue

      const contactPhones = u.myContacts
        .map(p => p.replace(/\D/g,'').slice(-10))
        .filter(p => p.length === 10 && p !== myPhone && phoneToId[p])

      if (!contactPhones.length) continue

      await session.run(`
        MATCH (me:User {phone: $myPhone})
        UNWIND $contacts AS cp
        MATCH (c:User {phone: cp})
        CREATE (me)-[:HAS_CONTACT]->(c)
      `, { myPhone, contacts: contactPhones })

      edgeCount += contactPhones.length
    }
    console.log(`   ✅ ${edgeCount} HAS_CONTACT edges created`)

    await session.close()
    await driver.close()
    neo4jOk = true
  } catch (err) {
    console.log(`\n⚠️  Neo4j skipped — ${err.message}`)
    console.log('   Start Neo4j Desktop and re-run to seed the graph.')
  }

  // ── 7. Summary ───────────────────────────────────────────────────────────
  console.log('\n' + '═'.repeat(55))
  console.log('🎉  IMPORT COMPLETE!')
  console.log('═'.repeat(55))
  console.log(`\n   MongoDB users  : ${inserted.length}`)
  console.log(`   Neo4j graph    : ${neo4jOk ? '✅ seeded' : '⚠️  skipped'}`)
  console.log('\n📋 Login Accounts:')
  console.log('   Admin   →  admin@vivah.com   / admin123')
  console.log('   User 1  →  ' + profiles[0].email + '  / password123')
  console.log('   User 2  →  ' + profiles[1].email + '  / password123')
  console.log('\n🔍 Trust levels after search:')
  console.log('   🟢 Degree 1 = person is directly in your contacts')
  console.log('   🔵 Degree 2 = person is in your contact\'s contacts')
  console.log('   🟡 Unknown  = no graph connection found')
  console.log('═'.repeat(55) + '\n')

  process.exit(0)
}

importData().catch(err => { console.error('❌', err); process.exit(1) })// // ─────────────────────────────────────────────────────────────────────────────
// // IMPORT SCRIPT — loads vivah_profiles.json into MongoDB + Neo4j
// // Place this file in: vivah/server/
// // Run: node import_data.js
// // ─────────────────────────────────────────────────────────────────────────────
// require('dotenv').config()
// const mongoose = require('mongoose')
// const bcrypt   = require('bcryptjs')
// const neo4j    = require('neo4j-driver')
// const fs       = require('fs')
// const path     = require('path')
// const User     = require('./src/models/User')
// const Interest = require('./src/models/Interest')

// async function importData() {
//   // ── 1. Load JSON file ────────────────────────────────────────────────────
//   const filePath = path.join(__dirname, 'vivah_profiles.json')
//   if (!fs.existsSync(filePath)) {
//     console.error('❌ vivah_profiles.json not found. Place it in the server/ folder.')
//     process.exit(1)
//   }
//   const profiles = JSON.parse(fs.readFileSync(filePath, 'utf8'))
//   console.log(`\n📂 Loaded ${profiles.length} profiles from vivah_profiles.json`)

//   // ── 2. Connect MongoDB ───────────────────────────────────────────────────
//   await mongoose.connect(process.env.MONGO_URI)
//   console.log('✅ MongoDB connected')

//   // Clear old data
//   await User.deleteMany({})
//   await Interest.deleteMany({})
//   console.log('🗑  Cleared existing data')

//   // ── 3. Hash passwords in bulk (batch of 50 to avoid memory issues) ───────
//   console.log('🔐 Hashing passwords...')
//   const userHash    = await bcrypt.hash('password123', 10)
//   const adminHash   = await bcrypt.hash('admin123', 10)

//   // ── 4. Insert users into MongoDB ─────────────────────────────────────────
//   console.log('📥 Inserting users into MongoDB...')
//   const inserted = []

//   const BATCH = 50
//   for (let i = 0; i < profiles.length; i += BATCH) {
//     const batch = profiles.slice(i, i + BATCH).map(p => ({
//       name        : p.name,
//       email       : p.email,
//       password    : p.role === 'admin' ? adminHash : userHash,
//       phone       : p.phone,
//       gender      : p.gender?.toLowerCase(),
//       dob         : new Date(p.dob),
//       religion    : p.religion    || '',
//       caste       : p.caste       || '',
//       city        : p.city        || '',
//       state       : p.state       || '',
//       education   : p.education   || '',
//       occupation  : p.occupation  || p.profession || '',
//       income      : p.income      || '',
//       about       : p.bio         || '',
//       prefAgeMin  : p.prefAgeMin  || 22,
//       prefAgeMax  : p.prefAgeMax  || 35,
//       prefReligion: p.prefReligion|| '',
//       prefCity    : p.prefCity    || '',
//       myContacts  : p.myContacts  || [],
//       active      : p.active !== false,
//       role        : p.role        || 'user',
//     }))

//     const docs = await User.insertMany(batch, { ordered: false })
//     inserted.push(...docs)

//     if ((i + BATCH) % 200 === 0 || i + BATCH >= profiles.length) {
//       process.stdout.write(`\r   Inserted ${Math.min(i + BATCH, profiles.length)}/${profiles.length}`)
//     }
//   }
//   console.log(`\n✅ ${inserted.length} users inserted into MongoDB`)

//   // ── 5. Build phone → mongoId map ─────────────────────────────────────────
//   const phoneToId = {}
//   inserted.forEach(u => {
//     const p10 = u.phone?.replace(/\D/g,'').slice(-10)
//     if (p10) phoneToId[p10] = u._id.toString()
//   })

//   // ── 6. Seed Neo4j ────────────────────────────────────────────────────────
//   console.log('\n🔵 Seeding Neo4j...')
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

//     // Clear old graph
//     await session.run('MATCH (n:User) DETACH DELETE n')
//     console.log('🗑  Cleared Neo4j graph')

//     // Create all User nodes in batches
//     console.log('   Creating User nodes...')
//     const nodesBatch = inserted.map(u => ({
//       phone  : u.phone?.replace(/\D/g,'').slice(-10),
//       name   : u.name,
//       mongoId: u._id.toString()
//     })).filter(n => n.phone)

//     for (let i = 0; i < nodesBatch.length; i += 100) {
//       const batch = nodesBatch.slice(i, i + 100)
//       await session.run(`
//         UNWIND $users AS u
//         CREATE (:User {phone: u.phone, name: u.name, mongoId: u.mongoId})
//       `, { users: batch })
//     }
//     console.log(`   ✅ ${nodesBatch.length} User nodes created`)

//     // Create index for fast lookup
//     await session.run('CREATE INDEX user_phone IF NOT EXISTS FOR (u:User) ON (u.phone)')

//     // Create HAS_CONTACT relationships
//     console.log('   Creating HAS_CONTACT relationships...')
//     let edgeCount = 0
//     for (const u of inserted) {
//       const myPhone = u.phone?.replace(/\D/g,'').slice(-10)
//       if (!myPhone || !u.myContacts?.length) continue

//       const contactPhones = u.myContacts
//         .map(p => p.replace(/\D/g,'').slice(-10))
//         .filter(p => p.length === 10 && p !== myPhone && phoneToId[p])

//       if (!contactPhones.length) continue

//       await session.run(`
//         MATCH (me:User {phone: $myPhone})
//         UNWIND $contacts AS cp
//         MATCH (c:User {phone: cp})
//         CREATE (me)-[:HAS_CONTACT]->(c)
//       `, { myPhone, contacts: contactPhones })

//       edgeCount += contactPhones.length
//     }
//     console.log(`   ✅ ${edgeCount} HAS_CONTACT edges created`)

//     await session.close()
//     await driver.close()
//     neo4jOk = true
//   } catch (err) {
//     // console.log(`\n⚠️  Neo4j skipped — ${err.message}`)
//     console.log(`⚠️ Neo4j full error:`, err.code, err.message)
//     console.log('   Start Neo4j Desktop and re-run to seed the graph.')
//   }

//   // ── 7. Summary ───────────────────────────────────────────────────────────
//   console.log('\n' + '═'.repeat(55))
//   console.log('🎉  IMPORT COMPLETE!')
//   console.log('═'.repeat(55))
//   console.log(`\n   MongoDB users  : ${inserted.length}`)
//   console.log(`   Neo4j graph    : ${neo4jOk ? '✅ seeded' : '⚠️  skipped'}`)
//   console.log('\n📋 Login Accounts:')
//   console.log('   Admin   →  admin@vivah.com   / admin123')
//   console.log('   User 1  →  ' + profiles[0].email + '  / password123')
//   console.log('   User 2  →  ' + profiles[1].email + '  / password123')
//   console.log('\n🔍 Trust levels after search:')
//   console.log('   🟢 Degree 1 = person is directly in your contacts')
//   console.log('   🔵 Degree 2 = person is in your contact\'s contacts')
//   console.log('   🟡 Unknown  = no graph connection found')
//   console.log('═'.repeat(55) + '\n')

//   process.exit(0)
// }

// importData().catch(err => { console.error('❌', err); process.exit(1) })


// ─────────────────────────────────────────────────────────────────────────────
// IMPORT SCRIPT — loads vivah_profiles.json into MongoDB + Neo4j
// Place this file in: vivah/server/
// Run: node import_data.js
// ─────────────────────────────────────────────────────────────────────────────


// require('dotenv').config()
// const mongoose = require('mongoose')
// const bcrypt = require('bcryptjs')
// const neo4j = require('neo4j-driver')
// const fs = require('fs')
// const path = require('path')
// const User = require('./src/models/User')
// const Interest = require('./src/models/Interest')

// async function importData() {
//   // ── 1. Load JSON file ────────────────────────────────────────────────────
//   const filePath = path.join(__dirname, 'vivah_profiles.json')
//   if (!fs.existsSync(filePath)) {
//     console.error('❌ vivah_profiles.json not found. Place it in the server/ folder.')
//     process.exit(1)
//   }
//   const profiles = JSON.parse(fs.readFileSync(filePath, 'utf8'))
//   console.log(`\n📂 Loaded ${profiles.length} profiles from vivah_profiles.json`)

//   // ── 2. Connect MongoDB ───────────────────────────────────────────────────
//   await mongoose.connect(process.env.MONGO_URI)
//   console.log('✅ MongoDB connected')

//   // Clear old data
//   // await User.deleteMany({})
//   // await Interest.deleteMany({})
//   console.log('🗑  Cleared existing data')

//   // ── 3. Hash passwords in bulk (batch of 50 to avoid memory issues) ───────
//   console.log('🔐 Hashing passwords...')
//   const userHash = await bcrypt.hash('password123', 10)
//   const adminHash = await bcrypt.hash('admin123', 10)

//   // ── 4. Insert users into MongoDB ─────────────────────────────────────────
//   console.log('📥 Inserting users into MongoDB...')
//   const inserted = []

//   const BATCH = 50
//   for (let i = 0; i < profiles.length; i += BATCH) {
//     const batch = profiles.slice(i, i + BATCH).map(p => ({
//       name: p.name,
//       email: p.email,
//       password: p.role === 'admin' ? adminHash : userHash,
//       phone: p.phone,
//       gender: p.gender?.toLowerCase(),
//       dob: new Date(p.dob),
//       religion: p.religion || '',
//       caste: p.caste || '',
//       city: p.city || '',
//       state: p.state || '',
//       education: p.education || '',
//       occupation: p.occupation || p.profession || '',
//       income: p.income || '',
//       about: p.bio || '',
//       prefAgeMin: p.prefAgeMin || 22,
//       prefAgeMax: p.prefAgeMax || 35,
//       prefReligion: p.prefReligion || '',
//       prefCity: p.prefCity || '',
//       myContacts: p.myContacts || [],
//       active: p.active !== false,
//       role: p.role || 'user',
//     }))

//     const docs = await User.insertMany(batch, { ordered: false })
//     inserted.push(...docs)

//     if ((i + BATCH) % 200 === 0 || i + BATCH >= profiles.length) {
//       process.stdout.write(`\r   Inserted ${Math.min(i + BATCH, profiles.length)}/${profiles.length}`)
//     }
//   }
//   console.log(`\n✅ ${inserted.length} users inserted into MongoDB`)

//   // ── 5. Build phone → mongoId map ─────────────────────────────────────────
//   const phoneToId = {}
//   inserted.forEach(u => {
//     const p10 = u.phone?.replace(/\D/g, '').slice(-10)
//     if (p10) phoneToId[p10] = u._id.toString()
//   })

//   // ── 6. Seed Neo4j ────────────────────────────────────────────────────────
//   console.log('\n🔵 Seeding Neo4j...')
//   let neo4jOk = false
//   try {
//     const driver = neo4j.driver(
//       process.env.NEO4J_URI || 'bolt://127.0.0.1:7687',
//       neo4j.auth.basic(
//         process.env.NEO4J_USER || 'neo4j',
//         process.env.NEO4J_PASS || 'manisha@1234'
//       ),
//       { encrypted: false, trust: 'TRUST_ALL_CERTIFICATES' }
//     )
//     await driver.verifyConnectivity()
//     const session = driver.session()

//     // Clear old graph
//     await session.run('MATCH (n:User) DETACH DELETE n')
//     console.log('🗑  Cleared Neo4j graph')

//     // Create all User nodes in batches
//     console.log('   Creating User nodes...')
//     const nodesBatch = inserted.map(u => ({
//       phone: u.phone?.replace(/\D/g, '').slice(-10),
//       name: u.name,
//       mongoId: u._id.toString()
//     })).filter(n => n.phone)

//     for (let i = 0; i < nodesBatch.length; i += 100) {
//       const batch = nodesBatch.slice(i, i + 100)
//       await session.run(`
//         UNWIND $users AS u
//         CREATE (:User {phone: u.phone, name: u.name, mongoId: u.mongoId})
//       `, { users: batch })
//     }
//     console.log(`   ✅ ${nodesBatch.length} User nodes created`)

//     // Create index for fast lookup
//     await session.run('CREATE INDEX user_phone IF NOT EXISTS FOR (u:User) ON (u.phone)')

//     // Create HAS_CONTACT relationships
//     console.log('   Creating HAS_CONTACT relationships...')
//     let edgeCount = 0
//     for (const u of inserted) {
//       const myPhone = u.phone?.replace(/\D/g, '').slice(-10)
//       if (!myPhone || !u.myContacts?.length) continue

//       const contactPhones = u.myContacts
//         .map(p => p.replace(/\D/g, '').slice(-10))
//         .filter(p => p.length === 10 && p !== myPhone && phoneToId[p])

//       if (!contactPhones.length) continue

//       await session.run(`
//         MATCH (me:User {phone: $myPhone})
//         UNWIND $contacts AS cp
//         MATCH (c:User {phone: cp})
//         CREATE (me)-[:HAS_CONTACT]->(c)
//       `, { myPhone, contacts: contactPhones })

//       edgeCount += contactPhones.length
//     }
//     console.log(`   ✅ ${edgeCount} HAS_CONTACT edges created`)

//     await session.close()
//     await driver.close()
//     neo4jOk = true
//   } catch (err) {
//     console.log(`\n⚠️  Neo4j skipped — ${err.message}`)
//     console.log('   Start Neo4j Desktop and re-run to seed the graph.')
//   }

//   // ── 7. Summary ───────────────────────────────────────────────────────────
//   console.log('\n' + '═'.repeat(55))
//   console.log('🎉  IMPORT COMPLETE!')
//   console.log('═'.repeat(55))
//   console.log(`\n   MongoDB users  : ${inserted.length}`)
//   console.log(`   Neo4j graph    : ${neo4jOk ? '✅ seeded' : '⚠️  skipped'}`)
//   console.log('\n📋 Login Accounts:')
//   console.log('   Admin   →  admin@vivah.com   / admin123')
//   console.log('   User 1  →  ' + profiles[0].email + '  / password123')
//   console.log('   User 2  →  ' + profiles[1].email + '  / password123')
//   console.log('\n🔍 Trust levels after search:')
//   console.log('   🟢 Degree 1 = person is directly in your contacts')
//   console.log('   🔵 Degree 2 = person is in your contact\'s contacts')
//   console.log('   🟡 Unknown  = no graph connection found')
//   console.log('═'.repeat(55) + '\n')

//   process.exit(0)
// }

// importData().catch(err => { console.error('❌', err); process.exit(1) })