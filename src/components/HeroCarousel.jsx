import { useState, useEffect } from "react"
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
        <section className="relative h-[90vh] md:h-[95vh] overflow-hidden bg-[#14532d]">
            {slides.map((slide, i) => (
                <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? "opacity-100 z-10" : "opacity-0 z-0"} flex flex-col sm:block`}>

                    {/* Image Section - top half on mobile, full screen on desktop */}
                    <div className="relative h-[45vh] sm:h-full sm:absolute sm:inset-0 w-full flex-shrink-0">
                        <img src={slide.image} alt={slide.heading} className="w-full h-full object-cover object-center" />
                        {/* Subtle fade overlay for desktop only */}
                        <div className="hidden sm:block absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
                        {/* Gradient transition to green for mobile */}
                        <div className="sm:hidden absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#14532d] to-transparent pointer-events-none" />
                    </div>

                    {/* Content container - bottom half scrollable on mobile, absolute center on desktop */}
                    <div className="flex-1 bg-[#14532d] sm:bg-transparent sm:absolute sm:inset-0 flex flex-col justify-start sm:justify-center z-20 px-5 pt-2 pb-12 overflow-y-auto sm:overflow-visible sm:px-12 md:px-20">
                        <div
                            onClick={openModal}
                            className="w-full sm:max-w-2xl text-white space-y-3 sm:space-y-8 sm:p-12 sm:rounded-[2rem] sm:bg-black/20 sm:backdrop-blur-md sm:border sm:border-white/20 sm:shadow-2xl cursor-pointer hover:opacity-90 sm:hover:bg-black/30 transition-all"
                        >

                            {/* Logo */}
                            {slide.showLogo && (
                                <img src="/as/logo.png" alt="O2need Logo" className="h-10 sm:h-16 mb-2 sm:mb-4 object-contain drop-shadow-lg" />
                            )}

                            {/* Discount Tag */}
                            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-1.5 sm:py-2.5 bg-red-600 rounded-full text-white font-bold text-[10px] sm:text-lg shadow-[0_0_20px_rgba(220,38,38,0.6)] animate-pulse border border-red-400 tracking-wide uppercase mt-1 sm:mt-0">
                                <Tag className="w-3 h-3 sm:w-5 sm:h-5" /> {slide.discount}
                            </div>

                            {/* Heading */}
                            <h1 className="text-[22px] leading-tight sm:text-5xl md:text-6xl font-heading font-black sm:leading-tight text-white drop-shadow-xl mt-1 sm:mt-0">
                                {slide.heading.split('—')[0]}
                                <span className="block text-lg sm:text-4xl mt-0.5 sm:mt-2 text-green-300">
                                    {slide.heading.split('—')[1] ? `— ${slide.heading.split('—')[1]}` : ''}
                                </span>
                            </h1>

                            {/* Tagline */}
                            <p className="text-sm sm:text-2xl text-green-50 font-medium italic drop-shadow-md pb-1 sm:pb-0">
                                "{slide.tagline}"
                            </p>

                            <div className="w-16 sm:w-24 h-1 sm:h-1.5 bg-green-500 rounded-full hidden sm:block"></div>

                            {/* Points List */}
                            <ul className="space-y-1.5 sm:space-y-4 pt-1 sm:pt-2">
                                {slide.points.slice(0, 3).map((point, idx) => (
                                    <li key={idx} className="flex items-start gap-2.5 sm:gap-4 text-sm sm:text-xl text-white/95 font-medium drop-shadow-md">
                                        <CheckCircle2 className="w-4 h-4 sm:w-7 sm:h-7 text-green-400 flex-shrink-0 drop-shadow mt-0.5" />
                                        <span>{point}</span>
                                    </li>
                                ))}
                                {/* Hide extra points on mobile to save space, but show them if they need to be uniform */}
                                {slide.points.slice(3).map((point, idx) => (
                                    <li key={`mobile-${idx}`} className="flex sm:hidden items-start gap-2.5 text-sm text-white/95 font-medium drop-shadow-md">
                                        <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 drop-shadow mt-0.5" />
                                        <span>{point}</span>
                                    </li>
                                ))}
                                {slide.points.slice(3).map((point, idx) => (
                                    <li key={`desktop-${idx}`} className="hidden sm:flex items-start gap-4 text-xl text-white/95 font-medium drop-shadow-md">
                                        <CheckCircle2 className="w-7 h-7 text-green-400 flex-shrink-0 drop-shadow" />
                                        <span>{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation Buttons (Hidden on mobile entirely as text is clickable and dots exist, or position over the image!) */}
            <button onClick={prev} className="absolute left-2 top-[22vh] sm:top-1/2 -translate-y-1/2 sm:left-6 z-30 bg-black/40 hover:bg-black/60 backdrop-blur-md p-2 sm:p-4 rounded-full transition-all border border-white/30 text-white hover:scale-110 flex items-center justify-center">
                <ChevronLeft className="w-4 h-4 sm:w-8 sm:h-8" />
            </button>
            <button onClick={next} className="absolute right-2 top-[22vh] sm:top-1/2 -translate-y-1/2 sm:right-6 z-30 bg-black/40 hover:bg-black/60 backdrop-blur-md p-2 sm:p-4 rounded-full transition-all border border-white/30 text-white hover:scale-110 flex items-center justify-center">
                <ChevronRight className="w-4 h-4 sm:w-8 sm:h-8" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-5 sm:bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-2 sm:gap-3 bg-black/20 backdrop-blur px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-white/10">
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
