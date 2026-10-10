// // ─────────────────────────────────────────────────────────────────────────────
// // NEO4J ONLY SEED — reads existing users from MongoDB and seeds Neo4j graph
// // Place in: server/
// // Run: node seed_neo4j_only.js
// // ────────────────────────────────────────────────────────────────────────────
// require('dotenv').config()
// const mongoose = require('mongoose')
// const neo4j = require('neo4j-driver')
// const User = require('./src/models/User')

// async function seedNeo4j() {
//     // 1. Connect MongoDB — read existing users
//     console.log('\nConnecting to MongoDB...')
//     await mongoose.connect(process.env.MONGO_URI)
//     console.log('MongoDB connected')

//     const users = await User.find({ active: true }).select('name phone myContacts').lean()
//     console.log(`Found ${users.length} users in MongoDB`)

//     if (users.length === 0) {
//         console.log('No users found. Run import_data.js first.')
//         process.exit(1)
//     }

//     // 2. Connect Neo4j
//     console.log('\nConnecting to Neo4j...')
//     const driver = neo4j.driver(
//         process.env.NEO4J_URI || 'neo4j://127.0.0.1:7687',
//         neo4j.auth.basic(
//             process.env.NEO4J_USER,
//             process.env.NEO4J_PASS 
//         ),
//         { encrypted: false, trust: 'TRUST_ALL_CERTIFICATES' }
//     )

//     await driver.verifyConnectivity()
//     console.log('Neo4j connected')

//     const session = driver.session()

//     // 3. Clear old graph
//     await session.run('MATCH (n:User) DETACH DELETE n')
//     console.log(' Cleared old Neo4j graph')

//     // 4. Create index
//     await session.run('CREATE INDEX user_phone IF NOT EXISTS FOR (u:User) ON (u.phone)')

//     // 5. Create User nodes in batches of 100
//     console.log('Creating User nodes...')
//     const nodes = users
//         .map(u => ({
//             phone: u.phone?.replace(/\D/g, '').slice(-10),
//             name: u.name,
//             mongoId: u._id.toString()
//         }))
//         .filter(n => n.phone?.length === 10)

//     for (let i = 0; i < nodes.length; i += 100) {
//         await session.run(
//             `UNWIND $batch AS u CREATE (:User {phone: u.phone, name: u.name, mongoId: u.mongoId})`,
//             { batch: nodes.slice(i, i + 100) }
//         )
//         process.stdout.write(`\r   Nodes: ${Math.min(i + 100, nodes.length)}/${nodes.length}`)
//     }
//     console.log(`\n${nodes.length} User nodes created`)

//     // 6. Build phone set for validation
//     const phoneSet = new Set(nodes.map(n => n.phone))

//     // 7. Create HAS_CONTACT relationships
//     console.log('Creating HAS_CONTACT relationships...')
//     let edgeCount = 0
//     let skipped = 0

//     for (const user of users) {
//         const myPhone = user.phone?.replace(/\D/g, '').slice(-10)
//         if (!myPhone || !phoneSet.has(myPhone)) { skipped++; continue }

//         const contacts = (user.myContacts || [])
//             .map(p => p.replace(/\D/g, '').slice(-10))
//             .filter(p => p.length === 10 && p !== myPhone && phoneSet.has(p))

//         if (!contacts.length) continue

//         await session.run(`
//       MATCH (me:User {phone: $myPhone})
//       UNWIND $contacts AS cp
//       MATCH (c:User {phone: cp})
//       CREATE (me)-[:HAS_CONTACT]->(c)
//     `, { myPhone, contacts })

//         edgeCount += contacts.length
//     }

//     console.log(`${edgeCount} HAS_CONTACT edges created`)

//     await session.close()
//     await driver.close()

//     await mongoose.disconnect()

//     // 8. Summary
//     console.log('\n' + '═'.repeat(50))
//     console.log('Neo4j seeded successfully!')
//     console.log('═'.repeat(50))
//     console.log(`   User nodes : ${nodes.length}`)
//     console.log(`   Edges      : ${edgeCount}`)
//     console.log('\n   Now browse profiles — you will see:')
//     console.log('   Direct Contacts')
//     console.log('   Friend\'s Contacts')
//     console.log('   Unknown')
//     console.log('═'.repeat(50) + '\n')

//     process.exit(0)
// }

// seedNeo4j().catch(err => {
//     console.error('\nError:', err.message)
//     process.exit(1)
// })