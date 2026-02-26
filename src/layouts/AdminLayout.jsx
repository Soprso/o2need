import { Link, Outlet, useLocation } from "react-router-dom"
import { LayoutDashboard, PlusCircle, Home, LogOut, ChevronRight } from "lucide-react"

const AdminLayout = () => {
    const location = useLocation()

    const menuItems = [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
        { label: 'Add Product', icon: PlusCircle, path: '/admin/add' },
        { label: 'View Site', icon: Home, path: '/' },
    ]

    return (
        <div className="flex min-h-screen bg-[#f9fafb]">
            {/* Sidebar */}
            <aside className="w-64 bg-primary text-white hidden md:block">
                <div className="p-8">
                    <Link to="/admin" className="text-2xl font-heading font-bold">Admin Panel</Link>
                </div>
                <nav className="mt-4 px-4 space-y-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === item.path
                                    ? 'bg-secondary text-white'
                                    : 'hover:bg-primary/80 text-gray-200'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
                <header className="bg-white h-20 border-b border-gray-100 flex items-center px-8">
                    <h2 className="text-xl font-heading font-bold text-text">
                        {menuItems.find(item => item.path === location.pathname)?.label || 'Admin'}
                    </h2>
                </header>
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}

export default AdminLayout
