import { SignedIn, SignedOut, SignInButton, useUser, useClerk } from '@clerk/clerk-react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, Search, Sparkles, Crown, User, ShoppingBag, Heart, Bell, Settings, HelpCircle, LogOut, ChevronRight } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { allStaticProducts } from '../data/products'
import UserDropdown from './UserDropdown'
import CartIcon from './CartIcon'
import { useSubscription } from '../context/SubscriptionContext'

const Navbar = () => {
    const navigate = useNavigate()
    const { openModal, openPerksModal, userSubscription } = useSubscription()
    const { user } = useUser()
    const { signOut } = useClerk()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [showResults, setShowResults] = useState(false)
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
    const searchRef = useRef()
    const mobileInputRef = useRef()

    const handleSearch = (q) => {
        setSearchQuery(q)
        if (q.trim().length < 2) { setSearchResults([]); setShowResults(false); return }
        const results = allStaticProducts.filter(p =>
            p.name.toLowerCase().includes(q.toLowerCase()) ||
            p.description.toLowerCase().includes(q.toLowerCase())
        ).slice(0, 5)
        setSearchResults(results)
        setShowResults(true)
    }

    const handleSelect = (product) => {
        navigate(`/products/${product.id}`)
        setSearchQuery(''); setShowResults(false); setMobileSearchOpen(false)
    }

    const handleSubmit = (e) => { e.preventDefault(); if (searchResults.length > 0) handleSelect(searchResults[0]) }

    useEffect(() => {
        const handler = (e) => { if (searchRef.current && !searchRef.current.contains(e.target)) setShowResults(false) }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    useEffect(() => {
        if (mobileSearchOpen) setTimeout(() => mobileInputRef.current?.focus(), 100)
    }, [mobileSearchOpen])

    const SearchDropdown = () => (
        showResults && searchResults.length > 0 ? (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden z-[999]">
                {searchResults.map(p => (
                    <button key={p.id} onClick={() => handleSelect(p)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-green-50 transition-colors text-left">
                        <img src={p.image_url} alt={p.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                        <div className="min-w-0">
                            <p className="text-sm font-bold text-text truncate">{p.name}</p>
                            <p className="text-xs text-subtext">₹{p.price}</p>
                        </div>
                    </button>
                ))}
            </div>
        ) : null
    )

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex h-20 items-center gap-4">

                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0 flex items-center pr-4 sm:pr-10">
                        <style>{`
                            @keyframes textReveal {
                                0% { opacity: 0; transform: translateX(-15px); }
                                100% { opacity: 1; transform: translateX(0); }
                            }
                            .animate-text-reveal { 
                                animation: textReveal 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
                                animation-delay: 0.2s; 
                            }
                        `}</style>
                        <div className="w-14 sm:w-20 lg:w-24 shrink-0">
                            <img src="/as/logo.png" alt="O2" className="h-16 sm:h-20 w-auto object-contain drop-shadow-sm scale-[1.75] sm:scale-[2] origin-left ml-2 sm:ml-4" />
                        </div>
                        <span className="text-[#8B4513] font-heading font-black text-xl sm:text-2xl lg:text-3xl tracking-tighter animate-text-reveal opacity-0 mt-0.5 sm:mt-1 hover:scale-105 transition-transform">
                            need.com
                        </span>
                    </Link>

                    {/* Desktop Search Bar */}
                    <div ref={searchRef} className="hidden md:block flex-1 max-w-xs relative mx-4">
                        <form onSubmit={handleSubmit}>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-subtext pointer-events-none" />
                                <input
                                    type="text" value={searchQuery}
                                    onChange={e => handleSearch(e.target.value)}
                                    onFocus={() => searchResults.length > 0 && setShowResults(true)}
                                    placeholder="Search plants, fertilizers..."
                                    className="w-full pl-9 pr-4 py-2 text-sm bg-background border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-subtext"
                                />
                                {searchQuery && (
                                    <button type="button" onClick={() => { setSearchQuery(''); setShowResults(false) }} className="absolute right-3 top-1/2 -translate-y-1/2 text-subtext hover:text-text">
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                        </form>
                        <SearchDropdown />
                    </div>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center gap-6 text-sm font-medium flex-shrink-0">
                        <Link to="/" className="text-text hover:text-primary transition-colors">Home</Link>
                        <Link to="/plants" className="text-text hover:text-primary transition-colors">Plants</Link>
                        <Link to="/about" className="text-text hover:text-primary transition-colors">About</Link>
                        <Link to="/contact" className="text-text hover:text-primary transition-colors">Contact</Link>
                        {/* Subscribe / Membership Perks Button */}
                        {userSubscription ? (
                            <button
                                onClick={openPerksModal}
                                className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-[#22c55e] hover:from-amber-600 hover:to-[#16a34a] text-white text-sm font-semibold px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 active:scale-95"
                            >
                                <Crown className="w-4 h-4 fill-white" />
                                Membership Perks
                            </button>
                        ) : (
                            <button
                                onClick={openModal}
                                className="flex items-center gap-1.5 bg-gradient-to-r from-[#14532d] to-[#166534] hover:from-[#166534] hover:to-[#15803d] text-white text-sm font-semibold px-4 py-2 rounded-full shadow-md hover:shadow-lg hover:shadow-green-900/20 transition-all duration-300 active:scale-95"
                            >
                                <Sparkles className="w-4 h-4" />
                                Subscribe
                            </button>
                        )}
                    </div>

                    {/* Right Controls */}
                    <div className="flex items-center gap-2 ml-auto">
                        {/* Mobile Search Icon */}
                        <button className="md:hidden p-2 text-subtext hover:text-primary" onClick={() => { setMobileSearchOpen(!mobileSearchOpen); setIsMenuOpen(false) }}>
                            {mobileSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
                        </button>

                        {/* Cart Icon */}
                        <CartIcon />

                        {/* Auth */}
                        <div className="hidden md:flex items-center gap-2">
                            <SignedOut>
                                <SignInButton mode="modal">
                                    <button className="btn-primary py-2 px-5 text-sm">Login</button>
                                </SignInButton>
                            </SignedOut>
                            <SignedIn>
                                <UserDropdown />
                            </SignedIn>
                        </div>

                        {/* Mobile Hamburger */}
                        <button className="md:hidden p-2 text-text" onClick={() => { setIsMenuOpen(!isMenuOpen); setMobileSearchOpen(false) }}>
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Search Bar */}
            {mobileSearchOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3">
                    <div className="relative" ref={searchRef}>
                        <form onSubmit={handleSubmit}>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-subtext pointer-events-none" />
                                <input ref={mobileInputRef} type="text" value={searchQuery}
                                    onChange={e => handleSearch(e.target.value)}
                                    placeholder="Search plants, fertilizers..."
                                    className="w-full pl-9 pr-10 py-3 text-sm bg-background border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-subtext"
                                />
                                {searchQuery && (
                                    <button type="button" onClick={() => { setSearchQuery(''); setSearchResults([]); setShowResults(false) }} className="absolute right-3 top-1/2 -translate-y-1/2 text-subtext">
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </form>
                        {showResults && searchResults.length > 0 && (
                            <div className="mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden">
                                {searchResults.map(p => (
                                    <button key={p.id} onClick={() => handleSelect(p)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-green-50 transition-colors text-left">
                                        <img src={p.image_url} alt={p.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-text truncate">{p.name}</p>
                                            <p className="text-xs text-subtext">₹{p.price}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white py-4 px-4 space-y-4">
                    {[['/', 'Home'], ['/plants', 'Plants'], ['/fertilizers', 'Fertilizers'], ['/blogs', 'Blogs'], ['/about', 'About'], ['/contact', 'Contact']].map(([to, label]) => (
                        <Link key={to} to={to} className="block text-text font-medium" onClick={() => setIsMenuOpen(false)}>{label}</Link>
                    ))}
                    {/* Mobile Subscribe / Membership Perks Button */}
                    {userSubscription ? (
                        <button
                            onClick={() => { openPerksModal(); setIsMenuOpen(false) }}
                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-[#22c55e] hover:from-amber-600 hover:to-[#16a34a] text-white font-semibold py-3 rounded-xl shadow-md transition-all duration-300 active:scale-95"
                        >
                            <Crown className="w-4 h-4 fill-white" />
                            Membership Perks
                        </button>
                    ) : (
                        <button
                            onClick={() => { openModal(); setIsMenuOpen(false) }}
                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#14532d] to-[#166534] text-white font-semibold py-3 rounded-xl shadow-md transition-all duration-300 active:scale-95"
                        >
                            <Sparkles className="w-4 h-4" />
                            Subscribe
                        </button>
                    )}
                    <div className="pt-2 border-t border-gray-100">
                        <SignedOut>
                            <SignInButton mode="modal">
                                <button className="w-full btn-primary py-2 text-sm">Login</button>
                            </SignInButton>
                        </SignedOut>
                        <SignedIn>
                            {/* Mobile inline user menu — no nested floating dropdown */}
                            <div className="rounded-2xl border border-gray-100 overflow-hidden">
                                {/* User header */}
                                <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-gray-100">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-primary/20 overflow-hidden flex items-center justify-center flex-shrink-0">
                                        {user?.imageUrl
                                            ? <img src={user.imageUrl} alt={user.firstName} className="w-full h-full object-cover" />
                                            : <User className="w-5 h-5 text-primary" />
                                        }
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-bold text-text text-sm truncate">{user?.fullName || user?.firstName}</p>
                                        <p className="text-xs text-subtext truncate">{user?.primaryEmailAddress?.emailAddress}</p>
                                    </div>
                                </div>
                                {/* Nav links */}
                                {[
                                    { icon: User, label: 'My Profile', href: '/profile' },
                                    { icon: ShoppingBag, label: 'Order History', href: '/orders' },
                                    { icon: Heart, label: 'Wishlist', href: '/wishlist' },
                                    { icon: Bell, label: 'Notifications', href: '/notifications' },
                                    { icon: Settings, label: 'Settings', href: '/settings' },
                                    { icon: HelpCircle, label: 'Help & Support', href: '/contact' },
                                ].map(({ icon: Icon, label, href }) => (
                                    <Link key={href} to={href} onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center justify-between px-4 py-3 text-sm text-subtext hover:text-primary hover:bg-green-50 border-b border-gray-50 transition-colors">
                                        <span className="flex items-center gap-3">
                                            <Icon className="w-4 h-4" />{label}
                                        </span>
                                        <ChevronRight className="w-3.5 h-3.5" />
                                    </Link>
                                ))}
                                {/* Logout */}
                                <button onClick={() => { signOut(); setIsMenuOpen(false) }}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors font-medium">
                                    <LogOut className="w-4 h-4" /> Logout
                                </button>
                            </div>
                        </SignedIn>
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navbar
