import pg from 'pg';
const { Pool } = pg;
const urlStr = process.env.DATABASE_URL;
const parseConnectionString = (urlStr) => {
    try {
        const url = new URL(urlStr);
        return {
            user: url.username,
            password: decodeURIComponent(url.password),
            host: url.hostname,
            port: url.port || 26257,
            database: url.pathname.slice(1) || 'defaultdb',
            ssl: { rejectUnauthorized: false }
        };
    } catch (e) {
        return { connectionString: urlStr, ssl: { rejectUnauthorized: false } };
    }
};

const opts = parseConnectionString(urlStr);
console.log('Testing connection with:');
console.log({...opts, password: '***'});

const pool = new Pool(opts);
pool.query('SELECT 1 as test').then(res => {
    console.log('SUCCESS!', res.rows);
    process.exit(0);
}).catch(err => {
    console.error('ERROR:', err.message);
    process.exit(1);
});
