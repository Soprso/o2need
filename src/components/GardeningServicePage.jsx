import { useState } from 'react'
import { Link } from 'react-router-dom'
import { gardeningServices } from '../data/gardeningServices'
import {
    ChevronLeft, ChevronRight, Phone, MessageCircle,
    CheckCircle, Tag, Sparkles, ArrowRight
} from 'lucide-react'

const PHONE = '+918585003674'
const WHATSAPP_NUM = '918585003674'

const Carousel = ({ images }) => {
    const [idx, setIdx] = useState(0)
    const prev = () => setIdx((idx - 1 + images.length) % images.length)
    const next = () => setIdx((idx + 1) % images.length)

    return (
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl group">
            <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${idx * 100}%)` }}
            >
                {images.map((src, i) => (
                    <img key={i} src={src} alt={`slide-${i}`} className="w-full flex-shrink-0 h-64 sm:h-80 md:h-[420px] object-cover" />
                ))}
            </div>
            {/* Controls */}
            <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur p-2 rounded-full shadow hover:bg-white transition-all opacity-0 group-hover:opacity-100">
                <ChevronLeft className="w-5 h-5 text-primary" />
            </button>
            <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur p-2 rounded-full shadow hover:bg-white transition-all opacity-0 group-hover:opacity-100">
                <ChevronRight className="w-5 h-5 text-primary" />
            </button>
            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, i) => (
                    <button key={i} onClick={() => setIdx(i)} className={`w-2 h-2 rounded-full transition-all ${i === idx ? 'bg-white w-5' : 'bg-white/50'}`} />
                ))}
            </div>
        </div>
    )
}

const GardeningServicePage = ({ service }) => {
    const others = gardeningServices.filter(s => s.id !== service.id)

    const handleCall = () => window.location.href = `tel:${PHONE}`
    const handleWhatsApp = () => window.open(
        `https://wa.me/${WHATSAPP_NUM}?text=Hi, I'd like to book: ${service.title}`,
        '_blank'
    )

    return (
        <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-16 max-w-6xl">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-subtext mb-6">
                <Link to="/" className="hover:text-primary">Home</Link>
                <span>/</span>
                <span className="text-primary font-medium">{service.title}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Carousel */}
                    <Carousel images={service.images} />

                    {/* Header */}
                    <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="bg-accent/20 text-amber-700 border border-amber-200 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                <Tag className="w-3 h-3" /> {service.discount}
                            </span>
                            <span className="bg-secondary/10 text-secondary text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                <Sparkles className="w-3 h-3" /> Most Popular
                            </span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-heading font-bold text-primary leading-tight">{service.title}</h1>
                        <p className="text-subtext text-base sm:text-lg italic">{service.tagline}</p>

                        {/* Price */}
                        <div className="flex items-baseline gap-3">
                            <span className="text-3xl sm:text-4xl font-heading font-bold text-primary">₹{service.price.toLocaleString()}</span>
                            <span className="text-base text-subtext line-through">₹{service.originalPrice.toLocaleString()}</span>
                            <span className="text-secondary font-bold text-sm bg-secondary/10 px-2.5 py-0.5 rounded-lg">{service.discount}</span>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <button
                                onClick={handleCall}
                                className="flex-1 bg-primary text-white py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 hover:bg-secondary transition-all shadow-lg active:scale-[0.98]"
                            >
                                <Phone className="w-5 h-5" /> Call to Book: 8585003674
                            </button>
                            <button
                                onClick={handleWhatsApp}
                                className="flex-1 bg-[#25D366] text-white py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 hover:bg-[#20b254] transition-all shadow-lg active:scale-[0.98]"
                            >
                                <MessageCircle className="w-5 h-5" /> WhatsApp Us
                            </button>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-6">
                        {service.description.map((section, i) => (
                            <div key={i} className="space-y-2">
                                <h2 className="text-lg sm:text-xl font-heading font-bold text-primary">{section.heading}</h2>
                                <p className="text-subtext leading-relaxed text-sm sm:text-base">{section.body}</p>
                            </div>
                        ))}
                    </div>

                    {/* Highlights */}
                    <div className="bg-green-50 border border-green-100 rounded-2xl p-6">
                        <h3 className="font-heading font-bold text-text text-base mb-4">✦ What's Included</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {service.highlights.map((h, i) => (
                                <div key={i} className="flex items-center gap-2.5 text-sm text-[#166534]">
                                    <CheckCircle className="w-4 h-4 text-secondary flex-shrink-0" /> {h}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Second CTA */}
                    <div className="bg-gradient-to-r from-primary to-[#1a6b38] text-white rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                            <p className="font-heading font-bold text-lg">Ready to book?</p>
                            <p className="text-white/70 text-sm">Call us or WhatsApp to schedule at your convenience.</p>
                        </div>
                        <div className="flex gap-3 flex-shrink-0">
                            <button onClick={handleCall} className="bg-white text-primary px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-gray-50 transition-all">
                                <Phone className="w-4 h-4" /> Call Now
                            </button>
                            <button onClick={handleWhatsApp} className="bg-[#25D366] text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-[#20b254] transition-all">
                                <MessageCircle className="w-4 h-4" /> WhatsApp
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar — Other Services */}
                <div className="lg:col-span-1">
                    <div className="sticky top-32 space-y-4">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                            <h3 className="font-heading font-bold text-text text-base mb-4 pb-3 border-b border-gray-100">Other Services</h3>
                            <div className="space-y-3">
                                {others.map(s => (
                                    <Link
                                        key={s.id}
                                        to={s.slug}
                                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-green-50 transition-colors group"
                                    >
                                        <img src={s.images[0]} alt={s.title} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                                        <div className="min-w-0 flex-1">
                                            <p className="font-bold text-text text-xs group-hover:text-primary transition-colors leading-snug">{s.title}</p>
                                            <p className="text-secondary text-xs font-bold mt-1">₹{s.price.toLocaleString()}</p>
                                            <p className="text-[10px] text-subtext line-through">₹{s.originalPrice.toLocaleString()}</p>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-subtext group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Quick Contact Card */}
                        <div className="bg-primary rounded-2xl p-5 text-white text-center space-y-3">
                            <p className="font-heading font-bold">Need Help Choosing?</p>
                            <p className="text-white/70 text-xs">Our garden experts will guide you to the right service.</p>
                            <button onClick={handleCall} className="w-full bg-white text-primary py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition-all">
                                <Phone className="w-4 h-4" /> +91 85850 03674
                            </button>
                            <button onClick={handleWhatsApp} className="w-full bg-[#25D366] text-white py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#20b254] transition-all">
                                <MessageCircle className="w-4 h-4" /> WhatsApp Us
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GardeningServicePage
