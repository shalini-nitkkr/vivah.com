// // const express = require('express')
// // const router = express.Router()
// // const User = require('../models/User')
// // const Interest = require('../models/Interest')
// // const { protect, adminOnly } = require('../middleware/auth')
// // const driver = require('../config/neo4j')

// // // GET /api/admin/stats
// // router.get('/stats', protect, adminOnly, async (req, res) => {
// //   try {
// //     const [totalUsers, totalInterests, matches, trusted] = await Promise.all([
// //       User.countDocuments(),
// //       Interest.countDocuments(),
// //       Interest.countDocuments({ status: 'accepted' }),
// //       User.countDocuments({ trustLevel: 2 }),
// //     ])
// //     res.json({ totalUsers, totalInterests, matches, trusted })
// //   } catch (err) {
// //     res.status(500).json({ message: err.message })
// //   }
// // })

// // // GET /api/admin/users
// // router.get('/users', protect, adminOnly, async (req, res) => {
// //   try {
// //     const users = await User.find().select('-password').sort({ createdAt: -1 })
// //     res.json({ users })
// //   } catch (err) {
// //     res.status(500).json({ message: err.message })
// //   }
// // })

// // // PUT /api/admin/users/:id/toggle — activate/deactivate
// // router.put('/users/:id/toggle', protect, adminOnly, async (req, res) => {
// //   try {
// //     const user = await User.findById(req.params.id)
// //     if (!user) return res.status(404).json({ message: 'User not found.' })
// //     user.active = !user.active
// //     await user.save()
// //     res.json({ message: `User ${user.active ? 'activated' : 'deactivated'}.`, active: user.active })
// //   } catch (err) {
// //     res.status(500).json({ message: err.message })
// //   }
// // })

// // // GET /api/admin/network/:userId
// // router.get('/network/:userId', protect, adminOnly, async (req, res) => {

// //   const session = driver.session()

// //   try {

// //     const mongoUser = await User.findById(req.params.userId)

// //     if (!mongoUser) {
// //       return res.status(404).json({
// //         message: 'User not found'
// //       })
// //     }

// //     const phone = mongoUser.phone
// //       ?.replace(/\D/g, '')
// //       .slice(-10)

// //     // const result = await session.run(
// //     //   `
// //     //   MATCH (u:User {phone: $phone})

// //     //   OPTIONAL MATCH (u)-[:HAS_CONTACT]->(direct)

// //     //   OPTIONAL MATCH (u)-[:HAS_CONTACT]->()-[:HAS_CONTACT]->(fof)

// //     //   RETURN
// //     //     u.name AS userName,
// //     //     collect(DISTINCT direct.name) AS directContacts,
// //     //     collect(DISTINCT fof.name) AS friendsOfFriends
// //     //   `,
// //     //   { phone }
// //     // )

// //     //   const result = await session.run(
// //     //     `
// //     // MATCH (u:User)
// //     // WHERE u.phone CONTAINS $phone

// //     // OPTIONAL MATCH (u)-[:HAS_CONTACT]->(friend)

// //     // OPTIONAL MATCH (friend)-[:HAS_CONTACT]->(fof)

// //     // WITH u, friend,
// //     //      collect(DISTINCT fof.name) AS contacts

// //     // WHERE size(contacts) > 0

// //     // RETURN
// //     //   u.name AS userName,

// //     //   collect(
// //     //     DISTINCT {
// //     //       friend: friend.name,
// //     //       contacts: contacts
// //     //     }
// //     //   ) AS graph
// //     // `,
// //     //     { phone }
// //     //   )

// //     // const record = result.records[0]

// //     // res.json({
// //     //   user: record.get('userName'),
// //     //   directContacts: record.get('directContacts'),
// //     //   friendsOfFriends: record.get('friendsOfFriends')
// //     // })

// //     // res.json({
// //     //   user: record.get('userName'),
// //     //   directContacts: record.get('directContacts'),
// //     //   friendsOfFriends: record.get('friendsOfFriends')
// //     // })

