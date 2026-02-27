// Shared CRM utilities, constants, and API helpers
export const FN_BASE = import.meta.env.DEV
    ? 'http://localhost:8888/.netlify/functions'
    : '/.netlify/functions'
export const ADMIN_TOKEN = 'o2need-admin-secret-2025'
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

export const adminFetch = (path, opts = {}) =>
    fetch(`${FN_BASE}/${path}`, {
        ...opts,
        headers: { 'x-admin-token': ADMIN_TOKEN, 'Content-Type': 'application/json', ...(opts.headers || {}) },
    })

export const fmt = (ts) => {
    if (!ts) return '—'
    const d = new Date(ts)
    if (isNaN(d.getTime())) return '—'
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export const fmtTime = (ts) => {
    if (!ts) return '—'
    const d = new Date(ts)
    if (isNaN(d.getTime())) return '—'
    return d.toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export const CATEGORIES = [
    { value: 'indoor', label: 'Indoor Plants' },
    { value: 'outdoor', label: 'Outdoor Plants' },
    { value: 'airpurifying', label: 'Air Purifying' },
    { value: 'succulent', label: 'Succulents' },
    { value: 'fertilizer', label: 'Fertilizers' },
]
