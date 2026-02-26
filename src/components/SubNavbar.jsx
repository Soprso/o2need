import { useState, useRef, useEffect } from 'react'
import { ChevronDown, X, Menu } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const menuItems = [
    {
        label: 'Gardening Services',
        items: [
            { label: 'Garden Design', href: '#' },
            { label: 'Plant Installation', href: '#' },
            { label: 'Garden Maintenance', href: '#' },
            { label: 'Soil Treatment', href: '#' },
            { label: 'Pest Control', href: '#' },
        ],
    },
    {
        label: 'Plants',
        items: [
            { label: 'Indoor Plants', href: '/plants' },
            { label: 'Outdoor Plants', href: '/plants' },
            { label: 'Succulents & Cacti', href: '/plants' },
            { label: 'Air Purifying Plants', href: '/plants' },
            { label: 'Rare Varieties', href: '/plants' },
        ],
    },
    {
        label: 'Fertilizers',
        items: [
            { label: 'Organic Compost', href: '/fertilizers' },
            { label: 'Liquid Fertilizers', href: '/fertilizers' },
            { label: 'Slow Release Granules', href: '/fertilizers' },
            { label: 'Seaweed Extract', href: '/fertilizers' },
            { label: 'Soil Conditioners', href: '/fertilizers' },
        ],
    },
    {
        label: 'Reviews',
        items: [
            { label: 'Customer Reviews', href: '#' },
            { label: 'Plant Care Tips', href: '/blogs' },
            { label: 'Success Stories', href: '#' },
            { label: 'Expert Advice', href: '/blogs' },
        ],
    },
    {
        label: 'Blogs',
        items: [
            { label: 'Beginner Guides', href: '/blogs/beginners-guide' },
            { label: 'Plant Parent Tips', href: '/blogs/plant-parent-tips' },
            { label: 'Seasonal Care', href: '/blogs/seasonal-care' },
            { label: 'Trending Plants', href: '/blogs/trending-plants' },
            { label: 'DIY Planters', href: '/blogs/diy-planters' },
        ],
    },
]

const DropdownMenu = ({ item }) => {
    const [open, setOpen] = useState(false)
    const ref = useRef()
    const navigate = useNavigate()

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    return (
        <div ref={ref} className="relative flex-shrink-0">
            <button
                onClick={() => setOpen(!open)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${open ? 'text-white bg-white/20' : 'text-white/90 hover:text-white hover:bg-white/10'}`}
            >
                {item.label}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && (
                <div className="absolute top-full left-0 mt-2 w-52 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-[999]">
                    {item.items.map((sub) => (
                        <a
                            key={sub.label}
                            href={sub.href}
                            className="block px-4 py-2.5 text-sm text-subtext hover:text-primary hover:bg-green-50 transition-colors font-medium"
                            onClick={(e) => {
                                setOpen(false)
                                if (sub.href !== '#') { e.preventDefault(); navigate(sub.href) }
                            }}
                        >
                            {sub.label}
                        </a>
                    ))}
                </div>
            )}
        </div>
    )
}

const SubNavbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false)
    const [mobileExpanded, setMobileExpanded] = useState(null)
    const navigate = useNavigate()

    return (
        <>
            {/* Desktop */}
            <div className="bg-primary sticky top-20 z-40 shadow-md hidden md:block">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex items-center gap-1 py-2 overflow-visible">
                        {menuItems.map((item) => (
                            <DropdownMenu key={item.label} item={item} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Mobile */}
            <div className="bg-primary sticky top-20 z-40 shadow-md md:hidden">
                <div className="flex items-center justify-between px-4 py-2.5">
                    <span className="text-white text-sm font-semibold">Browse Categories</span>
                    <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white p-1">
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
                {mobileOpen && (
                    <div className="bg-[#0f3d21] border-t border-white/10 px-4 py-3 space-y-1">
                        {menuItems.map((item) => (
                            <div key={item.label}>
                                <button
                                    onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}
                                    className="w-full flex justify-between items-center py-2.5 text-white/90 text-sm font-medium"
                                >
                                    {item.label}
                                    <ChevronDown className={`w-4 h-4 transition-transform ${mobileExpanded === item.label ? 'rotate-180' : ''}`} />
                                </button>
                                {mobileExpanded === item.label && (
                                    <div className="bg-white/10 rounded-lg px-3 py-2 mb-2 space-y-1">
                                        {item.items.map((sub) => (
                                            <a
                                                key={sub.label}
                                                href={sub.href}
                                                className="block py-1.5 text-sm text-white/70 hover:text-white transition-colors"
                                                onClick={(e) => {
                                                    setMobileOpen(false)
                                                    if (sub.href !== '#') { e.preventDefault(); navigate(sub.href) }
                                                }}
                                            >
                                                {sub.label}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}

export default SubNavbar
