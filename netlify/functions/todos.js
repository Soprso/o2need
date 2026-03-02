// Netlify Function: /.netlify/functions/todos
// CRUD for admin to-do tasks stored in CockroachDB
//
// Table DDL (run once):
//   CREATE TABLE IF NOT EXISTS tasks (
//     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//     title TEXT NOT NULL,
//     description TEXT,
//     priority VARCHAR(4) NOT NULL DEFAULT 'P3',
//     status VARCHAR(32) NOT NULL DEFAULT 'new',
//     image_url TEXT,
//     created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
//     updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
//   );

const { Pool } = require('pg')

let pool
function getPool() {
    if (!pool) {
        pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false },
        })
    }
    return pool
}

const ADMIN_TOKEN = process.env.ADMIN_SECRET_TOKEN || 'o2need-admin-secret-2025'

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, x-admin-token',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Content-Type': 'application/json',
}

exports.handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' }

    const token = event.headers['x-admin-token']
    if (token !== ADMIN_TOKEN) {
        return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized' }) }
    }

    const db = getPool()

    // Ensure table exists
    try {
        await db.query(`
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
        `)
    } catch (e) {
        // ignore if table already exists
    }

    try {
        // GET — list all tasks
        if (event.httpMethod === 'GET') {
            const result = await db.query(
                'SELECT * FROM tasks ORDER BY created_at DESC'
            )
            return { statusCode: 200, headers, body: JSON.stringify(result.rows) }
        }

        // POST — create task
        if (event.httpMethod === 'POST') {
            const { title, description, priority = 'P3', image_url } = JSON.parse(event.body || '{}')
            if (!title) return { statusCode: 400, headers, body: JSON.stringify({ error: 'title required' }) }

            const result = await db.query(
                `INSERT INTO tasks (title, description, priority, image_url)
                 VALUES ($1, $2, $3, $4)
                 RETURNING *`,
                [title, description || null, priority, image_url || null]
            )
            return { statusCode: 201, headers, body: JSON.stringify(result.rows[0]) }
        }

        // PATCH — update task (status, priority, description, title)
        if (event.httpMethod === 'PATCH') {
            const id = event.queryStringParameters?.id
            if (!id) return { statusCode: 400, headers, body: JSON.stringify({ error: 'id required' }) }

            const body = JSON.parse(event.body || '{}')
            const allowed = ['title', 'description', 'priority', 'status', 'image_url']
            const sets = []
            const vals = []
            let i = 1
            for (const key of allowed) {
                if (key in body) {
                    sets.push(`${key} = $${i++}`)
                    vals.push(body[key])
                }
            }
            if (!sets.length) return { statusCode: 400, headers, body: JSON.stringify({ error: 'no fields to update' }) }

            sets.push(`updated_at = now()`)
            vals.push(id)
            const result = await db.query(
                `UPDATE tasks SET ${sets.join(', ')} WHERE id = $${i} RETURNING *`,
                vals
            )
            if (!result.rows.length) return { statusCode: 404, headers, body: JSON.stringify({ error: 'not found' }) }
            return { statusCode: 200, headers, body: JSON.stringify(result.rows[0]) }
        }

        // DELETE — remove task
        if (event.httpMethod === 'DELETE') {
            const id = event.queryStringParameters?.id
            if (!id) return { statusCode: 400, headers, body: JSON.stringify({ error: 'id required' }) }

            await db.query('DELETE FROM tasks WHERE id = $1', [id])
            return { statusCode: 200, headers, body: JSON.stringify({ success: true }) }
        }

        return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) }

    } catch (err) {
        console.error('todos function error:', err)
        return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) }
    }
}