// //     const result = await session.run(
// //       `
// //   MATCH (u:User)
// //   WHERE u.phone CONTAINS $phone

// //   OPTIONAL MATCH (u)-[:HAS_CONTACT]->(friend)

// //   OPTIONAL MATCH (friend)-[:HAS_CONTACT]->(fof)

// //   WITH
// //     u,
// //     friend,
// //     collect(DISTINCT fof.name) AS contacts

// //   WHERE friend IS NOT NULL
// //     AND size(contacts) > 0

// //   RETURN
// //     u.name AS userName,

// //     collect({
// //       friend: friend.name,
// //       contacts: contacts
// //     }) AS graph
// //   `,
// //       { phone }
// //     )

// //     const record = result.records[0]

// //     res.json({
// //       user: record.get('userName'),
// //       graph: record.get('graph')
// //     })

// //   } catch (err) {

// //     res.status(500).json({
// //       message: err.message
// //     })

// //   } finally {

// //     await session.close()

// //   }
// // })

// // module.exports = router


// const express = require('express')
// const router = express.Router()
// const User = require('../models/User')
// const Interest = require('../models/Interest')
// const { protect, adminOnly } = require('../middleware/auth')
// const driver = require('../config/neo4j')

// // GET /api/admin/stats
// router.get('/stats', protect, adminOnly, async (req, res) => {
//   try {
//     const [totalUsers, totalInterests, matches, trusted] = await Promise.all([
//       User.countDocuments(),
//       Interest.countDocuments(),
//       Interest.countDocuments({ status: 'accepted' }),
//       User.countDocuments({ trustLevel: 2 }),
//     ])
//     res.json({ totalUsers, totalInterests, matches, trusted })
//   } catch (err) {
//     res.status(500).json({ message: err.message })
//   }
// })

// // GET /api/admin/users
// router.get('/users', protect, adminOnly, async (req, res) => {
//   try {
//     const users = await User.find().select('-password').sort({ createdAt: -1 })
//     res.json({ users })
//   } catch (err) {
//     res.status(500).json({ message: err.message })
//   }
// })

// // PUT /api/admin/users/:id/toggle — activate/deactivate
// router.put('/users/:id/toggle', protect, adminOnly, async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id)
//     if (!user) return res.status(404).json({ message: 'User not found.' })
//     user.active = !user.active
//     await user.save()
//     res.json({ message: `User ${user.active ? 'activated' : 'deactivated'}.`, active: user.active })
//   } catch (err) {
//     res.status(500).json({ message: err.message })
//   }
// })

// // GET /api/admin/network/:userId
// // Returns up to 7 nodes: 1 center + up to 3 direct contacts + up to 3 FoF
// router.get('/network/:userId', protect, adminOnly, async (req, res) => {
//   const session = driver.session()

//   try {
//     const mongoUser = await User.findById(req.params.userId)
//     if (!mongoUser) return res.status(404).json({ message: 'User not found' })

//     const phone = mongoUser.phone?.replace(/\D/g, '').slice(-10)
//     if (!phone) return res.json({ user: mongoUser.name, graph: [] })

//     const result = await session.run(
//       `
//       MATCH (u:User)
//       WHERE u.phone CONTAINS $phone

//       OPTIONAL MATCH (u)-[:HAS_CONTACT]->(friend)

//       OPTIONAL MATCH (friend)-[:HAS_CONTACT]->(fof)
//       WHERE fof <> u

//       WITH
//         u,
//         friend,
//         collect(DISTINCT fof.name) AS contacts

//       WHERE friend IS NOT NULL

//       RETURN
//         u.name AS userName,
//         collect({
//           friend: friend.name,
//           contacts: contacts
//         }) AS graph
//       LIMIT 1
//       `,
//       { phone }
//     )

//     if (!result.records.length) {
//       return res.json({ user: mongoUser.name, graph: [] })
//     }

//     const record = result.records[0]
//     const rawGraph = record.get('graph') || []

