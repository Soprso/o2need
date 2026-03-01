import { useState } from "react"
import { ChevronLeft, ChevronRight, CheckCircle2, Tag } from "lucide-react"
import { useSubscription } from "../context/SubscriptionContext"

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
    const { openModal } = useSubscription()

    const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length)
    const next = () => setCurrent((c) => (c + 1) % slides.length)

    return (
        <section className="relative h-[80vh] sm:h-[90vh] md:h-[95vh] overflow-hidden bg-black">
            {slides.map((slide, i) => (
                <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}>

                    {/* Fullscreen Image Background on both mobile and desktop */}
                    <img src={slide.image} alt={slide.heading} className="absolute inset-0 w-full h-full object-cover object-center" />

                    {/* Subtle fade overlay - darker at bottom for text readability on mobile */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 sm:via-transparent to-transparent pointer-events-none" />

                    {/* Content container - pushed to bottom on mobile, absolute center on desktop */}
                    <div className="absolute inset-0 flex flex-col justify-end sm:justify-center z-20 px-4 pb-12 sm:pb-0 sm:px-12 md:px-20">
                        <div
                            onClick={openModal}
                            className="w-full sm:max-w-2xl text-white space-y-2 sm:space-y-8 p-4 sm:p-12 rounded-2xl sm:rounded-[2rem] bg-black/40 sm:bg-black/20 backdrop-blur-md border border-white/20 shadow-2xl transform transition-all cursor-pointer hover:bg-black/50 sm:hover:bg-black/30 mb-2 sm:mb-0"
                        >

                            {/* Logo - Hide on mobile to save space and keep it clean */}
                            {slide.showLogo && (
                                <img src="/as/logo.png" alt="O2need Logo" className="hidden sm:block h-10 sm:h-16 mb-2 sm:mb-4 object-contain drop-shadow-lg" />
                            )}

                            {/* Discount Tag */}
                            <div className="inline-flex items-center gap-1 sm:gap-2 px-2.5 sm:px-5 py-1 sm:py-2.5 bg-red-600 rounded-full text-white font-bold text-[10px] sm:text-lg shadow-[0_0_20px_rgba(220,38,38,0.6)] animate-pulse border border-red-400 tracking-wide uppercase">
                                <Tag className="w-3 h-3 sm:w-5 sm:h-5" /> {slide.discount}
                            </div>

                            {/* Heading */}
                            <h1 className="text-[20px] leading-tight sm:text-5xl md:text-6xl font-heading font-black sm:leading-tight text-white drop-shadow-xl mt-1 sm:mt-0">
                                {slide.heading.split('—')[0]}
                                <span className="block text-sm sm:text-4xl mt-0.5 sm:mt-2 text-green-300">
                                    {slide.heading.split('—')[1] ? `— ${slide.heading.split('—')[1]}` : ''}
                                </span>
                            </h1>

                            {/* Tagline */}
                            <p className="text-xs sm:text-2xl text-green-50 font-medium italic drop-shadow-md pb-1 sm:pb-0">
                                "{slide.tagline}"
                            </p>

                            <div className="w-12 sm:w-24 h-0.5 sm:h-1.5 bg-green-500 rounded-full hidden sm:block"></div>

                            {/* Points List - Show only 2 points highly compact on mobile */}
                            <ul className="space-y-1 sm:space-y-4 pt-1 sm:pt-2">
                                {slide.points.slice(0, 2).map((point, idx) => (
                                    <li key={idx} className="flex items-start gap-1.5 sm:gap-4 text-[11px] sm:text-xl text-white/95 font-medium drop-shadow-md">
                                        <CheckCircle2 className="w-3 h-3 sm:w-7 sm:h-7 text-green-400 flex-shrink-0 drop-shadow mt-0.5" />
                                        <span>{point}</span>
                                    </li>
                                ))}
                                {/* Desktop only points */}
                                {slide.points.slice(2).map((point, idx) => (
                                    <li key={`desktop-${idx}`} className="hidden sm:flex items-start gap-4 text-xl text-white/95 font-medium drop-shadow-md">
                                        <CheckCircle2 className="w-7 h-7 text-green-400 flex-shrink-0 drop-shadow mt-0.5" />
                                        <span>{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation Buttons */}
            <button onClick={prev} className="absolute left-2 sm:left-6 top-[35%] sm:top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-black/60 backdrop-blur-md p-2 sm:p-4 rounded-full transition-all border border-white/30 text-white hover:scale-110 flex items-center justify-center">
                <ChevronLeft className="w-4 h-4 sm:w-8 sm:h-8" />
            </button>
            <button onClick={next} className="absolute right-2 sm:right-6 top-[35%] sm:top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-black/60 backdrop-blur-md p-2 sm:p-4 rounded-full transition-all border border-white/30 text-white hover:scale-110 flex items-center justify-center">
                <ChevronRight className="w-4 h-4 sm:w-8 sm:h-8" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-3 sm:bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-2 sm:gap-3 bg-black/40 backdrop-blur px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-white/10">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`h-1.5 sm:h-2.5 rounded-full transition-all duration-300 ${i === current ? "w-8 sm:w-12 bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]" : "w-1.5 sm:w-3 bg-white/50 hover:bg-white/80"}`}
                        aria-label={`Go to slide ${i + 1}`}
                    />
                ))}
            </div>
        </section>
    )
}

export default HeroCarousel
