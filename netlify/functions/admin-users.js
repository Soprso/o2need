// Netlify Function: /.netlify/functions/admin-users
// Lists all Clerk users with their subscription + order metadata
// Secured by admin token check

exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, x-admin-token',
        'Content-Type': 'application/json',
    }

    if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' }

    // Simple token check from env
    const token = event.headers['x-admin-token']
    if (token !== process.env.ADMIN_SECRET_TOKEN) {
        return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized' }) }
    }

    const clerkSecretKey = process.env.CLERK_SECRET_KEY
    if (!clerkSecretKey) {
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'Clerk secret key missing' }) }
    }

    try {
        // Fetch all users from Clerk (paginated — up to 500)
        const res = await fetch(
            'https://api.clerk.com/v1/users?limit=100&order_by=-created_at',
            {
                headers: {
                    Authorization: `Bearer ${clerkSecretKey}`,
                    'Content-Type': 'application/json',
                },
            }
        )

        if (!res.ok) {
            const err = await res.text()
            return { statusCode: res.status, headers, body: JSON.stringify({ error: err }) }
        }

        const users = await res.json()

        // Return only the fields we need to minimise payload
        const mapped = users.map(u => ({
            id: u.id,
            firstName: u.first_name,
            lastName: u.last_name,
            email: u.email_addresses?.[0]?.email_address || '—',
            imageUrl: u.image_url,
            createdAt: u.created_at,
            lastSignInAt: u.last_sign_in_at,
            unsafeMetadata: u.unsafe_metadata || {},
        }))

        return { statusCode: 200, headers, body: JSON.stringify(mapped) }
    } catch (err) {
        return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) }
    }
}
