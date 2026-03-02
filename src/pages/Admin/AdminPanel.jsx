import { useState } from 'react'
import {
    Lock, Eye, EyeOff, LayoutDashboard, Crown,
    Package, PlusCircle, LogOut, Menu, X, AlertTriangle, ExternalLink,
    PieChart, IndianRupee, ClipboardList, ShieldCheck, Mail, ArrowRight
} from 'lucide-react'
import { useUser, UserButton, SignInButton, useClerk } from '@clerk/clerk-react'
import CrmDashboard from './CrmDashboard'
import CrmSubscriptions from './CrmSubscriptions'
import CrmProductsPage from './CrmProducts'
import CrmAddProductPage from './CrmAddProduct'
import CrmSales from './CrmSales'
import CrmPayouts from './CrmPayouts'
import CrmTodosContainer from './CrmTodosContainer'

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

// ── Clerk Login Gate ───────────────────────────────────────────────────────
const ClerkLoginGate = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a2e18] via-[#14532d] to-[#0a2e18] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
                <div className="bg-gradient-to-br from-[#14532d] to-[#166634] px-8 pt-10 pb-12 text-center relative overflow-hidden">
                    <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/5" />
                    <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-black/10" />
                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <ShieldCheck className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="font-heading text-2xl font-bold text-white mb-1">Admin Access</h1>
                    <p className="text-green-200 text-sm">Step 1: Identity Verification</p>
                </div>
                <div className="px-8 py-10 text-center">
                    <div className="mb-8">
                        <div className="flex justify-center mb-4">
                            <div className="flex -space-x-2">
                                <div className="w-10 h-10 rounded-full border-2 border-white bg-green-100 flex items-center justify-center"><Mail className="w-5 h-5 text-green-700" /></div>
                                <div className="w-10 h-10 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center">
                                    <img src="/as/logo.png" alt="" className="w-6 h-6 grayscale opacity-80" onError={e => e.target.style.display = 'none'} />
                                </div>
                            </div>
                        </div>
                        <h2 className="text-gray-800 font-bold text-lg mb-2">Secure Gateway</h2>
                        <p className="text-gray-500 text-xs leading-relaxed px-4">
                            Log in with your administrator account to access the O2need Control Center.
                        </p>
                    </div>

                    <SignInButton mode="modal" forceRedirectUrl="/o2need-control">
                        <button className="w-full bg-white hover:bg-gray-50 text-gray-700 font-bold py-3.5 px-6 rounded-xl border border-gray-200 transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-3">
                            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Sign in with Google
                        </button>
                    </SignInButton>

                    <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400 font-medium">
                        <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Encrypted Access</span>
                        <span>O2need © 2025</span>
                    </div>
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
    { id: 'todos', label: 'To-Do List', icon: ClipboardList },
]

const PAGE_MAP = {
    dashboard: CrmDashboard,
    sales: CrmSales,
    payouts: CrmPayouts,
    subscriptions: CrmSubscriptions,
    products: CrmProductsPage,
    'add-product': CrmAddProductPage,
    todos: CrmTodosContainer,
}

// ── CRM Shell ──────────────────────────────────────────────────────────────
const CrmShell = ({ onLogout }) => {
    const { user } = useUser()
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

            {/* User Presence in Sidebar Footer */}
            <div className="px-5 pb-4 space-y-3">
                <div className="flex items-center gap-3 px-1">
                    <UserButton afterSignOutUrl="/" />
                    <div className="min-w-0">
                        <p className="text-white text-xs font-bold truncate">{user?.fullName || 'Admin User'}</p>
                        <p className="text-green-300 text-[9px] truncate">{user?.primaryEmailAddress?.emailAddress}</p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="px-3 pb-6 border-t border-white/10 pt-4 space-y-2">
                <a href="/" target="_blank" rel="noopener noreferrer"
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-green-200 hover:text-white hover:bg-white/10 rounded-xl text-sm font-medium transition-all">
                    <ExternalLink className="w-4 h-4" /> View Site
                </a>
                <button onClick={onLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-green-200 hover:text-white hover:bg-white/10 rounded-xl text-sm font-medium transition-all">
                    <LogOut className="w-4 h-4" /> Logout Admin
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
                    <div className="ml-auto flex items-center gap-4">
                        <span className="text-xs text-gray-400 hidden lg:block">O2need Control Center</span>
                        <div className="h-6 w-[1px] bg-gray-200 hidden lg:block" />
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-500 font-medium hidden sm:block truncate max-w-[100px]">{user?.firstName}</span>
                            <UserButton afterSignOutUrl="/" />
                        </div>
                    </div>
                </header>

                {/* Page */}
                <main className="flex-1 p-6">
                    <ActivePage user={user} />
                </main>
            </div>
        </div>
    )
}

// ── Root ───────────────────────────────────────────────────────────────────
const AdminPanel = () => {
    const { isLoaded, isSignedIn } = useUser()
    const { signOut } = useClerk()
    const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem('o2need-admin-auth') === '1')

    if (!isLoaded) return (
        <div className="min-h-screen bg-[#0a2e18] flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
        </div>
    )

    if (!isSignedIn) return <ClerkLoginGate />

    const onUnlock = () => { sessionStorage.setItem('o2need-admin-auth', '1'); setUnlocked(true) }
    const onLogout = async () => {
        sessionStorage.removeItem('o2need-admin-auth')
        setUnlocked(false)
        await signOut({ redirectUrl: '/o2need-control' })
    }

    return unlocked ? <CrmShell onLogout={onLogout} /> : <PasswordGate onUnlock={onUnlock} />
}

export default AdminPanel
