import { CheckCircle2, XCircle, AlertTriangle, Leaf } from 'lucide-react'
import { motion } from 'framer-motion'

const benefits = [
    'Prevents plant diseases', 'Promotes healthy growth',
    'Improves oxygen and air quality', 'Keeps pests under control',
    'Enhances property beauty and value', 'Stronger plant growth',
    'Cleaner garden', 'Healthier environment', 'Zero stress for the owner',
]

const problems = [
    'Dry soil', 'Weak plants and weak roots',
    'Pest attacks', 'Dying plants',
    'Declining garden value', 'Problems grow silently over time',
]

const GardenAwareness = () => {
    return (
        <section className="py-16 sm:py-24 bg-white">
            <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
                <div className="text-center mb-10 sm:mb-16 space-y-3">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-xs sm:text-sm">
                        <Leaf className="w-4 h-4" />
                        Garden Maintenance Awareness
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-text">🌿 Key Points</h2>
                    <div className="w-16 sm:w-20 h-1.5 bg-secondary rounded-full mx-auto"></div>
                </div>

                {/* Row 1 */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, staggerChildren: 0.15 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:gap-8"
                >
                    {/* Importance */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-br from-primary to-[#1a6b38] text-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 space-y-4"
                    >
                        <div className="bg-white/20 w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center">
                            <Leaf className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-heading font-bold">Why It Matters</h3>
                        <ul className="space-y-2 text-white/80 text-sm">
                            {['Improves air quality', 'Helps reduce stress', 'Brings life and beauty to your space', 'Keeps plants strong, safe, and beautiful', 'Protects your property value'].map(i => (
                                <li key={i} className="flex items-start gap-2"><span className="text-accent mt-0.5">→</span> {i}</li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Problems */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-red-50 border border-red-100 rounded-2xl sm:rounded-3xl p-6 sm:p-8 space-y-4"
                    >
                        <div className="bg-red-100 w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-heading font-bold text-red-700">Problems from Neglect</h3>
                        <ul className="space-y-2 text-red-600 text-sm">
                            {problems.map(p => (
                                <li key={p} className="flex items-start gap-2"><XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" /> {p}</li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Benefits */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-green-50 border border-green-100 rounded-2xl sm:rounded-3xl p-6 sm:p-8 space-y-4"
                    >
                        <div className="bg-secondary/20 w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-secondary" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-heading font-bold text-primary">Benefits of Regular Care</h3>
                        <ul className="space-y-2 text-[#166534] text-sm">
                            {benefits.map(b => (
                                <li key={b} className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-secondary" /> {b}</li>
                            ))}
                        </ul>
                    </motion.div>
                </motion.div>

                {/* Row 2 */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, staggerChildren: 0.15 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8"
                >
                    <div className="bg-background rounded-2xl sm:rounded-3xl p-6 sm:p-8 space-y-4 border border-gray-100">
                        <h3 className="text-lg sm:text-xl font-heading font-bold text-text">🔧 Professional Maintenance Includes</h3>
                        <ul className="space-y-2.5">
                            {['Proper pruning and trimming', 'Soil loosening and nutrition', 'Removal of dry leaves', 'Plant health monitoring', 'Maintaining a clean hygienic garden'].map(i => (
                                <li key={i} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100 text-sm text-subtext">
                                    <span className="text-secondary flex-shrink-0">✦</span> {i}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex flex-col gap-4 sm:gap-6">
                        <div className="bg-accent/10 border border-accent/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 space-y-2">
                            <h3 className="text-lg sm:text-xl font-heading font-bold text-text">💰 Financial Benefit</h3>
                            <p className="text-subtext text-sm leading-relaxed">
                                Professional maintenance costs <strong>less than replacing dead plants</strong>. It protects your green investment and ensures long-term garden value.
                            </p>
                        </div>
                        <div className="bg-primary rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white text-center space-y-2">
                            <p className="text-xl sm:text-2xl font-heading font-bold leading-snug">Stop fixing damage.<br />Start preventing it.</p>
                            <p className="text-white/70 text-sm">Regular care protects your garden long-term.</p>
                        </div>
                        <div className="bg-secondary rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-white text-center">
                            <p className="text-2xl sm:text-3xl font-heading font-bold">🌿 More Plants</p>
                            <p className="text-base sm:text-xl font-bold text-white/90 mt-2">More Oxygen • More Life</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

export default GardenAwareness
