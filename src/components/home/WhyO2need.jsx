import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Check } from 'lucide-react'
import { useSubscription } from '../../context/SubscriptionContext'

const WhyO2need = () => {
    const { setStep } = useSubscription()

    return (
        <section className="py-20 overflow-hidden bg-gradient-to-b from-white to-[#f6fff6] font-sans">
            <div className="container mx-auto px-4 max-w-[1200px] flex flex-col gap-24 sm:gap-32">

                {/* ── SECTION 1: Hero Brand Statement ── */}
                <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
                    {/* Image Left */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className="w-full md:w-1/2"
                    >
                        <div className="relative rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.08)] group">
                            <motion.img
                                animate={{ y: [0, -8, 0] }}
                                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                                src="/images/o2need-wall-gardener.jpg"
                                alt="Gardener trimming plants"
                                className="w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                            />
                        </div>
                    </motion.div>

                    {/* Text Right */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                        className="w-full md:w-1/2 space-y-4"
                    >
                        <h2 className="text-[42px] leading-tight font-heading font-bold text-[#1a1a1a]">
                            O2need.com
                        </h2>
                        <h3 className="text-[24px] font-medium text-[#2e7d32]">
                            Breathe Life Indoors
                        </h3>
                    </motion.div>
                </div>

                {/* ── SECTION 2: Oxygen Value Proposition ── */}
                <div className="flex flex-col md:flex-row-reverse items-center gap-12 lg:gap-20">
                    {/* Image Right */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className="w-full md:w-1/2"
                    >
                        <div className="relative rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.08)] group">
                            <motion.img
                                animate={{ y: [0, -8, 0] }}
                                transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1 }}
                                src="/images/hand-holding-plant.jpg"
                                alt="Hand holding plant"
                                className="w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                            />
                        </div>
                    </motion.div>

                    {/* Text Left */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                        className="w-full md:w-1/2 space-y-4"
                    >
                        <h2 className="text-[42px] leading-tight font-heading font-bold text-[#1a1a1a]">
                            More Plants.<br />
                            More Oxygen.<br />
                            <span className="text-[#14532d]">More Life.</span>
                        </h2>
                    </motion.div>
                </div>

                {/* ── SECTION 3: Why O2need ── */}
                <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
                    {/* Image Left */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className="w-full md:w-1/2"
                    >
                        <div className="relative rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.08)] group">
                            <motion.img
                                animate={{ y: [0, -8, 0] }}
                                transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut", delay: 0.5 }}
                                src="/images/why-o2need-plant-display.jpg"
                                alt="Why O2need plant display"
                                className="w-full h-[450px] object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                            />
                        </div>
                    </motion.div>

                    {/* Text Right */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                        className="w-full md:w-1/2 space-y-6"
                    >
                        <h2 className="text-[42px] leading-tight font-heading font-bold text-[#1a1a1a]">
                            Why O2need.com?
                        </h2>
                        <div className="space-y-4 text-[18px] text-[#555] leading-[1.7]">
                            <p>
                                Unlike air purifiers that only clean air, O2need.com offers beautiful indoor plant systems that naturally create oxygen, purify air, and add life to your living space.
                            </p>
                            <p>
                                Breathe fresh, natural oxygen produced by our oxygen-generating plants and transform your air quality in an eco-friendly and healthy way.
                            </p>
                        </div>

                        <div className="pt-4">
                            <h3 className="text-[24px] font-medium text-[#2e7d32] mb-6">
                                The Benefits of Natural Oxygen Generation
                            </h3>
                            <ul className="space-y-4">
                                {[
                                    'Produces fresh, pure oxygen',
                                    'Naturally filters and humidifies your air',
                                    'Backed by science, powered by nature',
                                    'Enhances your home’s appearance and wellbeing'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-4">
                                        <div className="w-6 h-6 rounded-full bg-[#14532d] flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                                        </div>
                                        <span className="text-[18px] text-[#555] leading-snug">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                </div>

                {/* ── SECTION 4: Replace Your Air Purifier ── */}
                <div className="flex flex-col md:flex-row-reverse items-center gap-12 lg:gap-20">
                    {/* Image Right */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className="w-full md:w-1/2"
                    >
                        <div className="relative rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.08)] group">
                            <motion.img
                                animate={{ y: [0, -8, 0] }}
                                transition={{ repeat: Infinity, duration: 6.5, ease: "easeInOut", delay: 1.5 }}
                                src="/images/living-room-plants.jpg"
                                alt="Living room plants"
                                className="w-full h-[500px] object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                            />
                        </div>
                    </motion.div>

                    {/* Text Left */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                        className="w-full md:w-1/2 space-y-6"
                    >
                        <h2 className="text-[42px] leading-tight font-heading font-bold text-[#1a1a1a]">
                            Replace Your Air Purifier.<br />
                            <span className="text-[#14532d]">Grow Fresh Oxygen.</span>
                        </h2>
                        <p className="text-[18px] text-[#555] leading-[1.7]">
                            Houseplants naturally purify your air and produce fresh oxygen — replacing air purifiers with beautiful green plants.
                        </p>

                        <ul className="space-y-4 pt-2">
                            {[
                                'Grows and delivers oxygen-producing houseplants',
                                'Improve indoor air quality naturally',
                                'Creates a healthier, greener home'
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-4">
                                    <div className="w-6 h-6 rounded-full bg-[#14532d] flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                                    </div>
                                    <span className="text-[18px] text-[#555] leading-snug">{item}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="pt-8 pb-4">
                            <p className="text-[18px] font-medium text-[#1a1a1a] leading-relaxed border-l-4 border-[#14532d] pl-4 italic">
                                Breathe clean, healthy air and enjoy the beauty of nature indoors with O2need.com.
                            </p>
                        </div>

                        {/* CTA Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setStep('plans')}
                            className="bg-[#14532d] hover:bg-[#0a2e18] text-white text-[16px] font-bold px-8 py-4 rounded-xl transition-colors shadow-lg mt-4"
                        >
                            Explore Membership Plans
                        </motion.button>

                    </motion.div>
                </div>

            </div>
        </section>
    )
}

export default WhyO2need
