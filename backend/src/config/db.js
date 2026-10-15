
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const isCloudDB =
  process.env.DB_HOST &&
  process.env.DB_HOST !== 'localhost' &&
  process.env.DB_HOST !== '127.0.0.1';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'mtech_repairs',

  ...(isCloudDB
    ? {
        ssl: {
          ca: fs.readFileSync(
            path.resolve(
  __dirname,
  '../../certs/isrgrootx1.pem'
),
            'utf8'
          ),
          rejectUnauthorized: true,
        },
      }
    : {}),

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function connectDB() {
  try {
    const connection = await pool.getConnection();
    console.log('[db] MySQL/TiDB connected successfully');
    connection.release();
  } catch (err) {
    console.error('[db] Database connection error:', err.message);
    process.exit(1);
  }
}

module.exports = {
  pool,
  connectDB,
};
