import { useState, useEffect, useCallback } from 'react'
import {
    Lock, Eye, EyeOff, Crown, Users, Leaf,
    RefreshCw, Pencil, Trash2, Check, X, Phone,
    ChevronDown, ChevronUp, Search, ShoppingBag,
    Calendar, AlertTriangle, LogOut,
} from 'lucide-react'

// ── config ────────────────────────────────────────────────────────────────────
const ADMIN_PASSWORD = 'Mtr@2025'
// In dev, functions are served by netlify dev at http://localhost:8888/.netlify/functions/
// In production, they're at the same origin /.netlify/functions/
const FN_BASE = import.meta.env.DEV
    ? 'http://localhost:8888/.netlify/functions'
    : '/.netlify/functions'
// This token is compared on the server side too — must match ADMIN_SECRET_TOKEN env var
const ADMIN_TOKEN = 'o2need-admin-secret-2025'

const fmt = (ts) => ts
    ? new Date(ts).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—'

// ── Password Gate ─────────────────────────────────────────────────────────────
const PasswordGate = ({ onUnlock }) => {
    const [pw, setPw] = useState('')
    const [show, setShow] = useState(false)
    const [error, setError] = useState('')
    const [shake, setShake] = useState(false)

    const submit = (e) => {
        e.preventDefault()
        if (pw === ADMIN_PASSWORD) {
            onUnlock()
        } else {
            setError('Incorrect password. Access denied.')
            setShake(true)
            setPw('')
            setTimeout(() => setShake(false), 600)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a2e18] via-[#14532d] to-[#0a2e18] flex items-center justify-center p-4">
            <div
                className={`bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden ${shake ? 'animate-shake' : ''}`}
                style={shake ? { animation: 'shake 0.5s ease' } : {}}
            >
                <div className="bg-gradient-to-br from-[#14532d] to-[#166634] px-8 pt-10 pb-12 text-center relative overflow-hidden">
                    <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/5" />
                    <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-black/10" />
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                        <Lock className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="font-heading text-2xl font-bold text-white mb-1">O2need Control</h1>
                    <p className="text-green-200 text-sm">Admin & Subscription Management</p>
                </div>

                <div className="px-8 py-8">
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Admin Password</label>
                            <div className="relative">
                                <input
                                    type={show ? 'text' : 'password'}
                                    value={pw}
                                    onChange={(e) => { setPw(e.target.value); setError('') }}
                                    placeholder="Enter password"
                                    className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#14532d]/30 focus:border-[#14532d] text-sm transition-all"
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={() => setShow(!show)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {error && (
                                <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />{error}
                                </p>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-[#14532d] to-[#166534] hover:from-[#166534] hover:to-[#15803d] text-white font-bold py-3 rounded-xl transition-all duration-300 active:scale-[0.98] shadow-lg shadow-green-900/25"
                        >
                            Unlock Dashboard
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

// ── Edit Modal ────────────────────────────────────────────────────────────────
const EditModal = ({ user, onClose, onSave }) => {
    const sub = user.unsafeMetadata?.subscription
    const [visitsLeft, setVisitsLeft] = useState(String(user.unsafeMetadata?.visitsLeft ?? ''))
    const [phone, setPhone] = useState(user.unsafeMetadata?.phone ?? '')
    const [planName, setPlanName] = useState(sub?.planName ?? '')
    const [planPrice, setPlanPrice] = useState(String(sub?.price ?? ''))
    const [totalVisits, setTotalVisits] = useState(String(sub?.visits ?? ''))
    const [saving, setSaving] = useState(false)

    const handleSave = async () => {
        setSaving(true)
        const newMeta = {
            ...user.unsafeMetadata,
            visitsLeft: parseInt(visitsLeft) || 0,
            phone,
            subscription: sub ? {
                ...sub,
                planName,
                price: parseInt(planPrice) || sub.price,
                visits: parseInt(totalVisits) || sub.visits,
                visitsLabel: `${totalVisits} visits / ${sub.period}`,
            } : null,
        }
        await onSave(user.id, newMeta)
        setSaving(false)
        onClose()
    }

    const handleDeleteSubscription = async () => {
        if (!confirm('Remove this user\'s subscription permanently?')) return
        setSaving(true)
        const newMeta = { ...user.unsafeMetadata, subscription: null, visitsLeft: 0 }
        await onSave(user.id, newMeta)
        setSaving(false)
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="bg-gradient-to-r from-[#14532d] to-[#166534] px-6 py-5 flex items-center justify-between">
                    <div>
                        <p className="text-white font-bold">{user.firstName} {user.lastName}</p>
                        <p className="text-green-200 text-xs">{user.email}</p>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/30 text-white transition-all hover:rotate-90">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">Visits Left</label>
                            <input type="number" min="0" value={visitsLeft}
                                onChange={(e) => setVisitsLeft(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#14532d]/30 focus:border-[#14532d] text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">Phone</label>
                            <input type="tel" value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#14532d]/30 focus:border-[#14532d] text-sm" />
                        </div>
                    </div>

                    {sub && (
                        <>
                            <div className="border-t border-gray-100 pt-3">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Subscription Details</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1">Plan Name</label>
                                        <input value={planName} onChange={(e) => setPlanName(e.target.value)}
                                            className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#14532d]/30 focus:border-[#14532d] text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1">Price (₹)</label>
                                        <input type="number" value={planPrice} onChange={(e) => setPlanPrice(e.target.value)}
                                            className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#14532d]/30 focus:border-[#14532d] text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1">Total Visits</label>
                                        <input type="number" min="0" value={totalVisits} onChange={(e) => setTotalVisits(e.target.value)}
                                            className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#14532d]/30 focus:border-[#14532d] text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1">Purchased</label>
                                        <p className="px-3 py-2 text-sm text-gray-500">{fmt(sub.purchasedAt)}</p>
                                    </div>
                                </div>
                            </div>
                            <button onClick={handleDeleteSubscription} disabled={saving}
                                className="w-full flex items-center justify-center gap-2 text-red-500 border border-red-200 py-2 rounded-xl text-sm font-semibold hover:bg-red-50 transition-all disabled:opacity-50">
                                <Trash2 className="w-4 h-4" /> Remove Subscription
                            </button>
                        </>
                    )}

                    <button onClick={handleSave} disabled={saving}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#14532d] to-[#166534] text-white font-bold py-3 rounded-xl transition-all duration-300 active:scale-[0.98] disabled:opacity-75">
                        {saving ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</> : <><Check className="w-4 h-4" /> Save Changes</>}
                    </button>
                </div>
            </div>
        </div>
    )
}

// ── User Row ──────────────────────────────────────────────────────────────────
const UserRow = ({ user, onEdit }) => {
    const [expanded, setExpanded] = useState(false)
    const sub = user.unsafeMetadata?.subscription
    const visitsLeft = user.unsafeMetadata?.visitsLeft ?? 0
    const phone = user.unsafeMetadata?.phone

    return (
        <>
            <tr className="border-b border-gray-100 hover:bg-green-50/40 transition-colors">
                <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                        {user.imageUrl
                            ? <img src={user.imageUrl} alt="" className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                            : <div className="w-9 h-9 rounded-full bg-[#14532d] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">{(user.firstName?.[0] || user.email[0]).toUpperCase()}</div>
                        }
                        <div>
                            <p className="font-semibold text-sm text-gray-900">{user.firstName} {user.lastName}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                    </div>
                </td>
                <td className="px-5 py-4">
                    {phone
                        ? <span className="flex items-center gap-1.5 text-sm text-gray-700"><Phone className="w-3.5 h-3.5 text-gray-400" />{phone}</span>
                        : <span className="text-sm text-gray-400">—</span>
                    }
                </td>
                <td className="px-5 py-4">
                    {sub
                        ? <div className="flex items-center gap-2">
                            <Crown className="w-3.5 h-3.5 text-[#22c55e]" />
                            <span className="text-sm font-semibold text-[#14532d]">{sub.planName}</span>
                        </div>
                        : <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">No plan</span>
                    }
                </td>
                <td className="px-5 py-4 text-center">
                    {sub
                        ? <span className={`inline-flex items-center justify-center w-9 h-9 rounded-xl font-bold text-sm ${visitsLeft > 0 ? 'bg-green-100 text-[#14532d]' : 'bg-gray-100 text-gray-400'}`}>
                            {visitsLeft}
                        </span>
                        : <span className="text-gray-400 text-sm">—</span>
                    }
                </td>
                <td className="px-5 py-4 text-xs text-gray-500">{fmt(user.createdAt)}</td>
                <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                        <button onClick={() => onEdit(user)} className="p-2 rounded-xl text-[#14532d] hover:bg-green-50 transition-colors" title="Edit">
                            <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => setExpanded(!expanded)} className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors" title="Expand">
                            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                    </div>
                </td>
            </tr>
            {expanded && (
                <tr className="bg-green-50/30">
                    <td colSpan={6} className="px-8 py-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                            <div>
                                <p className="font-bold text-gray-500 uppercase tracking-wider mb-1">Payment ID</p>
                                <p className="font-mono text-gray-700 break-all">{sub?.paymentId || '—'}</p>
                            </div>
                            <div>
                                <p className="font-bold text-gray-500 uppercase tracking-wider mb-1">Plan Price</p>
                                <p className="text-gray-700">₹{sub?.price?.toLocaleString('en-IN') || '—'} / {sub?.period || '—'}</p>
                            </div>
                            <div>
                                <p className="font-bold text-gray-500 uppercase tracking-wider mb-1">Total Visits</p>
                                <p className="text-gray-700">{sub?.visits || '—'}</p>
                            </div>
                            <div>
                                <p className="font-bold text-gray-500 uppercase tracking-wider mb-1">Purchased At</p>
                                <p className="text-gray-700">{fmt(sub?.purchasedAt)}</p>
                            </div>
                        </div>
                        {sub?.features && (
                            <div className="mt-3 flex flex-wrap gap-1.5">
                                {sub.features.map((f, i) => (
                                    <span key={i} className="text-xs bg-[#14532d]/10 text-[#14532d] px-2.5 py-1 rounded-full capitalize">{f}</span>
                                ))}
                            </div>
                        )}
                    </td>
                </tr>
            )}
        </>
    )
}

// ── Stats Card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, color = 'text-[#14532d]', bg = 'bg-green-50' }) => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
        <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div>
            <p className="text-2xl font-heading font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
        </div>
    </div>
)

// ── Main Admin Panel ──────────────────────────────────────────────────────────
const AdminPanelContent = ({ onLogout }) => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [search, setSearch] = useState('')
    const [editUser, setEditUser] = useState(null)
    const [filter, setFilter] = useState('all') // all | subscribed | unsubscribed

    const fetchUsers = useCallback(async () => {
        setLoading(true)
        setError('')
        try {
            const res = await fetch(`${FN_BASE}/admin-users`, {
                headers: { 'x-admin-token': ADMIN_TOKEN }
            })
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            const data = await res.json()
            setUsers(data)
        } catch (err) {
            setError(`Failed to load users: ${err.message}. Make sure Netlify Dev is running (netlify dev) or you are on the deployed site.`)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetchUsers() }, [fetchUsers])

    const handleSave = async (userId, unsafeMetadata) => {
        const res = await fetch(`${FN_BASE}/admin-update-user`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'x-admin-token': ADMIN_TOKEN },
            body: JSON.stringify({ userId, unsafeMetadata }),
        })
        if (!res.ok) { alert('Failed to save changes'); return }
        // Update local state
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, unsafeMetadata } : u))
    }

    const filtered = users
        .filter(u => {
            if (filter === 'subscribed') return !!u.unsafeMetadata?.subscription
            if (filter === 'unsubscribed') return !u.unsafeMetadata?.subscription
            return true
        })
        .filter(u => {
            if (!search.trim()) return true
            const q = search.toLowerCase()
            return u.email.toLowerCase().includes(q)
                || `${u.firstName} ${u.lastName}`.toLowerCase().includes(q)
                || (u.unsafeMetadata?.phone || '').includes(q)
        })

    const subscribedCount = users.filter(u => !!u.unsafeMetadata?.subscription).length
    const totalVisitsLeft = users.reduce((sum, u) => sum + (u.unsafeMetadata?.visitsLeft || 0), 0)

    return (
        <div className="min-h-screen bg-[#f4f6f8]">
            {/* Header */}
            <header className="bg-gradient-to-r from-[#14532d] to-[#166534] sticky top-0 z-40 shadow-lg">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="/as/logo.png" alt="O2need" className="h-10 w-auto object-contain brightness-0 invert" onError={(e) => { e.target.style.display = 'none' }} />
                        <div>
                            <p className="font-heading font-bold text-white text-sm leading-none">O2need Control</p>
                            <p className="text-green-300 text-xs">Subscription & User Management</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={fetchUsers} disabled={loading} className="flex items-center gap-1.5 text-green-200 hover:text-white text-sm transition-colors disabled:opacity-50">
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                        <button onClick={onLogout} className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-all">
                            <LogOut className="w-4 h-4" /> Logout
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Stats row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <StatCard icon={Users} label="Total Users" value={users.length} />
                    <StatCard icon={Crown} label="Subscribed Users" value={subscribedCount} color="text-amber-600" bg="bg-amber-50" />
                    <StatCard icon={Leaf} label="Total Visits Left" value={totalVisitsLeft} />
                    <StatCard icon={ShoppingBag} label="Unsubscribed" value={users.length - subscribedCount} color="text-gray-500" bg="bg-gray-100" />
                </div>

                {/* Table card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Toolbar */}
                    <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
                        <h2 className="font-heading font-bold text-gray-900">All Users</h2>
                        <div className="flex gap-3 flex-wrap">
                            {/* Filter tabs */}
                            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
                                {[['all', 'All'], ['subscribed', 'Subscribed'], ['unsubscribed', 'Free']].map(([val, label]) => (
                                    <button key={val} onClick={() => setFilter(val)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter === val ? 'bg-white text-[#14532d] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                                        {label}
                                    </button>
                                ))}
                            </div>
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search name, email, phone…"
                                    className="pl-8 pr-4 py-1.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#14532d]/30 focus:border-[#14532d] w-52"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            {error}
                        </div>
                    )}

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[700px]">
                            <thead>
                                <tr className="bg-gray-50 text-left">
                                    <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                                    <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Plan</th>
                                    <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Visits Left</th>
                                    <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Joined</th>
                                    <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    [...Array(5)].map((_, i) => (
                                        <tr key={i} className="border-b border-gray-100">
                                            {[...Array(6)].map((_, j) => (
                                                <td key={j} className="px-5 py-4">
                                                    <div className="h-4 bg-gray-100 rounded animate-pulse" style={{ width: `${60 + Math.random() * 40}%` }} />
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                ) : filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-5 py-16 text-center">
                                            <Users className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                                            <p className="text-sm text-gray-500">No users found</p>
                                        </td>
                                    </tr>
                                ) : filtered.map(u => (
                                    <UserRow key={u.id} user={u} onEdit={setEditUser} />
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer */}
                    {!loading && (
                        <div className="px-6 py-3 border-t border-gray-100 text-xs text-gray-400">
                            Showing {filtered.length} of {users.length} users · Data from Clerk unsafeMetadata
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Modal */}
            {editUser && (
                <EditModal user={editUser} onClose={() => setEditUser(null)} onSave={handleSave} />
            )}
        </div>
    )
}

// ── Root ──────────────────────────────────────────────────────────────────────
const AdminPanel = () => {
    const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem('o2need-admin-auth') === '1')

    const onUnlock = () => { sessionStorage.setItem('o2need-admin-auth', '1'); setUnlocked(true) }
    const onLogout = () => { sessionStorage.removeItem('o2need-admin-auth'); setUnlocked(false) }

    return unlocked ? <AdminPanelContent onLogout={onLogout} /> : <PasswordGate onUnlock={onUnlock} />
}

export default AdminPanel
