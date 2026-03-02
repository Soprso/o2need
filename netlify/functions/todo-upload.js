// Netlify Function: /.netlify/functions/todo-upload
// Accepts a base64 image payload and uploads it to Cloudinary
// Returns { url } on success

const { v2: cloudinary } = require('cloudinary')

const ADMIN_TOKEN = process.env.ADMIN_SECRET_TOKEN || 'o2need-admin-secret-2025'

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, x-admin-token',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
}

exports.handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' }
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) }
    }

    const token = event.headers['x-admin-token']
    if (token !== ADMIN_TOKEN) {
        return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized' }) }
    }

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    })

    try {
        const { data, name } = JSON.parse(event.body || '{}')
        if (!data) return { statusCode: 400, headers, body: JSON.stringify({ error: 'No image data' }) }

        const result = await cloudinary.uploader.upload(data, {
            folder: 'o2need-tasks',
            public_id: `task-${Date.now()}-${name?.replace(/\s+/g, '-') || 'img'}`,
            resource_type: 'image',
        })

        return { statusCode: 200, headers, body: JSON.stringify({ url: result.secure_url }) }
    } catch (err) {
        console.error('todo-upload error:', err)
        return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) }
    }
}
