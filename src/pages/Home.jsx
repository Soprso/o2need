import { useState, useEffect } from "react"
import { productService } from "../services/productService"
import ProductCard from "../components/ProductCard"
import HeroCarousel from "../components/HeroCarousel"
import GardenAwareness from "../components/GardenAwareness"
import FAQ from "../components/FAQ"
import { Leaf, ShieldCheck, Truck, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import { allStaticProducts } from "../data/products"

const Home = () => {
    const [dbProducts, setDbProducts] = useState([])
    const [loading, setLoading] = useState(true)

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

    // Show DB products if available, else show static catalog
    const displayProducts = dbProducts.length > 0 ? dbProducts : allStaticProducts

    return (
        <div>
            <HeroCarousel />

            {/* Features Strip */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
                    {[
                        { icon: Leaf, title: "Eco Friendly", desc: "100% organic soil and sustainable packaging." },
                        { icon: Truck, title: "Fast Delivery", desc: "Carefully packed and delivered within 48 hours." },
                        { icon: ShieldCheck, title: "Quality Check", desc: "Every plant passes a 5-point health check." }
                    ].map((f, i) => (
                        <div key={i} className="flex flex-col items-center text-center space-y-3">
                            <div className="bg-background p-4 rounded-2xl border border-gray-100">
                                <f.icon className="w-7 h-7 text-primary" />
                            </div>
                            <h3 className="text-lg font-heading font-bold text-text">{f.title}</h3>
                            <p className="text-subtext text-sm max-w-xs">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Featured Collection */}
            <section className="py-16 bg-background" id="products">
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
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
                            {displayProducts.slice(0, 8).map(p => <ProductCard key={p.id} product={p} />)}
                        </div>
                    )}
                </div>
            </section>

            {/* Fertilizers Featured */}
            <section className="py-16 bg-white">
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
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                        {allStaticProducts.filter(p => p.category === 'fertilizer').map(p => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                </div>
            </section>

            <GardenAwareness />
            <FAQ />
        </div>
    )
}

export default Home
