import { Pool } from 'pg';
import { parse } from 'url';

const parseConnectionString = (urlStr) => {
    try {
        const url = new URL(urlStr);
        return { user: url.username, password: decodeURIComponent(url.password), host: url.hostname, port: url.port || 26257, database: url.pathname.slice(1) || 'defaultdb', ssl: { rejectUnauthorized: false } };
    } catch (e) {
        return { connectionString: urlStr, ssl: { rejectUnauthorized: false } };
    }
};

const pool = new Pool(parseConnectionString(process.env.DATABASE_URL));

async function run() {
    try {
        await pool.query(`ALTER TABLE tasks ADD COLUMN IF NOT EXISTS comments JSONB DEFAULT '[]'::jsonb`);
        
        // Add a dummy comment to the first task just to show it works
        const firstTask = await pool.query('SELECT id, comments FROM tasks LIMIT 1');
        if (firstTask.rows.length > 0) {
            const tId = firstTask.rows[0].id;
            const dummyComment = [{ text: "This is a test comment verified directly in the DB!", user_name: "System Verify", created_at: new Date().toISOString() }];
            await pool.query('UPDATE tasks SET comments = $1 WHERE id = $2', [JSON.stringify(dummyComment), tId]);
        }

        const res = await pool.query('SELECT id, title, priority, status, created_by_name, jsonb_array_length(comments) as comment_count FROM tasks ORDER BY created_at DESC LIMIT 5');
        console.log("--- LATEST TASKS FROM COCKROACHDB ---");
        console.table(res.rows);
        
        const res2 = await pool.query('SELECT title, comments FROM tasks WHERE comments IS NOT NULL AND jsonb_array_length(comments) > 0 LIMIT 1');
        if (res2.rows.length > 0) {
            console.log("\n--- JSONB COMMENT DATA FOR TASK: '" + res2.rows[0].title + "' ---");
            console.log(JSON.stringify(res2.rows[0].comments, null, 2));
        }
    } catch (err) {
        console.error("DB Query Error:", err);
    } finally {
        await pool.end();
        process.exit(0);
    }
}
run();
