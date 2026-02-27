import { useState, useEffect, useCallback } from 'react'
import {
    Crown, Phone, Search, RefreshCw, ChevronDown, ChevronUp,
    CheckSquare, AlertTriangle, Trash2, Pencil, Check, X,
    Clock, Leaf, Calendar
} from 'lucide-react'
import { adminFetch, fmt, fmtTime } from './crmUtils'

const ADMIN_TOKEN = 'o2need-admin-secret-2025'
const FN_BASE = import.meta.env.DEV ? 'http://localhost:8888/.netlify/functions' : '/.netlify/functions'

// ── Edit Modal ───────────────────────────────────────────────────────────────
const EditModal = ({ user, onClose, onSave }) => {
    const sub = user.unsafeMetadata?.subscription
    const [visitsLeft, setVisitsLeft] = useState(String(user.unsafeMetadata?.visitsLeft ?? ''))
    const [phone, setPhone] = useState(user.unsafeMetadata?.phone ?? '')
    const [planName, setPlanName] = useState(sub?.planName ?? '')
    const [planPrice, setPlanPrice] = useState(String(sub?.price ?? ''))
    const [totalVisits, setTotalVisits] = useState(String(sub?.visits ?? ''))
    const [saving, setSaving] = useState(false)

    const save = async () => {
        setSaving(true)
        const newMeta = {
            ...user.unsafeMetadata,
            visitsLeft: parseInt(visitsLeft) || 0,
            phone,
            subscription: sub ? { ...sub, planName, price: parseInt(planPrice) || sub.price, visits: parseInt(totalVisits) || sub.visits } : null,
        }
        await onSave(user.id, newMeta)
        setSaving(false)
        onClose()
    }

    const deleteSub = async () => {
        if (!confirm('Remove this subscription permanently?')) return
        setSaving(true)
        await onSave(user.id, { ...user.unsafeMetadata, subscription: null, visitsLeft: 0 })
        setSaving(false)
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <div className="bg-gradient-to-r from-[#14532d] to-[#166534] px-6 py-4 rounded-t-2xl flex items-center justify-between">
                    <div>
                        <p className="text-white font-bold text-sm">{user.firstName} {user.lastName}</p>
                        <p className="text-green-200 text-xs">{user.email}</p>
                    </div>
                    <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/30 text-white transition-all hover:rotate-90">
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Visits Left</label>
                            <input type="number" min="0" value={visitsLeft} onChange={e => setVisitsLeft(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#14532d]/30 text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Phone</label>
                            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#14532d]/30 text-sm" />
                        </div>
                    </div>
                    {sub && (
                        <div className="border-t pt-3 space-y-3">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Subscription</p>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Plan Name</label>
                                    <input value={planName} onChange={e => setPlanName(e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#14532d]/30 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Price (₹)</label>
                                    <input type="number" value={planPrice} onChange={e => setPlanPrice(e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#14532d]/30 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Total Visits</label>
                                    <input type="number" min="0" value={totalVisits} onChange={e => setTotalVisits(e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#14532d]/30 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Purchased</label>
                                    <p className="px-3 py-2 text-sm text-gray-500">{fmt(sub.purchasedAt)}</p>
                                </div>
                            </div>
                            <button onClick={deleteSub} disabled={saving}
                                className="w-full flex items-center justify-center gap-2 text-red-500 border border-red-200 py-2 rounded-xl text-sm font-semibold hover:bg-red-50 transition-all disabled:opacity-50">
                                <Trash2 className="w-3.5 h-3.5" /> Remove Subscription
                            </button>
                        </div>
                    )}
                    <button onClick={save} disabled={saving}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#14532d] to-[#166534] text-white font-bold py-2.5 rounded-xl transition-all disabled:opacity-75">
                        {saving ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving…</> : <><Check className="w-4 h-4" />Save Changes</>}
                    </button>
                </div>
            </div>
        </div>
    )
}

// ── Complete Visit Modal ─────────────────────────────────────────────────────
const CompleteVisitModal = ({ user, onClose, onDone }) => {
    const [note, setNote] = useState('')
    const [saving, setSaving] = useState(false)

    const submit = async () => {
        setSaving(true)
        const res = await fetch(`${FN_BASE}/admin-complete-visit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-admin-token': ADMIN_TOKEN },
            body: JSON.stringify({ userId: user.id, note }),
        })
        const data = await res.json()
        setSaving(false)
        if (data.success) { onDone(user.id, data.visitsLeft, data.completedAt, note); onClose() }
        else alert(`Error: ${data.error}`)
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
                <div className="bg-gradient-to-r from-[#14532d] to-[#166534] px-6 py-4 rounded-t-2xl">
                    <p className="text-white font-bold text-sm flex items-center gap-2"><CheckSquare className="w-4 h-4" /> Mark Visit Completed</p>
                    <p className="text-green-200 text-xs mt-0.5">{user.firstName} {user.lastName} — {user.unsafeMetadata?.visitsLeft} visit(s) remaining</p>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Visit Notes (optional)</label>
                        <textarea rows={3} value={note} onChange={e => setNote(e.target.value)} placeholder="Pruning done, overall plant health good..."
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#14532d]/30 text-sm resize-none" />
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700 flex items-start gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                        This will deduct 1 visit from the user's remaining count.
                    </div>
                    <div className="flex gap-2">
                        <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-all">Cancel</button>
                        <button onClick={submit} disabled={saving}
                            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#14532d] to-[#166534] text-white font-bold py-2.5 rounded-xl transition-all disabled:opacity-75">
                            {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <CheckSquare className="w-4 h-4" />}
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ── User Row ─────────────────────────────────────────────────────────────────
const UserRow = ({ user: initUser, onEdit }) => {
    const [user, setUser] = useState(initUser)
    const [show, setShow] = useState(false)
    const [completeModal, setCompleteModal] = useState(false)
    const sub = user.unsafeMetadata?.subscription
    const visitsLeft = user.unsafeMetadata?.visitsLeft ?? 0
    const history = user.unsafeMetadata?.visitHistory || []

    const onVisitDone = (uid, vLeft, completedAt, note) => {
        setUser(u => ({
            ...u,
            unsafeMetadata: {
                ...u.unsafeMetadata,
                visitsLeft: vLeft,
                visitHistory: [...(u.unsafeMetadata?.visitHistory || []), { completedAt, note }],
            }
        }))
    }

    return (
        <>
            <tr className="border-b border-gray-100 hover:bg-green-50/30 transition-colors">
                <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                        {user.imageUrl
                            ? <img src={user.imageUrl} className="w-8 h-8 rounded-full object-cover flex-shrink-0" alt="" />
                            : <div className="w-8 h-8 rounded-full bg-[#14532d] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{(user.firstName?.[0] || user.email[0]).toUpperCase()}</div>
                        }
                        <div>
                            <p className="font-semibold text-sm text-gray-900">{user.firstName} {user.lastName}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                    </div>
                </td>
                <td className="px-5 py-3.5 text-sm text-gray-600">
                    {user.unsafeMetadata?.phone || <span className="text-gray-300">—</span>}
                </td>
                <td className="px-5 py-3.5">
                    {sub ? (
                        <div className="flex items-center gap-1.5">
                            <Crown className="w-3.5 h-3.5 text-amber-500" />
                            <span className="text-sm font-semibold text-[#14532d]">{sub.planName}</span>
                        </div>
                    ) : <span className="text-xs text-gray-300 bg-gray-50 px-2 py-1 rounded-full">No plan</span>}
                </td>
                <td className="px-5 py-3.5 text-center">
                    {sub ? (
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm ${visitsLeft > 0 ? 'bg-green-100 text-[#14532d]' : 'bg-gray-100 text-gray-400'}`}>
                            {visitsLeft}
                        </span>
                    ) : <span className="text-gray-300 text-sm">—</span>}
                </td>
                <td className="px-5 py-3.5 text-xs text-gray-500">{fmt(user.createdAt)}</td>
                <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1">
                        {sub && visitsLeft > 0 && (
                            <button onClick={() => setCompleteModal(true)}
                                className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg bg-green-50 text-[#14532d] hover:bg-green-100 transition-colors border border-green-200"
                                title="Mark visit completed">
                                <CheckSquare className="w-3.5 h-3.5" /> Done
                            </button>
                        )}
                        <button onClick={() => onEdit(user)} className="p-1.5 rounded-lg text-gray-400 hover:text-[#14532d] hover:bg-green-50 transition-colors">
                            <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setShow(!show)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
                            {show ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                    </div>
                </td>
            </tr>
            {show && (
                <tr className="bg-green-50/20">
                    <td colSpan={6} className="px-8 py-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs mb-3">
                            <div><p className="font-bold text-gray-400 uppercase tracking-wide mb-1">Payment ID</p><p className="font-mono text-gray-600 break-all">{sub?.paymentId || '—'}</p></div>
                            <div><p className="font-bold text-gray-400 uppercase tracking-wide mb-1">Price</p><p className="text-gray-600">₹{sub?.price?.toLocaleString('en-IN') || '—'}/{sub?.period || '—'}</p></div>
                            <div><p className="font-bold text-gray-400 uppercase tracking-wide mb-1">Total Visits</p><p className="text-gray-600">{sub?.visits || '—'}</p></div>
                            <div><p className="font-bold text-gray-400 uppercase tracking-wide mb-1">Purchased</p><p className="text-gray-600">{fmt(sub?.purchasedAt)}</p></div>
                        </div>
                        {history.length > 0 && (
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1.5"><Clock className="w-3 h-3" /> Visit History</p>
                                <div className="space-y-1.5">
                                    {[...history].reverse().map((h, i) => (
                                        <div key={i} className="flex items-start gap-2 text-xs bg-white rounded-lg px-3 py-2 border border-gray-100">
                                            <Leaf className="w-3 h-3 text-[#22c55e] flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-500">{fmtTime(h.completedAt)}</span>
                                            {h.note && <span className="text-gray-700 italic">— {h.note}</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </td>
                </tr>
            )}
            {completeModal && <CompleteVisitModal user={user} onClose={() => setCompleteModal(false)} onDone={onVisitDone} />}
        </>
    )
}

// ── Main Subscriptions Page ───────────────────────────────────────────────────
const SubscriptionsPage = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('all')
    const [editUser, setEditUser] = useState(null)

    const load = useCallback(async () => {
        setLoading(true); setError('')
        try {
            const res = await adminFetch('admin-users')
            const data = await res.json()
            setUsers(Array.isArray(data) ? data : [])
        } catch (e) { setError(e.message) }
        finally { setLoading(false) }
    }, [])

    useEffect(() => { load() }, [load])

    const handleSave = async (userId, meta) => {
        const res = await adminFetch('admin-update-user', {
            method: 'PATCH',
            body: JSON.stringify({ userId, unsafeMetadata: meta }),
        })
        if (!res.ok) { alert('Save failed'); return }
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, unsafeMetadata: meta } : u))
    }

    const filtered = users
        .filter(u => filter === 'all' ? true : filter === 'subscribed' ? !!u.unsafeMetadata?.subscription : !u.unsafeMetadata?.subscription)
        .filter(u => {
            if (!search.trim()) return true
            const q = search.toLowerCase()
            return u.email.toLowerCase().includes(q) || `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) || (u.unsafeMetadata?.phone || '').includes(q)
        })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-heading font-bold text-gray-900">Subscriptions</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage members and track gardener visits</p>
                </div>
                <button onClick={load} disabled={loading} className="flex items-center gap-2 text-sm text-[#14532d] hover:text-[#166534] font-medium disabled:opacity-50">
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-3.5 border-b border-gray-100 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                    <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
                        {[['all', 'All'], ['subscribed', 'Members'], ['unsubscribed', 'Free']].map(([v, l]) => (
                            <button key={v} onClick={() => setFilter(v)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter === v ? 'bg-white text-[#14532d] shadow-sm' : 'text-gray-500'}`}>{l}</button>
                        ))}
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, email, phone…"
                            className="pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#14532d]/30 w-48" />
                    </div>
                </div>

                {error && (
                    <div className="m-5 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0" />{error}
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[680px]">
                        <thead>
                            <tr className="bg-gray-50">
                                {['User', 'Phone', 'Plan', 'Visits', 'Joined', 'Actions'].map(h => (
                                    <th key={h} className="px-5 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? [...Array(5)].map((_, i) => (
                                <tr key={i} className="border-b border-gray-100">
                                    {[...Array(6)].map((_, j) => <td key={j} className="px-5 py-3.5"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>)}
                                </tr>
                            )) : filtered.length === 0 ? (
                                <tr><td colSpan={6} className="text-center py-16 text-gray-400 text-sm">No users found</td></tr>
                            ) : filtered.map(u => <UserRow key={u.id} user={u} onEdit={setEditUser} />)}
                        </tbody>
                    </table>
                </div>
                <div className="px-5 py-2.5 border-t border-gray-100 text-xs text-gray-400">
                    {filtered.length} of {users.length} users
                </div>
            </div>
            {editUser && <EditModal user={editUser} onClose={() => setEditUser(null)} onSave={handleSave} />}
        </div>
    )
}

export default SubscriptionsPage
