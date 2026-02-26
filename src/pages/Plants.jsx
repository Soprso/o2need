import { useNavigate } from 'react-router-dom'
import { staticPlants } from '../data/products'
import { Leaf } from 'lucide-react'

const Plants = () => {
    const navigate = useNavigate()
    const categories = [
        { key: 'indoor', label: 'Indoor Plants' },
        { key: 'airpurifying', label: 'Air Purifying Plants' },
        { key: 'succulent', label: 'Succulents & Cacti' },
    ]

    return (
        <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-24">
            <div className="text-center mb-12 space-y-3">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm">
                    <Leaf className="w-4 h-4" /> Our Plant Collection
                </div>
                <h1 className="text-4xl sm:text-5xl font-heading font-bold text-text">All Plants</h1>
                <div className="w-16 h-1.5 bg-secondary rounded-full mx-auto" />
                <p className="text-subtext max-w-xl mx-auto text-sm sm:text-base">
                    Hand-picked, quality-checked, and delivered with care. Every plant is a statement of life.
                </p>
            </div>

            {categories.map(cat => {
                const items = staticPlants.filter(p => p.category === cat.key)
                if (!items.length) return null
                return (
                    <div key={cat.key} className="mb-16">
                        <div className="flex items-center gap-4 mb-8">
                            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-text">{cat.label}</h2>
                            <div className="flex-1 h-px bg-gray-100" />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                            {items.map(p => (
                                <div key={p.id} className="premium-card group overflow-hidden cursor-pointer" onClick={() => navigate(`/products/${p.id}`)}>
                                    <div className="relative h-48 sm:h-60 overflow-hidden">
                                        <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-xs font-bold text-primary shadow-sm">₹{p.price}</div>
                                    </div>
                                    <div className="p-4 sm:p-5">
                                        <h3 className="font-heading font-bold text-text text-sm sm:text-base mb-1">{p.name}</h3>
                                        <p className="text-subtext text-xs sm:text-sm line-clamp-2 mb-3">{p.description}</p>
                                        <button className="w-full btn-primary text-xs sm:text-sm py-2">View Details</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default Plants
