const { pool } = require('../src/config/db');

async function check() {
  const client = await pool.connect();
  try {
    const res = await client.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'products'");
    console.log(res.rows);
  } finally {
    client.release();
    pool.end();
  }
}
check();
