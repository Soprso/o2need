import { useState } from "react"
import { ChevronLeft, ChevronRight, CheckCircle2, Tag } from "lucide-react"
import { useSubscription } from "../context/SubscriptionContext"

const slides = [
    {
        image: "/as/gardener1.png",
        planName: "Starter Plan",
        mrp: 3000,
        price: 1399,
        tagline: "Clear air, Pure Life.",
        discount: "HUGE DISCOUNT - SAVE 53%!",
        points: [
            "2 Expert Visits per Month",
            "Plant Health Analysis & Soil Check",
            "Cutting, Trimming & Bio-Pesticide Spray",
        ],
    },
    {
        image: "/as/img2.png",
        planName: "Standard Plan",
        mrp: 4500,
        price: 1999,
        tagline: "Professional Care for Your Green Space.",
        discount: "MOST POPULAR - 55% OFF!",
        points: [
            "3 Expert Visits per Month",
            "Soil Check, Loosening & Creeper Support",
            "Cutting, Trimming & Bio-Pesticide Spray",
        ],
    },
    {
        image: "/as/img3.png",
        planName: "Pro Plan",
        mrp: 6000,
        price: 2599,
        tagline: "Clear air, Pure Life. Transform your environment.",
        discount: "PREMIUM PLAN - 56% OFF!",
        points: [
            "4 Expert Visits per Month",
            "Full Plant Health & Soil Analysis",
            "Before & After Garden Service Photos",
        ],
    },
    {
        image: "/as/img4.png",
        planName: '"Mission Organised\nVision Build Jungle"',
        tagline: "",
        points: [],
    },
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
                    <img src={slide.image} alt={slide.planName} className="absolute inset-0 w-full h-full object-cover object-center" />

                    {/* Subtle fade overlay - darker at bottom for text readability on mobile */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 sm:via-transparent to-transparent pointer-events-none" />

                    {/* Content container - pushed to bottom on mobile, absolute center on desktop */}
                    <div className="absolute inset-0 flex flex-col justify-end sm:justify-center z-20 px-4 pb-12 sm:pb-0 sm:px-12 md:px-20">
                        <div
                            onClick={openModal}
                            className="w-full sm:max-w-xl md:max-w-2xl text-white space-y-2 sm:space-y-4 p-4 sm:p-6 sm:px-10 rounded-2xl sm:rounded-3xl bg-black/25 sm:bg-black/10 backdrop-blur-md border border-white/20 shadow-2xl transform transition-all cursor-pointer hover:bg-black/50 sm:hover:bg-black/30 mb-2 sm:mb-0"
                        >


                            {/* Discount Tag */}
                            {slide.discount && (
                                <div className="inline-flex items-center gap-1 sm:gap-2 px-2.5 sm:px-4 py-1 sm:py-2 bg-red-600 rounded-full text-white font-bold text-[10px] sm:text-sm shadow-[0_0_20px_rgba(220,38,38,0.6)] animate-pulse border border-red-400 tracking-wide uppercase self-start">
                                    <Tag className="w-3 h-3 sm:w-4 sm:h-4" /> {slide.discount}
                                </div>
                            )}

                            {/* Plan Name / Motto */}
                            <h1 className="text-[20px] leading-tight sm:text-4xl md:text-5xl font-heading font-black sm:leading-tight text-white drop-shadow-xl mt-1 sm:mt-0">
                                {slide.planName.split('\n').map((line, idx) => (
                                    <span key={idx} className="block">{line}</span>
                                ))}
                                {/* Price row: strikethrough MRP + actual price */}
                                {slide.price && (
                                    <span className="flex items-baseline gap-2 sm:gap-3 mt-0.5 sm:mt-1 flex-wrap">
                                        <span className="text-sm sm:text-2xl text-white/50 line-through font-semibold">
                                            ₹{slide.mrp?.toLocaleString('en-IN')}/mo
                                        </span>
                                        <span className="text-base sm:text-3xl text-green-300 font-black">
                                            ₹{slide.price?.toLocaleString('en-IN')}/mo
                                        </span>
                                    </span>
                                )}
                            </h1>

                            {/* Tagline */}
                            {slide.tagline && (
                                <p className="text-xs sm:text-lg text-green-50 font-medium italic drop-shadow-md pb-1 sm:pb-0 block">
                                    "{slide.tagline}"
                                </p>
                            )}

                            <div className="w-12 sm:w-20 h-0.5 sm:h-1 bg-green-500 rounded-full hidden sm:block"></div>

                            {/* Points List - Show only 1 point on mobile */}
                            {slide.points?.length > 0 && (
                                <ul className="space-y-1 sm:space-y-2 pt-1 sm:pt-1">
                                    {slide.points.slice(0, 1).map((point, idx) => (
                                        <li key={idx} className="flex items-start gap-1.5 sm:gap-3 text-[11px] sm:text-base text-white/95 font-medium drop-shadow-md">
                                            <CheckCircle2 className="w-3 h-3 sm:w-5 sm:h-5 text-green-400 flex-shrink-0 drop-shadow mt-0.5" />
                                            <span>{point}</span>
                                        </li>
                                    ))}
                                    {/* Desktop only points (remainder) */}
                                    {slide.points.slice(1).map((point, idx) => (
                                        <li key={`desktop-${idx}`} className="hidden sm:flex items-start gap-3 text-base text-white/95 font-medium drop-shadow-md">
                                            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 drop-shadow mt-0.5" />
                                            <span>{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
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
