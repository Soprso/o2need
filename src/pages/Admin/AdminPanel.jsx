import { useState } from 'react'
import {
    Lock, Eye, EyeOff, LayoutDashboard, Crown,
    Package, PlusCircle, LogOut, Menu, X, AlertTriangle, ExternalLink,
    PieChart, IndianRupee
} from 'lucide-react'
import CrmDashboard from './CrmDashboard'
import CrmSubscriptions from './CrmSubscriptions'
import CrmProductsPage from './CrmProducts'
import CrmAddProductPage from './CrmAddProduct'
import CrmSales from './CrmSales'
import CrmPayouts from './CrmPayouts'

const ADMIN_PASSWORD = 'Mtr@2025'

// ── Password Gate ──────────────────────────────────────────────────────────
const PasswordGate = ({ onUnlock }) => {
    const [pw, setPw] = useState('')
    const [show, setShow] = useState(false)
    const [error, setError] = useState('')
    const [shake, setShake] = useState(false)

    const submit = (e) => {
        e.preventDefault()
        if (pw === ADMIN_PASSWORD) { onUnlock() }
        else {
            setError('Incorrect password.')
            setShake(true); setPw('')
            setTimeout(() => setShake(false), 600)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a2e18] via-[#14532d] to-[#0a2e18] flex items-center justify-center p-4">
            <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-6px)}80%{transform:translateX(6px)}}`}</style>
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden" style={shake ? { animation: 'shake 0.5s ease' } : {}}>
                <div className="bg-gradient-to-br from-[#14532d] to-[#166634] px-8 pt-10 pb-12 text-center relative overflow-hidden">
                    <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/5" />
                    <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-black/10" />
                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="font-heading text-2xl font-bold text-white mb-1">O2need Control</h1>
                    <p className="text-green-200 text-sm">Admin & Subscription CRM</p>
                </div>
                <div className="px-8 py-8">
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Admin Password</label>
                            <div className="relative">
                                <input type={show ? 'text' : 'password'} value={pw}
                                    onChange={e => { setPw(e.target.value); setError('') }}
                                    placeholder="Enter password"
                                    className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#14532d]/30 focus:border-[#14532d] text-sm transition-all"
                                    autoFocus />
                                <button type="button" onClick={() => setShow(!show)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {error && <p className="mt-2 text-xs text-red-500 flex items-center gap-1"><AlertTriangle className="w-3 h-3" />{error}</p>}
                        </div>
                        <button type="submit"
                            className="w-full bg-gradient-to-r from-[#14532d] to-[#166534] text-white font-bold py-3 rounded-xl transition-all active:scale-[0.98] shadow-lg">
                            Unlock Dashboard
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

// ── Navigation items ───────────────────────────────────────────────────────
const NAV = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'sales', label: 'Sales & Orders', icon: PieChart },
    { id: 'payouts', label: 'Gardener Payouts', icon: IndianRupee },
    { id: 'subscriptions', label: 'Subscriptions', icon: Crown },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'add-product', label: 'Add Product', icon: PlusCircle },
]

const PAGE_MAP = {
    dashboard: CrmDashboard,
    sales: CrmSales,
    payouts: CrmPayouts,
    subscriptions: CrmSubscriptions,
    products: CrmProductsPage,
    'add-product': CrmAddProductPage,
}

// ── CRM Shell ──────────────────────────────────────────────────────────────
const CrmShell = ({ onLogout }) => {
    const [active, setActive] = useState('dashboard')
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const navigate = (id) => { setActive(id); setSidebarOpen(false) }
    const ActivePage = PAGE_MAP[active] || CrmDashboard

    const Sidebar = ({ mobile = false }) => (
        <div className={`${mobile ? 'w-64' : 'hidden md:flex w-60'} flex-col bg-gradient-to-b from-[#0a2e18] to-[#14532d] min-h-screen flex-shrink-0`}>
            {/* Brand */}
            <div className="px-6 pt-7 pb-6 border-b border-white/10">
                <div className="flex items-center gap-2">
                    <img src="/as/logo.png" alt="" className="h-8 w-auto brightness-0 invert" onError={e => e.target.style.display = 'none'} />
                    <div>
                        <p className="text-white font-heading font-bold text-sm leading-none">O2need</p>
                        <p className="text-green-300 text-[10px] font-medium">Admin CRM</p>
                    </div>
                </div>
            </div>

            {/* Nav links */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {NAV.map(({ id, label, icon: Icon }) => (
                    <button key={id} onClick={() => navigate(id)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${active === id
                            ? 'bg-white/15 text-white'
                            : 'text-green-200 hover:bg-white/10 hover:text-white'
                            }`}>
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        {label}
                    </button>
                ))}
            </nav>

            {/* Footer */}
            <div className="px-3 pb-6 border-t border-white/10 pt-4 space-y-2">
                <a href="/" target="_blank" rel="noopener noreferrer"
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-green-200 hover:text-white hover:bg-white/10 rounded-xl text-sm font-medium transition-all">
                    <ExternalLink className="w-4 h-4" /> View Site
                </a>
                <button onClick={onLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-green-200 hover:text-white hover:bg-white/10 rounded-xl text-sm font-medium transition-all">
                    <LogOut className="w-4 h-4" /> Logout
                </button>
            </div>
        </div>
    )

    return (
        <div className="flex min-h-screen bg-[#f4f6f8]">
            {/* Desktop sidebar */}
            <Sidebar />

            {/* Mobile sidebar drawer */}
            {sidebarOpen && (
                <>
                    <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)} />
                    <div className="fixed left-0 top-0 bottom-0 z-50 md:hidden">
                        <Sidebar mobile />
                    </div>
                </>
            )}

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top bar */}
                <header className="bg-white border-b border-gray-100 sticky top-0 z-30 h-14 flex items-center px-5 gap-3">
                    <button className="md:hidden p-1.5 text-gray-500 hover:text-gray-800" onClick={() => setSidebarOpen(!sidebarOpen)}>
                        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                    <div className="flex items-center gap-2">
                        {NAV.find(n => n.id === active)?.icon && (() => { const Icon = NAV.find(n => n.id === active).icon; return <Icon className="w-4 h-4 text-[#14532d]" /> })()}
                        <h1 className="font-heading font-bold text-gray-900 text-sm">
                            {NAV.find(n => n.id === active)?.label}
                        </h1>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                        <span className="text-xs text-gray-400 hidden sm:block">O2need Control</span>
                        <button onClick={onLogout} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 font-medium">
                            <LogOut className="w-3.5 h-3.5" /> Logout
                        </button>
                    </div>
                </header>

                {/* Page */}
                <main className="flex-1 p-6">
                    <ActivePage />
                </main>
            </div>
        </div>
    )
}

// ── Root ───────────────────────────────────────────────────────────────────
const AdminPanel = () => {
    const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem('o2need-admin-auth') === '1')
    const onUnlock = () => { sessionStorage.setItem('o2need-admin-auth', '1'); setUnlocked(true) }
    const onLogout = () => { sessionStorage.removeItem('o2need-admin-auth'); setUnlocked(false) }
    return unlocked ? <CrmShell onLogout={onLogout} /> : <PasswordGate onUnlock={onUnlock} />
}

export default AdminPanel
