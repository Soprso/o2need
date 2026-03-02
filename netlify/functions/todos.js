// Netlify Function: /.netlify/functions/todos
// CRUD for admin to-do tasks stored in CockroachDB
// Uses ESM + explicit Client parsing to handle case-sensitive usernames

import pkg from 'pg';
const { Client } = pkg;

const ADMIN_TOKEN = process.env.ADMIN_SECRET_TOKEN || 'o2need-admin-secret-2025';

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, x-admin-token',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Content-Type': 'application/json',
};

// Explicitly parse the connection string to handle case sensitivity and special chars
function makeClient() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        throw new Error('DATABASE_URL environment variable is missing');
    }

    try {
        const url = new URL(connectionString);
        const config = {
            user: url.username,
            password: decodeURIComponent(url.password),
            host: url.hostname,
            port: url.port ? parseInt(url.port) : 26257,
            database: url.pathname.slice(1) || 'defaultdb',
            ssl: {
                rejectUnauthorized: false
            },
            connectionTimeoutMillis: 10000,
        };

        console.log(`[todos] Attempting connection as user: "${config.user}" to host: "${config.host}"`);
        return new Client(config);
    } catch (e) {
        console.error('[todos] Failed to parse DATABASE_URL:', e.message);
        // Fallback to direct string if URL parsing fails
        return new Client({
            connectionString,
            ssl: { rejectUnauthorized: false },
        });
    }
}

async function withDb(fn) {
    const client = makeClient();
    try {
        await client.connect();
        return await fn(client);
    } catch (err) {
        console.error('[todos] DB Connection/Query Error:', err.message);
        throw err;
    } finally {
        await client.end().catch(() => { });
    }
}

// Auto-create table on first use
const CREATE_TABLE_SQL = `
    CREATE TABLE IF NOT EXISTS tasks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        description TEXT,
        priority VARCHAR(4) NOT NULL DEFAULT 'P3',
        status VARCHAR(32) NOT NULL DEFAULT 'new',
        image_url TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
`;

export const handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };

    const token = event.headers['x-admin-token'];
    if (token !== ADMIN_TOKEN) {
        return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized' }) };
    }

    try {
        // GET — list all tasks
        if (event.httpMethod === 'GET') {
            const rows = await withDb(async (db) => {
                await db.query(CREATE_TABLE_SQL);
                const r = await db.query('SELECT * FROM tasks ORDER BY created_at DESC');
                return r.rows;
            });
            return { statusCode: 200, headers, body: JSON.stringify(rows) };
        }

        // POST — create task
        if (event.httpMethod === 'POST') {
            const { title, description, priority = 'P3', image_url } = JSON.parse(event.body || '{}');
            if (!title) return { statusCode: 400, headers, body: JSON.stringify({ error: 'title required' }) };

            const row = await withDb(async (db) => {
                await db.query(CREATE_TABLE_SQL);
                const r = await db.query(
                    `INSERT INTO tasks (title, description, priority, image_url)
                     VALUES ($1, $2, $3, $4) RETURNING *`,
                    [title, description || null, priority, image_url || null]
                )
                return r.rows[0];
            });
            return { statusCode: 201, headers, body: JSON.stringify(row) };
        }

        // PATCH — update task
        if (event.httpMethod === 'PATCH') {
            const id = event.queryStringParameters?.id;
            if (!id) return { statusCode: 400, headers, body: JSON.stringify({ error: 'id required' }) };

            const body = JSON.parse(event.body || '{}');
            const allowed = ['title', 'description', 'priority', 'status', 'image_url'];
            const sets = [];
            const vals = [];
            let i = 1;
            for (const key of allowed) {
                if (key in body) { sets.push(`${key} = $${i++}`); vals.push(body[key]); }
            }
            if (!sets.length) return { statusCode: 400, headers, body: JSON.stringify({ error: 'no fields to update' }) };

            sets.push(`updated_at = now()`);
            vals.push(id);

            const row = await withDb(async (db) => {
                const r = await db.query(
                    `UPDATE tasks SET ${sets.join(', ')} WHERE id = $${i} RETURNING *`,
                    vals
                );
                return r.rows[0];
            });
            if (!row) return { statusCode: 404, headers, body: JSON.stringify({ error: 'not found' }) };
            return { statusCode: 200, headers, body: JSON.stringify(row) };
        }

        // DELETE — remove task
        if (event.httpMethod === 'DELETE') {
            const id = event.queryStringParameters?.id;
            if (!id) return { statusCode: 400, headers, body: JSON.stringify({ error: 'id required' }) };

            await withDb(async (db) => {
                await db.query('DELETE FROM tasks WHERE id = $1', [id]);
            });
            return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
        }

        return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) }

    } catch (err) {
        console.error('[todos] error:', err.message);
        return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
    }
};
