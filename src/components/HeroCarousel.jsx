import { useState } from "react"
import { ChevronLeft, ChevronRight, Tag } from "lucide-react"

const slides = [
    {
        image: "/as/gardener.png",
        heading: "Bring Nature Into Your Home",
        sub: "O2need curates premium indoor plants that transform your living space into a breathable sanctuary.",
    },
    {
        image: "https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=2000&auto=format&fit=crop",
        heading: "Breathe Better, Live Better",
        sub: "Each plant is hand-picked for its air-purifying qualities and aesthetic appeal.",
    },
    {
        image: "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?q=80&w=2000&auto=format&fit=crop",
        heading: "Premium Indoor Collection",
        sub: "Minimalist. Professional. Full of life. Discover plants that complement every space.",
    },
]

const HeroCarousel = () => {
    const [current, setCurrent] = useState(0)
    const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length)
    const next = () => setCurrent((c) => (c + 1) % slides.length)

    return (
        <section className="relative h-[60vh] sm:h-[75vh] md:h-[85vh] overflow-hidden bg-[#f0f4f1]">
            {slides.map((slide, i) => (
                <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}>
                    <img src={slide.image} alt={slide.heading} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                    {/* Discount tag top-right */}
                    <div className="absolute top-4 right-4 z-30 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg animate-pulse">
                        <Tag className="w-3.5 h-3.5" /> Up to 40% OFF on Services
                    </div>

                    <div className="absolute inset-0 flex items-center z-20 px-6 md:px-12">
                        <div className="max-w-lg text-white space-y-4 sm:space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur rounded-full text-white font-medium text-xs sm:text-sm border border-white/30">
                                🌿 Premium Indoor Collection
                            </div>
                            <h1 className="text-3xl sm:text-5xl md:text-6xl font-heading font-bold leading-tight drop-shadow-lg">
                                {slide.heading}
                            </h1>
                            <p className="text-sm sm:text-lg text-white/80 leading-relaxed line-clamp-3">{slide.sub}</p>
                            <div className="flex flex-wrap gap-3 pt-2">
                                <a href="#products" className="btn-primary text-xs sm:text-sm py-2 px-5">Shop Now</a>
                                <a href="/about" className="border border-white text-white px-5 py-2 rounded-lg font-medium hover:bg-white hover:text-primary transition-all text-xs sm:text-sm">
                                    Learn More
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            <button onClick={prev} className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 backdrop-blur p-2 sm:p-3 rounded-full transition-all border border-white/30">
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </button>
            <button onClick={next} className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 backdrop-blur p-2 sm:p-3 rounded-full transition-all border border-white/30">
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </button>

            <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                {slides.map((_, i) => (
                    <button key={i} onClick={() => setCurrent(i)} className={`h-1.5 sm:h-2 rounded-full transition-all ${i === current ? "w-6 sm:w-8 bg-white" : "w-1.5 sm:w-2 bg-white/50"}`} />
                ))}
            </div>
        </section>
    )
}

export default HeroCarousel
