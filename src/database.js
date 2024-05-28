import mysql from 'mysql2/promise'

let pool

export const query = async (sql, params) => {
  await getConnectionPool()
  const [results, ] = await pool.query(sql, params)
  return results
}

const getConnectionPool = async () => {
  if (!pool) {
    pool = await mysql.createPool({
      uri: process.env.DATABASE_URL,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    })
  }

  return pool
}