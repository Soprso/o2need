import { useNavigate } from 'react-router-dom'
import { staticFertilizers } from '../data/products'
import { Sprout } from 'lucide-react'

const tips = [
    { emoji: '💧', title: 'Always water first', desc: 'Never apply fertilizer to dry soil — always water your plant first to protect roots.' },
    { emoji: '📅', title: 'Fertilize seasonally', desc: 'Spring and summer are growing seasons. Reduce or stop fertilizing in winter.' },
    { emoji: '⚗️', title: 'Less is more', desc: 'Over-fertilizing causes salt build-up and leaf burn. When in doubt, dilute more.' },
    { emoji: '🌡️', title: 'Check the label', desc: 'Always follow recommended dosage on the packaging for best and safe results.' },
]

const Fertilizers = () => {
    const navigate = useNavigate()

    return (
        <div>
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-primary to-[#1a6b38] text-white py-16 sm:py-20 px-6">
                <div className="container mx-auto max-w-3xl text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-medium border border-white/30">
                        <Sprout className="w-4 h-4" /> Nutrient Range
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-heading font-bold">Fertilizers & Nutrients</h1>
                    <p className="text-white/80 text-sm sm:text-base leading-relaxed">
                        Give your plants the nutrition they deserve. Our curated range of organic and mineral fertilizers supports healthy growth at every stage.
                    </p>
                </div>
            </div>

            {/* Products */}
            <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-20 max-w-6xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {staticFertilizers.map(f => (
                        <div key={f.id} className="premium-card group overflow-hidden cursor-pointer" onClick={() => navigate(`/products/${f.id}`)}>
                            <div className="relative h-48 sm:h-52 overflow-hidden">
                                <img src={f.image_url} alt={f.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute top-3 right-3 bg-primary text-white px-2.5 py-1 rounded-full text-xs font-bold shadow">₹{f.price}</div>
                            </div>
                            <div className="p-5">
                                <h3 className="font-heading font-bold text-text text-sm sm:text-base mb-2">{f.name}</h3>
                                <p className="text-subtext text-xs sm:text-sm line-clamp-3 mb-4">{f.description}</p>
                                <button className="w-full btn-primary py-2 text-xs sm:text-sm">View Details</button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tips */}
                <div className="mt-20">
                    <h2 className="text-2xl sm:text-3xl font-heading font-bold text-text mb-8 text-center">Fertilizing Tips</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {tips.map((tip, i) => (
                            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 text-center shadow-sm space-y-3">
                                <div className="text-4xl">{tip.emoji}</div>
                                <h3 className="font-heading font-bold text-text text-sm">{tip.title}</h3>
                                <p className="text-subtext text-xs leading-relaxed">{tip.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Fertilizers
