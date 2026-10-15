const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'mtech_repairs',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function connectDB() {
  try {
    const connection = await pool.getConnection();

    console.log('[db] MySQL connected successfully');

    connection.release();
  } catch (err) {
    console.error('[db] MySQL connection error:', err.message);
    process.exit(1);
  }
}

module.exports = {
  pool,
  connectDB,
};