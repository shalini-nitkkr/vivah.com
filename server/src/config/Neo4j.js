// const neo4j = require('neo4j-driver')

// const driver = neo4j.driver(
//   process.env.NEO4J_URI || 'neo4j://127.0.0.1:7687',
//   neo4j.auth.basic(
//     process.env.NEO4J_USER || 'neo4j',
//     process.env.NEO4J_PASS || 'manisha@1234'
//   ),
//   { encrypted: false, trust: 'TRUST_ALL_CERTIFICATES' }
// )

// driver.verifyConnectivity()
//   .then(() => console.log('✅ Neo4j connected'))
//   .catch(err => console.error('❌ Neo4j failed:', err.message))

// module.exports = driver

const neo4j = require("neo4j-driver");

const driver = neo4j.driver(
  process.env.NEO4J_URI || "neo4j://127.0.0.1:7687",
  neo4j.auth.basic(
    process.env.NEO4J_USER,
    process.env.NEO4J_PASS
  )
);

module.exports = driver;