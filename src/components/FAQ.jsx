import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
    { q: "How often should I water my indoor plants?", a: "Most indoor plants thrive with watering once a week. Check the top inch of soil — if it's dry, time to water. Succulents need far less; tropical plants may need more in summer." },
    { q: "What is the best soil for indoor plants?", a: "A high-quality potting mix with good drainage is ideal. For most, a peat-based mix with perlite works well. Succulents need a sandy, fast-draining mix. Avoid garden soil — it compacts in pots." },
    { q: "Why are the leaves of my plant turning yellow?", a: "Yellow leaves signal overwatering, underwatering, nutrient deficiency, low light, or root rot. Check your watering frequency first — overwatering is the #1 cause. Ensure pots have drainage holes." },
    { q: "How do I prevent pests from attacking my plants?", a: "Inspect new plants before bringing indoors. Keep leaves clean by wiping with a damp cloth. Use neem oil spray monthly as a preventive. Isolate any plant showing pest damage immediately." },
    { q: "How much sunlight do indoor plants need?", a: "Most tropical houseplants prefer bright indirect light — near a window but not in direct sun. Low-light plants like pothos thrive in dimmer rooms. Succulents prefer several hours of direct sun daily." },
    { q: "When should I repot my plant?", a: "Repot when roots grow out of the drainage hole or growth slows dramatically. Spring is best — choose a pot 1–2 sizes larger than the current one." },
    { q: "What fertilizer should I use and how often?", a: "Use a balanced liquid fertilizer (NPK 10-10-10) every 2–4 weeks in spring and summer. Reduce or stop in winter. Always water before fertilizing to avoid root burn." },
]

const FAQItem = ({ q, a }) => {
    const [open, setOpen] = useState(false)
    return (
        <div className={`border rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 ${open ? 'border-primary/30 bg-green-50' : 'border-gray-100 bg-white'}`}>
            <button onClick={() => setOpen(!open)} className="w-full flex justify-between items-center text-left px-4 sm:px-6 py-4 sm:py-5 gap-3">
                <span className="font-heading font-semibold text-text text-sm sm:text-base">{q}</span>
                <ChevronDown className={`w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && (
                <div className="px-4 sm:px-6 pb-4 sm:pb-5 text-subtext text-xs sm:text-sm leading-relaxed">{a}</div>
            )}
        </div>
    )
}

const FAQ = () => (
    <section className="py-16 sm:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
            <div className="text-center mb-10 sm:mb-14 space-y-3">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-xs sm:text-sm">🌱 Gardening Tips</div>
                <h2 className="text-3xl sm:text-4xl font-heading font-bold text-text">Frequently Asked Questions</h2>
                <div className="w-16 sm:w-20 h-1.5 bg-secondary rounded-full mx-auto"></div>
                <p className="text-subtext text-sm">Everything you need to keep your plants thriving.</p>
            </div>
            <div className="space-y-3 sm:space-y-4">
                {faqs.map((faq, i) => <FAQItem key={i} q={faq.q} a={faq.a} />)}
            </div>
        </div>
    </section>
)

export default FAQ
