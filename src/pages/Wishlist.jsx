import { Heart } from 'lucide-react'
import { allStaticProducts } from '../data/products'
import { useNavigate } from 'react-router-dom'

const Wishlist = () => {
    const navigate = useNavigate()
    // Show first 4 plants as mock wishlist
    const wishlistItems = allStaticProducts.slice(0, 4)

    return (
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-20 max-w-5xl">
            <div className="mb-10 space-y-2">
                <h1 className="text-4xl font-heading font-bold text-primary">Wishlist</h1>
                <div className="w-16 h-1.5 bg-secondary rounded-full" />
                <p className="text-subtext text-sm">Your saved plants and products.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {wishlistItems.map(p => (
                    <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group cursor-pointer" onClick={() => navigate(`/products/${p.id}`)}>
                        <div className="relative h-44 overflow-hidden">
                            <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <button className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full">
                                <Heart className="w-4 h-4 fill-red-400 text-red-400" />
                            </button>
                        </div>
                        <div className="p-4">
                            <p className="font-heading font-bold text-text text-sm truncate">{p.name}</p>
                            <p className="text-primary font-bold text-sm mt-1">₹{p.price}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Wishlist
