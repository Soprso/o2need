import { useState, useMemo, useEffect } from 'react'
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar,
} from 'recharts'
import { Wallet, Package, TrendingDown, Users, Search, Download, Clock } from 'lucide-react'
import { adminFetch, fmtTime } from './crmUtils'

// Constants derived from user request
const PAYOUT_PER_VISIT = 300
const MATERIAL_COST_PER_VISIT = 150

const StatCard = ({ title, value, sub, icon: Icon, color = "text-gray-900", bg = "bg-gray-100" }) => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${color}`} />
            </div>
        </div>
        <p className="text-3xl font-heading font-bold text-gray-900">{value}</p>
        <div className="flex items-baseline justify-between mt-1">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{title}</p>
            {sub && <p className="text-xs font-medium text-gray-400">{sub}</p>}
        </div>
    </div>
)

const CrmPayouts = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        adminFetch('admin-users').then(r => r.json()).then(data => {
            setUsers(Array.isArray(data) ? data : [])
            setLoading(false)
        }).catch(() => setLoading(false))
    }, [])

    const { visits, stats, chartData } = useMemo(() => {
        let allVisits = []
        users.forEach(u => {
            const h = u.unsafeMetadata?.visitHistory || []
            h.forEach(v => {
                allVisits.push({
                    id: `${u.id}-${v.completedAt}`,
                    userId: u.id,
                    userName: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email,
                    userEmail: u.email,
                    date: v.completedAt,
                    note: v.note,
                    payout: PAYOUT_PER_VISIT,
                    material: MATERIAL_COST_PER_VISIT
                })
            })
        })

        // Sort latest first
        allVisits.sort((a, b) => new Date(b.date) - new Date(a.date))

        const totalVisits = allVisits.length
        const totalPayout = totalVisits * PAYOUT_PER_VISIT
        const totalMaterial = totalVisits * MATERIAL_COST_PER_VISIT

        // Group by month for chart
        const grouped = {}
        allVisits.forEach(v => {
            const d = new Date(v.date)
            const key = d.toLocaleString('default', { month: 'short', year: '2-digit' })
            if (!grouped[key]) grouped[key] = { name: key, visits: 0, payout: 0, material: 0 }
            grouped[key].visits++
            grouped[key].payout += v.payout
            grouped[key].material += v.material
        })

        const sortedGroups = Object.values(grouped).sort((a, b) => {
            const [mA, yA] = a.name.split(' ')
            const [mB, yB] = b.name.split(' ')
            const da = new Date(`${mA} 1 20${yA}`); const db = new Date(`${mB} 1 20${yB}`);
            return da - db;
        })

        return {
            visits: allVisits,
            stats: { totalVisits, totalPayout, totalMaterial, overhead: totalPayout + totalMaterial },
            chartData: sortedGroups.length ? sortedGroups : [{ name: 'No Data', payout: 0, material: 0 }]
        }
    }, [users])

    const filtered = visits.filter(v => {
        if (!search.trim()) return true
        const q = search.toLowerCase()
        return v.userName.toLowerCase().includes(q) || v.userEmail.toLowerCase().includes(q) || (v.note && v.note.toLowerCase().includes(q))
    })

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-heading font-bold text-gray-900">Gardener Payouts & Operational Costs</h1>
                    <p className="text-sm text-gray-500 mt-1">Track payouts mapped automatically from completed visits</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-sm font-semibold rounded-xl text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
                    <Download className="w-4 h-4" /> Export Ledger
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Payouts" value={`₹${stats.totalPayout.toLocaleString()}`} icon={Wallet} color="text-emerald-600" bg="bg-emerald-50" sub={`${stats.totalVisits} visits`} />
                <StatCard title="Material Costs" value={`₹${stats.totalMaterial.toLocaleString()}`} icon={Package} color="text-amber-600" bg="bg-amber-50" sub={`₹150/visit`} />
                <StatCard title="Total Overhead" value={`₹${stats.overhead.toLocaleString()}`} icon={TrendingDown} color="text-red-500" bg="bg-red-50" />
                <StatCard title="Visits Completed" value={stats.totalVisits} icon={Users} color="text-blue-600" bg="bg-blue-50" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-heading font-bold text-gray-900 flex items-center gap-2"><Clock className="w-4 h-4 text-[#14532d]" /> Complete Visit Ledger</h3>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search visits…"
                                className="pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#14532d]/30 w-48 transition-all" />
                        </div>
                    </div>
                    <div className="flex-1 overflow-auto min-h-[300px] max-h-[500px]">
                        <table className="w-full text-left border-collapse">
                            <thead className="sticky top-0 bg-gray-50/95 backdrop-blur z-10">
                                <tr>
                                    {['Date', 'Customer', 'Gardener Payout', 'Materials', 'Notes'].map(h => (
                                        <th key={h} className="px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? [...Array(5)].map((_, i) => (
                                    <tr key={i}>{[...Array(5)].map((_, j) => <td key={j} className="px-5 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" /></td>)}</tr>
                                )) : filtered.length === 0 ? (
                                    <tr><td colSpan={5} className="px-5 py-12 text-center text-sm text-gray-400">No visits recorded. Record a completed visit in the Subscriptions tab.</td></tr>
                                ) : filtered.map(v => (
                                    <tr key={v.id} className="hover:bg-green-50/30 transition-colors">
                                        <td className="px-5 py-3.5 text-sm whitespace-nowrap text-gray-600 font-medium">{fmtTime(v.date)}</td>
                                        <td className="px-5 py-3.5">
                                            <p className="text-sm font-bold text-gray-900">{v.userName}</p>
                                            <p className="text-xs text-gray-500">{v.userEmail}</p>
                                        </td>
                                        <td className="px-5 py-3.5 text-sm font-bold text-emerald-600">₹{v.payout}</td>
                                        <td className="px-5 py-3.5 text-sm font-bold text-amber-600">₹{v.material}</td>
                                        <td className="px-5 py-3.5 text-sm text-gray-500 italic max-w-xs truncate">{v.note || '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col">
                    <h3 className="font-heading font-bold text-gray-900 mb-6 flex items-center gap-2"><TrendingDown className="w-4 h-4 text-red-500" /> Cost Trend</h3>
                    <div className="flex-1 min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={metrics.chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} tickFormatter={val => `₹${val / 1000}k`} />
                                <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '12px', border: '1px solid #f3f4f6', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(value) => [`₹${value.toLocaleString()}`, '']} />
                                <Bar dataKey="payout" name="Payout" stackId="a" fill="#059669" radius={[0, 0, 4, 4]} />
                                <Bar dataKey="material" name="Material" stackId="a" fill="#d97706" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CrmPayouts
