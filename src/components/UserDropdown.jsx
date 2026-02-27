import { useUser, useClerk } from '@clerk/clerk-react'
import { Link, useNavigate } from 'react-router-dom'
import {
    User, Settings, ShoppingBag, Heart, Bell,
    HelpCircle, LogOut, ChevronDown, LayoutDashboard
} from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

const menuItems = [
    { icon: User, label: 'My Profile', href: '/profile' },
    { icon: ShoppingBag, label: 'Order History', href: '/orders' },
    { icon: Heart, label: 'Wishlist', href: '/wishlist' },
    { icon: Bell, label: 'Notifications', href: '/notifications' },
    { icon: Settings, label: 'Settings', href: '/settings' },
    { icon: HelpCircle, label: 'Help & Support', href: '/contact' },
]

const UserDropdown = () => {
    const { user } = useUser()
    const { signOut } = useClerk()
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)
    const ref = useRef()
    const isAdmin = user?.primaryEmailAddress?.emailAddress === 'admin@o2need.com'

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    return (
        <div ref={ref} className="relative">
            {/* Trigger */}
            <button
                onClick={() => setOpen(!open)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-sm font-medium ${open ? 'bg-primary/10 text-primary' : 'hover:bg-gray-50 text-text'}`}
            >
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-primary/10 border-2 border-primary/20 overflow-hidden flex items-center justify-center flex-shrink-0">
                    {user?.imageUrl
                        ? <img src={user.imageUrl} alt={user.firstName} className="w-full h-full object-cover" />
                        : <User className="w-4 h-4 text-primary" />
                    }
                </div>
                <span className="hidden lg:block">
                    Welcome, <span className="font-bold text-primary">{user?.firstName || 'User'}</span>
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform text-subtext ${open ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Panel */}
            {open && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[999] max-h-[calc(100vh-80px)] overflow-y-auto">
                    {/* User Header */}
                    <div className="px-4 py-4 bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-primary/10 border-2 border-primary/20 overflow-hidden flex items-center justify-center flex-shrink-0">
                                {user?.imageUrl
                                    ? <img src={user.imageUrl} alt={user.firstName} className="w-full h-full object-cover" />
                                    : <User className="w-6 h-6 text-primary" />
                                }
                            </div>
                            <div className="min-w-0">
                                <p className="font-bold text-text text-sm truncate">{user?.fullName || user?.firstName}</p>
                                <p className="text-xs text-subtext truncate">{user?.primaryEmailAddress?.emailAddress}</p>
                            </div>
                        </div>
                    </div>

                    {/* Admin link */}
                    {isAdmin && (
                        <Link
                            to="/admin"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium bg-primary/5 text-primary hover:bg-primary/10 transition-colors border-b border-gray-100"
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            Admin Panel
                        </Link>
                    )}

                    {/* Menu Items */}
                    <div className="py-1">
                        {menuItems.map((item) => (
                            <Link
                                key={item.href}
                                to={item.href}
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-subtext hover:text-primary hover:bg-green-50 transition-colors"
                            >
                                <item.icon className="w-4 h-4 flex-shrink-0" />
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-100 p-2">
                        <button
                            onClick={() => { signOut(); setOpen(false) }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UserDropdown
