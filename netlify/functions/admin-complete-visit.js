// Netlify Function: /.netlify/functions/admin-complete-visit
// Decrements a user's visitsLeft by 1 and records a completion timestamp
// Called when a gardener marks a visit as completed in the admin CRM

exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, x-admin-token',
        'Content-Type': 'application/json',
    }

    if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' }
    if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) }

    const token = event.headers['x-admin-token']
    if (token !== process.env.ADMIN_SECRET_TOKEN) {
        return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized' }) }
    }

    const clerkSecretKey = process.env.CLERK_SECRET_KEY
    if (!clerkSecretKey) {
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'Clerk secret key missing' }) }
    }

    try {
        const { userId, note } = JSON.parse(event.body || '{}')
        if (!userId) return { statusCode: 400, headers, body: JSON.stringify({ error: 'userId required' }) }

        // 1. Fetch current user metadata
        const userRes = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
            headers: { Authorization: `Bearer ${clerkSecretKey}` }
        })
        if (!userRes.ok) throw new Error(`Failed to fetch user: ${userRes.status}`)
        const user = await userRes.json()

        const meta = user.unsafe_metadata || {}
        const currentVisits = typeof meta.visitsLeft === 'number' ? meta.visitsLeft : 0
        if (currentVisits <= 0) {
            return { statusCode: 400, headers, body: JSON.stringify({ error: 'No visits remaining' }) }
        }

        const completedAt = new Date().toISOString()
        const visitRecord = { completedAt, note: note || '' }

        // 2. Decrement visitsLeft and push a completion log entry
        const updatedMeta = {
            ...meta,
            visitsLeft: Math.max(0, currentVisits - 1),
            visitHistory: [...(meta.visitHistory || []), visitRecord],
        }

        const patchRes = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${clerkSecretKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ unsafe_metadata: updatedMeta }),
        })

        if (!patchRes.ok) {
            const err = await patchRes.text()
            throw new Error(`Failed to update user: ${err}`)
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, visitsLeft: updatedMeta.visitsLeft, completedAt }),
        }
    } catch (err) {
        return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) }
    }
}
