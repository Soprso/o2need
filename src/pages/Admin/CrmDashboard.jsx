import { useState, useEffect } from 'react'
import { Users, Crown, Leaf, TrendingUp, Calendar, CheckCircle2 } from 'lucide-react'
import { adminFetch, fmt } from './crmUtils'
import { allStaticProducts } from '../../data/products'

const StatCard = ({ icon: Icon, label, value, sub, color = 'text-[#14532d]', bg = 'bg-green-50' }) => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${color}`} />
            </div>
        </div>
        <p className="text-2xl font-heading font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500 mt-0.5">{label}</p>
        {sub && <p className="text-xs text-green-600 mt-1 font-medium">{sub}</p>}
    </div>
)

const DashboardPage = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        adminFetch('admin-users')
            .then(r => r.json())
            .then(data => { setUsers(Array.isArray(data) ? data : []); setLoading(false) })
            .catch(() => setLoading(false))
    }, [])

    const subscribed = users.filter(u => u.unsafeMetadata?.subscription)
    const totalVisits = users.reduce((s, u) => s + (u.unsafeMetadata?.visitsLeft || 0), 0)
    const recentUsers = [...users].sort((a, b) => b.createdAt - a.createdAt).slice(0, 5)

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-heading font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500 mt-1">Welcome to the O2need CRM</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={Users} label="Total Users" value={loading ? '…' : users.length} />
                <StatCard icon={Crown} label="Active Members" value={loading ? '…' : subscribed.length}
                    sub={`${users.length ? Math.round(subscribed.length / users.length * 100) : 0}% conversion`}
                    color="text-amber-600" bg="bg-amber-50" />
                <StatCard icon={Leaf} label="Visits Remaining" value={loading ? '…' : totalVisits}
                    sub="Across all users" />
                <StatCard icon={TrendingUp} label="Catalog Products" value={allStaticProducts.length}
                    color="text-blue-600" bg="bg-blue-50" />
            </div>

            {/* Recent users */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#14532d]" />
                    <h2 className="font-heading font-bold text-gray-900 text-sm">Recently Joined</h2>
                </div>
                <div className="divide-y divide-gray-50">
                    {loading ? (
                        [...Array(5)].map((_, i) => (
                            <div key={i} className="px-6 py-3 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse" />
                                <div className="flex-1 space-y-1.5">
                                    <div className="h-3 bg-gray-100 rounded animate-pulse w-1/3" />
                                    <div className="h-2.5 bg-gray-100 rounded animate-pulse w-1/2" />
                                </div>
                            </div>
                        ))
                    ) : recentUsers.map(u => (
                        <div key={u.id} className="px-6 py-3 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                {u.imageUrl
                                    ? <img src={u.imageUrl} className="w-8 h-8 rounded-full object-cover" alt="" />
                                    : <div className="w-8 h-8 rounded-full bg-[#14532d] flex items-center justify-center text-white text-xs font-bold">{(u.firstName?.[0] || u.email[0]).toUpperCase()}</div>
                                }
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">{u.firstName} {u.lastName}</p>
                                    <p className="text-xs text-gray-500">{u.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {u.unsafeMetadata?.subscription && (
                                    <span className="text-xs bg-green-50 text-[#14532d] border border-green-100 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                                        <Crown className="w-2.5 h-2.5" /> Member
                                    </span>
                                )}
                                <span className="text-xs text-gray-400">{fmt(u.createdAt)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default DashboardPage