//     // Server-side cap: 3 direct, 3 contacts each
//     const trimmedGraph = rawGraph.slice(0, 3).map((item) => ({
//       friend: item.friend,
//       contacts: (item.contacts || []).slice(0, 3),
//     }))

//     res.json({
//       user: record.get('userName') || mongoUser.name,
//       graph: trimmedGraph,
//     })
//   } catch (err) {
//     res.status(500).json({ message: err.message })
//   } finally {
//     await session.close()
//   }
// })

// module.exports = router


// PERFORMANCE: Run this once in Neo4j Browser to index phone lookups:
//   CREATE INDEX user_phone IF NOT EXISTS FOR (u:User) ON (u.phone)
//   CREATE INDEX user_name  IF NOT EXISTS FOR (u:User) ON (u.name)
const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Interest = require('../models/Interest')
const { protect, adminOnly } = require('../middleware/auth')
const driver = require('../config/neo4j')

// GET /api/admin/stats
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const [totalUsers, totalInterests, matches, trusted] = await Promise.all([
      User.countDocuments(),
      Interest.countDocuments(),
      Interest.countDocuments({ status: 'accepted' }),
      User.countDocuments({ trustLevel: 2 }),
    ])
    res.json({ totalUsers, totalInterests, matches, trusted })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/admin/users
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 })
    res.json({ users })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PUT /api/admin/users/:id/toggle — activate/deactivate
router.put('/users/:id/toggle', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found.' })
    user.active = !user.active
    await user.save()
    res.json({ message: `User ${user.active ? 'activated' : 'deactivated'}.`, active: user.active })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/admin/network/:userId
// Returns up to 7 nodes: 1 center + up to 3 direct contacts + up to 3 FoF
router.get('/network/:userId', protect, adminOnly, async (req, res) => {
  const session = driver.session()

  try {
    const mongoUser = await User.findById(req.params.userId)
    if (!mongoUser) return res.status(404).json({ message: 'User not found' })

    const phone = mongoUser.phone?.replace(/\D/g, '').slice(-10)
    if (!phone) return res.json({ user: mongoUser.name, graph: [] })

    // Use ENDS WITH for phone suffix match — faster than CONTAINS on indexed props.
    // Pull direct contacts first (LIMIT 3), then FoF in a second hop.
    // Two separate fast queries are cheaper than one big optional-match chain.
    const directResult = await session.run(
      `
      MATCH (u:User)
      WHERE u.phone ENDS WITH $phone
      WITH u LIMIT 1
      OPTIONAL MATCH (u)-[:HAS_CONTACT]->(friend:User)
      RETURN u.name AS userName, collect(friend.name)[..3] AS friends
      `,
      { phone }
    )

    if (!directResult.records.length) {
      return res.json({ user: mongoUser.name, graph: [] })
    }

    const directRecord = directResult.records[0]
    const userName = directRecord.get('userName') || mongoUser.name
    const friends = directRecord.get('friends') || []

    if (!friends.length) {
      return res.json({ user: userName, graph: [] })
    }

    // Fetch FoF for each direct friend in one batched query
    const fofResult = await session.run(
      `
      UNWIND $friends AS friendName
      MATCH (friend:User {name: friendName})-[:HAS_CONTACT]->(fof:User)
      WHERE NOT fof.name IN $friends
      RETURN friendName, collect(DISTINCT fof.name)[..3] AS contacts
      `,
      { friends }
    )

    const fofMap = {}
    fofResult.records.forEach(r => {
      fofMap[r.get('friendName')] = r.get('contacts') || []
    })

    const graph = friends.map(f => ({
      friend: f,
      contacts: fofMap[f] || [],
    }))

    // Fake result shape so the rest of the code still works
    const result = { records: [{ _userName: userName, _graph: graph }] }
    const record = result.records[0]

    res.json({ user: userName, graph })
  } catch (err) {
    res.status(500).json({ message: err.message })
  } finally {
    await session.close()
  }
})

module.exports = router