// Netlify Function: /.netlify/functions/todos
// CRUD for admin to-do tasks stored in CockroachDB
// Includes: SSL fix, ESM support, and user tracking (created_by)

import pg from 'pg';
const { Pool } = pg;

const ADMIN_TOKEN = process.env.ADMIN_SECRET_TOKEN || 'o2need-admin-secret-2025';

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, x-admin-token',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Content-Type': 'application/json',
};

// We manually parse the DATABASE_URL to decode special characters in the password 
// (e.g., %40 to @) and prevent driver from lowercasing the CockroachDB username "O2need"
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
        console.error('[todos] Failed to parse DATABASE_URL:', e.message);
        return { connectionString: urlStr, ssl: { rejectUnauthorized: false } };
    }
};

const pool = new Pool(parseConnectionString(process.env.DATABASE_URL));

// --- SCHEMA ---
const CREATE_TABLE_SQL = `
    CREATE TABLE IF NOT EXISTS tasks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        description TEXT,
        priority VARCHAR(4) NOT NULL DEFAULT 'P3',
        status VARCHAR(32) NOT NULL DEFAULT 'new',
        image_url TEXT,
        created_by_name TEXT,
        created_by_email TEXT,
        comments JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
`;

const ALTER_TABLE_SQL = `
    ALTER TABLE tasks ADD COLUMN IF NOT EXISTS comments JSONB DEFAULT '[]'::jsonb;
`;

export const handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };

    const token = event.headers['x-admin-token'];
    if (token !== ADMIN_TOKEN) {
        return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized' }) };
    }

    try {
        // Auto-ensure table exists (run this on every request for stability)
        await pool.query(CREATE_TABLE_SQL);
        // Ensure comments column exists for backwards compat
        await pool.query(ALTER_TABLE_SQL);

        // GET — list all tasks
        if (event.httpMethod === 'GET') {
            const r = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
            return { statusCode: 200, headers, body: JSON.stringify(r.rows) };
        }

        // POST — create task
        if (event.httpMethod === 'POST') {
            const {
                title, description, priority = 'P3', image_url,
                created_by_name, created_by_email
            } = JSON.parse(event.body || '{}');

            if (!title) return { statusCode: 400, headers, body: JSON.stringify({ error: 'title required' }) };

            const r = await pool.query(
                `INSERT INTO tasks (title, description, priority, image_url, created_by_name, created_by_email, comments)
                 VALUES ($1, $2, $3, $4, $5, $6, '[]'::jsonb) RETURNING *`,
                [title, description || null, priority, image_url || null, created_by_name || null, created_by_email || null]
            );
            return { statusCode: 201, headers, body: JSON.stringify(r.rows[0]) };
        }

        // PATCH — update task
        if (event.httpMethod === 'PATCH') {
            const id = event.queryStringParameters?.id;
            if (!id) return { statusCode: 400, headers, body: JSON.stringify({ error: 'id required' }) };

            const body = JSON.parse(event.body || '{}');
            const allowed = ['title', 'description', 'priority', 'status', 'image_url', 'comments'];
            const sets = [];
            const vals = [];
            let i = 1;
            for (const key of allowed) {
                if (key in body) {
                    sets.push(`${key} = $${i++}`);
                    vals.push(key === 'comments' ? JSON.stringify(body[key]) : body[key]);
                }
            }
            if (!sets.length) return { statusCode: 400, headers, body: JSON.stringify({ error: 'no fields to update' }) };

            sets.push(`updated_at = now()`);
            vals.push(id);

            const r = await pool.query(
                `UPDATE tasks SET ${sets.join(', ')} WHERE id = $${i} RETURNING *`,
                vals
            );
            if (!r.rows[0]) return { statusCode: 404, headers, body: JSON.stringify({ error: 'not found' }) };
            return { statusCode: 200, headers, body: JSON.stringify(r.rows[0]) };
        }

        // DELETE — remove task
        if (event.httpMethod === 'DELETE') {
            const id = event.queryStringParameters?.id;
            if (!id) return { statusCode: 400, headers, body: JSON.stringify({ error: 'id required' }) };

            await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
            return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
        }

        return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

    } catch (err) {
        console.error('[todos] error:', err.message);
        return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
    }
};
