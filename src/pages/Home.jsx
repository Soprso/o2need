import { useState, useEffect } from "react"
import { productService } from "../services/productService"
import ProductCard from "../components/ProductCard"
import HeroCarousel from "../components/HeroCarousel"
import WhyO2need from "../components/home/WhyO2need"
import GardenAwareness from "../components/GardenAwareness"
import LeafLoader from "../components/LeafLoader"
import FAQ from "../components/FAQ"
import { AnimatePresence, motion } from "framer-motion"
import { Leaf, ShieldCheck, Truck, ArrowRight, Phone, Tag, Gift } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { allStaticProducts } from "../data/products"
import { gardeningServices } from "../data/gardeningServices"
import { useUser } from "@clerk/clerk-react"
import { useSubscription } from "../context/SubscriptionContext"

const Home = () => {
    const [pageLoad, setPageLoad] = useState(true)
    const [dbProducts, setDbProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const { isSignedIn } = useUser()
    const { userSubscription, visitsLeft } = useSubscription()

    useEffect(() => { fetchProducts() }, [])

    const fetchProducts = async () => {
        try {
            const data = await productService.getProducts()
            setDbProducts(data)
        } catch {
            // Database not configured yet — fall back to static
        } finally {
            setLoading(false)
        }
    }

    const displayProducts = dbProducts.length > 0 ? dbProducts : allStaticProducts

    return (
        <div>
            <AnimatePresence>
                {pageLoad && <LeafLoader onComplete={() => setPageLoad(false)} />}
            </AnimatePresence>

            <HeroCarousel />

            <WhyO2need />

            {/* Gardening Services */}
            <section className="py-16 bg-background">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
                        <div className="space-y-3">
                            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-text">Gardening Services</h2>
                            <div className="w-16 h-1.5 bg-secondary rounded-full"></div>
                            <p className="text-subtext text-sm max-w-lg">Professional garden care at your doorstep — from setup to maintenance.</p>
                        </div>
                        <Link to="/services/setup-new-garden" className="text-primary font-bold flex items-center gap-2 hover:gap-3 transition-all text-sm flex-shrink-0">
                            View All Services <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, staggerChildren: 0.1 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
                    >
                        {gardeningServices.map(service => {
                            const isMaintain = service.id === 'maintain-existing-garden'
                            const showFree = isMaintain && isSignedIn && !!userSubscription
                            return (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    key={service.id}
                                    onClick={() => navigate(service.slug)}
                                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                                >
                                    <div className="relative overflow-hidden h-44 sm:h-52">
                                        <img src={service.images[0]} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        {/* Discount tag — hidden for subscribed users on maintain card */}
                                        {!showFree && (
                                            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                                                <Tag className="w-3 h-3" /> {service.discount}
                                            </div>
                                        )}
                                        {/* FREE badge for members */}
                                        {showFree && (
                                            <div className="absolute top-3 left-3 bg-[#14532d] text-white text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                                                <Gift className="w-3 h-3" /> FREE for Members
                                            </div>
                                        )}
                                        {/* FREE for Subscribers promo tag — shown to non-members on maintain card */}
                                        {isMaintain && !showFree && (
                                            <div className="absolute top-3 right-3 bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm leading-tight text-center">
                                                FREE for<br />Subscribers
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-5 space-y-3">
                                        <h3 className="font-heading font-bold text-text text-base leading-snug group-hover:text-primary transition-colors">{service.title}</h3>
                                        <p className="text-subtext text-xs leading-relaxed line-clamp-2">{service.tagline}</p>
                                        {/* Price row — show FREE + visits for members, normal price otherwise */}
                                        {showFree ? (
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-[#14532d] font-heading font-bold text-lg">FREE</span>
                                                <span className="text-xs text-[#14532d] font-medium">{visitsLeft} visit{visitsLeft !== 1 ? 's' : ''} remaining</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-primary font-bold text-lg">₹{service.price.toLocaleString()}</span>
                                                    <span className="text-subtext text-xs line-through">₹{service.originalPrice.toLocaleString()}</span>
                                                </div>
                                                <span className="text-[10px] font-bold text-red-500 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">
                                                    Save ₹{(service.originalPrice - service.price).toLocaleString()}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex gap-2 pt-1">
                                            <button
                                                onClick={e => { e.stopPropagation(); window.location.href = 'tel:+918585003674' }}
                                                className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${showFree
                                                    ? 'bg-[#14532d] hover:bg-[#166534] text-white'
                                                    : 'bg-primary hover:bg-secondary text-white'
                                                    }`}
                                            >
                                                <Phone className="w-3.5 h-3.5" />
                                                {showFree ? 'Book a Visit' : 'Book Now'}
                                            </button>
                                            <button className="flex-1 border border-primary text-primary py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-primary/5 transition-all">
                                                Learn More <ArrowRight className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </motion.div>
                </div>
            </section>

            {/* Featured Collection */}
            <section className="py-16 bg-white" id="products">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
                        <div className="space-y-3">
                            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-text">Our Featured Collection</h2>
                            <div className="w-16 h-1.5 bg-secondary rounded-full"></div>
                        </div>
                        <Link to="/plants" className="text-primary font-bold flex items-center gap-2 hover:gap-3 transition-all text-sm">
                            View All Plants <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
                            {[1, 2, 3, 4].map(n => <div key={n} className="h-64 sm:h-96 bg-white rounded-xl animate-pulse" />)}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6 }}
                            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8"
                        >
                            {displayProducts.slice(0, 8).map(p => <ProductCard key={p.id} product={p} />)}
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Fertilizers Featured */}
            <section className="py-16 bg-background">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
                        <div className="space-y-3">
                            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-text">Fertilizers & Nutrients</h2>
                            <div className="w-16 h-1.5 bg-accent rounded-full"></div>
                        </div>
                        <Link to="/fertilizers" className="text-primary font-bold flex items-center gap-2 hover:gap-3 transition-all text-sm">
                            View All <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
                    >
                        {allStaticProducts.filter(p => p.category === 'fertilizer').map(p => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Features Strip */}
            <section className="py-16 bg-white">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, staggerChildren: 0.1 }}
                    className="container mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12"
                >
                    {[
                        { icon: Leaf, title: "Eco Friendly", desc: "100% organic soil and sustainable packaging." },
                        { icon: Truck, title: "Fast Delivery", desc: "Carefully packed and delivered within 48 hours." },
                        { icon: ShieldCheck, title: "Quality Check", desc: "Every plant passes a 5-point health check." }
                    ].map((f, i) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            key={i} className="flex flex-col items-center text-center space-y-3"
                        >
                            <div className="bg-background p-4 rounded-2xl border border-gray-100">
                                <f.icon className="w-7 h-7 text-primary" />
                            </div>
                            <h3 className="text-lg font-heading font-bold text-text">{f.title}</h3>
                            <p className="text-subtext text-sm max-w-xs">{f.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            <GardenAwareness />
            <FAQ />
        </div>
    )
}

export default Home
