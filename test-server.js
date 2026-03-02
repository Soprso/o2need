import pg from 'pg';
const { Pool } = pg;
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});
pool.query('SELECT 1 as test').then(res => {
    console.log('SUCCESS!', res.rows);
    process.exit(0);
}).catch(err => {
    console.error('ERROR:', err.message);
    process.exit(1);
});
