import Navbar from "../components/Navbar"
import SubNavbar from "../components/SubNavbar"
import SubscribeModal from "../components/SubscribeModal"
import ServiceDetailsModal from "../components/ServiceDetailsModal"
import SuccessModal from "../components/SuccessModal"
import MembershipPerksModal from "../components/MembershipPerksModal"
import FloatingWhatsApp from "../components/FloatingWhatsApp"
import { Outlet, Link } from "react-router-dom"
import { Leaf } from "lucide-react"

const MainLayout = () => (
    <div className="min-h-screen flex flex-col">
        <Navbar />
        <SubNavbar />
        <SubscribeModal />
        <ServiceDetailsModal />
        <SuccessModal />
        <MembershipPerksModal />
        <main className="flex-grow">
            <Outlet />
        </main>
        <footer className="bg-primary text-white mt-16 sm:mt-20">
            <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-12">
                    {/* Brand - full width on mobile */}
                    <div className="col-span-2">
                        <img src="/as/logo.png" alt="O2need" className="h-10 sm:h-12 w-auto object-contain brightness-200 mb-3" />
                        <p className="text-white/70 text-xs sm:text-sm leading-relaxed max-w-sm">
                            Bringing the beauty of nature into your workspace and home with our premium indoor plant collection.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-heading font-bold text-xs uppercase tracking-widest text-white/60 mb-4 sm:mb-6">Quick Links</h4>
                        <ul className="space-y-2.5 text-xs sm:text-sm">
                            {[['/', 'Home'], ['/products', 'Products'], ['/about', 'About Us'], ['/contact', 'Contact Us']].map(([to, label]) => (
                                <li key={to}><Link to={to} className="text-white/80 hover:text-white transition-colors">{label}</Link></li>
                            ))}
                        </ul>
                    </div>

                    {/* Policies */}
                    <div>
                        <h4 className="font-heading font-bold text-xs uppercase tracking-widest text-white/60 mb-4 sm:mb-6">Policies</h4>
                        <ul className="space-y-2.5 text-xs sm:text-sm">
                            {['Privacy Policy', 'Return & Refund', 'Shipping Policy', 'Terms of Service'].map(label => (
                                <li key={label}><Link to="/policy" className="text-white/80 hover:text-white transition-colors">{label}</Link></li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
                    <p>© {new Date().getFullYear()} O2need. All rights reserved.</p>
                    <div className="flex items-center gap-2">
                        <Leaf className="w-3.5 h-3.5 text-secondary" />
                        <span>Sustainably sourced, lovingly delivered.</span>
                    </div>
                </div>
            </div>
        </footer>
        <FloatingWhatsApp />
    </div>
)

export default MainLayout
