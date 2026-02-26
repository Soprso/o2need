import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useUser, useClerk } from "@clerk/clerk-react"
import { productService } from "../services/productService"
import { allStaticProducts } from "../data/products"
import { useCart } from "../context/CartContext"
import { ArrowLeft, Droplets, Sun, Wind, IndianRupee, ShoppingCart, Zap, LogIn } from "lucide-react"

const ProductDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { isSignedIn } = useUser()
    const { openSignIn } = useClerk()
    const { addToCart } = useCart()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [added, setAdded] = useState(false)

    useEffect(() => {
        const staticProduct = allStaticProducts.find(p => p.id === id)
        if (staticProduct) { setProduct(staticProduct); setLoading(false); return }
        productService.getProductById(id).then(setProduct).catch(console.error).finally(() => setLoading(false))
    }, [id])

    const handleAddToCart = () => {
        if (!isSignedIn) { openSignIn(); return }
        addToCart(product)
        setAdded(true)
        setTimeout(() => setAdded(false), 2000)
    }

    const handleBuyNow = () => {
        if (!isSignedIn) { openSignIn(); return }
        addToCart(product)
        navigate('/checkout')
    }

    if (loading) return <div className="h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary"></div></div>
    if (!product) return <div className="h-screen flex items-center justify-center text-subtext">Product not found</div>

    return (
        <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-12">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-subtext hover:text-primary mb-8 transition-colors font-medium text-sm">
                <ArrowLeft className="w-4 h-4" /> Back
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-16">
                <div>
                    <img src={product.image_url} alt={product.name} className="w-full rounded-2xl sm:rounded-3xl shadow-xl object-cover h-72 sm:h-[500px] md:h-[600px]" />
                </div>

                <div className="space-y-6 sm:space-y-8">
                    <div className="space-y-3">
                        <h1 className="text-3xl sm:text-5xl font-heading font-bold text-text leading-tight">{product.name}</h1>
                        <div className="flex items-center gap-1.5 text-2xl sm:text-3xl font-bold text-primary">
                            <IndianRupee className="w-6 h-6" /> <span>{product.price}</span>
                        </div>
                        <p className="text-base sm:text-lg text-subtext leading-relaxed">{product.description}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-3 sm:gap-6">
                        {[{ icon: Droplets, label: "Weekly", sub: "Water" }, { icon: Sun, label: "Indirect", sub: "Light" }, { icon: Wind, label: "Moderate", sub: "Humidity" }].map((c, i) => (
                            <div key={i} className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm text-center space-y-1.5">
                                <c.icon className="w-6 h-6 sm:w-8 sm:h-8 mx-auto text-secondary" />
                                <p className="font-bold text-xs sm:text-sm">{c.label}</p>
                                <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-subtext font-bold">{c.sub}</p>
                            </div>
                        ))}
                    </div>

                    {/* Login nudge for guests */}
                    {!isSignedIn && (
                        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm">
                            <LogIn className="w-5 h-5 text-amber-500 flex-shrink-0" />
                            <div>
                                <p className="font-bold text-amber-700">Login required to purchase</p>
                                <p className="text-amber-600 text-xs">Sign in with Google or your email to place an order.</p>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={handleBuyNow}
                            className="w-full bg-primary text-white py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-secondary transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            <Zap className="w-5 h-5" /> Buy Now
                        </button>
                        <button
                            onClick={handleAddToCart}
                            className={`w-full border-2 py-4 rounded-xl font-bold text-base sm:text-lg transition-all flex items-center justify-center gap-2 ${added ? 'border-secondary bg-secondary/10 text-secondary' : 'border-primary text-primary hover:bg-primary/5'}`}
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {added ? '✓ Added to Cart' : 'Add to Cart'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetails
