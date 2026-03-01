import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, CheckCircle2, Tag } from "lucide-react"

const slides = [
    {
        image: "/as/gardener1.png",
        showLogo: true,
        heading: "Starter Plan — ₹999/mo",
        tagline: "Clear air, Pure Life.",
        discount: "HUGE DISCOUNT - SAVE 30%!",
        points: [
            "2 Expert Visits per Month",
            "Plant Health Analysis & Soil Check",
            "Basic Cutting & Pruning",
            "Dry Leaf Removal & Watering",
            "Complete Site Cleaning",
        ],
    },
    {
        image: "/as/img2.png",
        showLogo: false,
        heading: "Standard Plan — ₹1199/mo",
        tagline: "Professional Care for Your Green Space.",
        discount: "MOST POPULAR - 40% OFF!",
        points: [
            "3 Expert Visits per Month",
            "Comprehensive Health & Soil Check",
            "Advanced Cutting & Pruning",
            "Dry Leaf Removal & Watering",
            "Deep Site Cleaning & Maintenance",
        ],
    },
    {
        image: "/as/img3.png",
        showLogo: false,
        heading: "Mission Organised Vision Jungle",
        tagline: "Clear air, Pure Life. Transform your environment.",
        discount: "PREMIUM INDOOR COLLECTION",
        points: [
            "Hand-picked for premium aesthetics",
            "Superior air-purifying varieties",
            "Expertly nurtured from seed to pot",
            "Delivered beautifully to your doorstep",
            "Enhance your living space instantly"
        ]
    }
]

const HeroCarousel = () => {
    const [current, setCurrent] = useState(0)

    // Auto-advance
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((c) => (c + 1) % slides.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [])

    const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length)
    const next = () => setCurrent((c) => (c + 1) % slides.length)

    return (
        <section className="relative h-[80vh] sm:h-[90vh] md:h-[95vh] overflow-hidden bg-[#14532d]">
            {slides.map((slide, i) => (
                <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}>
                    <img src={slide.image} alt={slide.heading} className="w-full h-full object-cover" />

                    {/* Replaced absolute dark overlay with a very subtle fade for text legibility */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />

                    <div className="absolute inset-0 flex items-center z-20 px-6 sm:px-12 md:px-20">
                        <div className="max-w-2xl text-white space-y-6 sm:space-y-8 p-8 sm:p-12 rounded-[2rem] bg-black/20 backdrop-blur-md border border-white/20 shadow-2xl transform transition-all">
                            {slide.showLogo && (
                                <img src="/as/logo.png" alt="O2need Logo" className="h-12 sm:h-16 mb-4 object-contain drop-shadow-lg" />
                            )}

                            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 rounded-full text-white font-bold text-sm sm:text-lg shadow-[0_0_20px_rgba(220,38,38,0.6)] animate-pulse border border-red-400 tracking-wide uppercase">
                                <Tag className="w-5 h-5" /> {slide.discount}
                            </div>

                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-black leading-tight text-white drop-shadow-xl">
                                {slide.heading.split('—')[0]}
                                <span className="block text-3xl sm:text-4xl mt-2 text-green-300">
                                    {slide.heading.split('—')[1] ? `— ${slide.heading.split('—')[1]}` : ''}
                                </span>
                            </h1>

                            <p className="text-xl sm:text-2xl text-green-50 font-medium italic drop-shadow-md">
                                "{slide.tagline}"
                            </p>

                            <div className="w-24 h-1.5 bg-green-500 rounded-full"></div>

                            <ul className="space-y-4 pt-2">
                                {slide.points.map((point, idx) => (
                                    <li key={idx} className="flex items-start gap-4 text-lg sm:text-xl text-white/95 font-medium drop-shadow-md">
                                        <CheckCircle2 className="w-7 h-7 text-green-400 flex-shrink-0 drop-shadow" />
                                        <span>{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation Buttons */}
            <button onClick={prev} className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-30 bg-black/20 hover:bg-black/40 backdrop-blur-md p-3 sm:p-4 rounded-full transition-all border border-white/30 text-white hover:scale-110">
                <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>
            <button onClick={next} className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-30 bg-black/20 hover:bg-black/40 backdrop-blur-md p-3 sm:p-4 rounded-full transition-all border border-white/30 text-white hover:scale-110">
                <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-3 bg-black/20 backdrop-blur px-4 py-2 rounded-full border border-white/10">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 ${i === current ? "w-10 sm:w-12 bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]" : "w-2.5 sm:w-3 bg-white/50 hover:bg-white/80"}`}
                        aria-label={`Go to slide ${i + 1}`}
                    />
                ))}
            </div>
        </section>
    )
}

export default HeroCarousel
