import { useNavigate } from "react-router-dom"

const ProductCard = ({ product }) => {
    const navigate = useNavigate()
    return (
        <div className="premium-card group overflow-hidden">
            <div className="relative h-44 sm:h-64 overflow-hidden">
                <img
                    src={product.image_url || 'https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=1000&auto=format&fit=crop'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Coming Soon badge */}
                <div className="absolute top-3 left-3">
                    <span className="bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-sm tracking-wide uppercase">
                        Coming Soon
                    </span>
                </div>
                <div className="absolute top-3 right-3">
                    <span className="bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-xs font-bold text-primary shadow-sm">
                        ₹{product.price}
                    </span>
                </div>
            </div>
            <div className="p-4 sm:p-6">
                <h3 className="text-sm sm:text-base font-heading font-bold text-text mb-1.5 truncate">{product.name}</h3>
                <p className="text-subtext text-xs sm:text-sm mb-4 line-clamp-2">{product.description || 'Premium indoor plant.'}</p>
                <button
                    onClick={() => navigate(`/products/${product.id}`)}
                    className="w-full btn-primary text-xs sm:text-sm py-2"
                >
                    View Details
                </button>
            </div>
        </div>
    )
}

export default ProductCard
