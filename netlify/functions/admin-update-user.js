// Netlify Function: /.netlify/functions/admin-update-user
// Updates a specific Clerk user's unsafeMetadata
// Secured by admin token check

exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, x-admin-token',
        'Content-Type': 'application/json',
    }

    if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' }
    if (event.httpMethod !== 'PATCH') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) }

    const token = event.headers['x-admin-token']
    if (token !== process.env.ADMIN_SECRET_TOKEN) {
        return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized' }) }
    }

    const clerkSecretKey = process.env.CLERK_SECRET_KEY
    if (!clerkSecretKey) {
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'Clerk secret key missing' }) }
    }

    try {
        const { userId, unsafeMetadata } = JSON.parse(event.body || '{}')
        if (!userId) return { statusCode: 400, headers, body: JSON.stringify({ error: 'userId required' }) }

        const res = await fetch(
            `https://api.clerk.com/v1/users/${userId}`,
            {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${clerkSecretKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ unsafe_metadata: unsafeMetadata }),
            }
        )

        if (!res.ok) {
            const err = await res.text()
            return { statusCode: res.status, headers, body: JSON.stringify({ error: err }) }
        }

        const updated = await res.json()
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, unsafeMetadata: updated.unsafe_metadata }),
        }
    } catch (err) {
        return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) }
    }
}
