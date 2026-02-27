import { useEffect, useCallback } from 'react'
import { CheckCircle2, X, Leaf, Sparkles, Star } from 'lucide-react'
import { useSubscription } from '../context/SubscriptionContext'

// ── Animated SVG checkmark ────────────────────────────────────────────────────
const AnimatedCheck = () => (
    <svg
        className="w-24 h-24"
        viewBox="0 0 96 96"
        fill="none"
        style={{ animation: 'check-pop 0.6s cubic-bezier(0.34, 1.8, 0.64, 1) 0.1s both' }}
    >
        <circle cx="48" cy="48" r="46" fill="#14532d" opacity="0.1" />
        <circle cx="48" cy="48" r="38" fill="#14532d" opacity="0.12" />
        <circle cx="48" cy="48" r="30" fill="#14532d" />
        <path
            d="M30 48 L42 60 L66 36"
            stroke="white"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ animation: 'draw-check 0.4s ease 0.5s both' }}
            strokeDasharray="40"
            strokeDashoffset="0"
        />
    </svg>
)

// ── Floating particle (decorative) ────────────────────────────────────────────
const Particle = ({ style }) => (
    <div
        className="absolute w-2 h-2 rounded-full bg-[#22c55e] opacity-60 pointer-events-none"
        style={{ animation: 'float-up 1.8s ease-out forwards', ...style }}
    />
)

const SuccessModal = () => {
    const { step, selectedPlan, closeAll } = useSubscription()
    const isOpen = step === 'success'

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Escape') closeAll()
    }, [closeAll])

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown)
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.body.style.overflow = ''
        }
    }, [isOpen, handleKeyDown])

    if (!isOpen) return null

    const plan = selectedPlan || { name: 'Your Plan', visits: 0, visitsLabel: '', recommended: false }

    // Benefits shown in success modal
    const benefits = [
        { icon: '🌿', text: `${plan.visitsLabel || `${plan.visits} visits`} by certified experts` },
        { icon: '🔬', text: 'Plant health analysis every visit' },
        { icon: '✂️', text: 'Professional cutting & pruning' },
        { icon: '🌱', text: 'Soil nourishment & care tips' },
        ...(plan.recommended ? [{ icon: '⚡', text: 'Priority support — 24/7 phone access' }] : []),
    ]

    // random particle positions
    const particles = [
        { bottom: '20%', left: '10%', animationDelay: '0s' },
        { bottom: '30%', left: '20%', animationDelay: '0.2s' },
        { bottom: '15%', right: '12%', animationDelay: '0.15s' },
        { bottom: '25%', right: '22%', animationDelay: '0.35s' },
        { bottom: '40%', left: '5%', animationDelay: '0.5s' },
        { bottom: '40%', right: '6%', animationDelay: '0.45s' },
    ]

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-[1002] bg-black/70 backdrop-blur-sm"
                style={{ animation: 'fade-in 0.2s ease' }}
                onClick={closeAll}
                aria-hidden="true"
            />

            {/* Panel */}
            <div
                className="fixed inset-0 z-[1003] flex items-center justify-center p-4"
                role="dialog"
                aria-modal="true"
                aria-label="Subscription success"
            >
                <div
                    className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
                    style={{ animation: 'modal-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Floating particles */}
                    {particles.map((style, i) => <Particle key={i} style={style} />)}

                    {/* ── Top green strip ── */}
                    <div className="h-2 bg-gradient-to-r from-[#14532d] via-[#22c55e] to-[#14532d]" style={{ animation: 'shimmer 2s linear infinite', backgroundSize: '200%' }} />

                    {/* Close button */}
                    <button
                        onClick={closeAll}
                        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-all duration-200 hover:rotate-90 z-10"
                        aria-label="Close"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    {/* ── Content ── */}
                    <div className="px-8 pt-10 pb-4 text-center">
                        {/* Animated checkmark */}
                        <div className="flex justify-center mb-6">
                            <AnimatedCheck />
                        </div>

                        {/* Sparkles row */}
                        <div className="flex justify-center gap-2 mb-3">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                                    style={{ animation: `star-pop 0.4s ease ${0.6 + i * 0.08}s both` }}
                                />
                            ))}
                        </div>

                        <h2
                            className="font-heading text-3xl font-bold text-[#14532d] mb-2"
                            style={{ animation: 'slide-up 0.5s ease 0.3s both' }}
                        >
                            Congratulations! 🎉
                        </h2>
                        <p
                            className="text-subtext text-sm mb-1"
                            style={{ animation: 'slide-up 0.5s ease 0.4s both' }}
                        >
                            You are now a
                        </p>
                        <div
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#14532d] to-[#166534] text-white text-sm font-bold px-4 py-2 rounded-full mb-6 shadow-lg shadow-green-900/20"
                            style={{ animation: 'slide-up 0.5s ease 0.45s both' }}
                        >
                            <Sparkles className="w-4 h-4" />
                            {plan.name} Member
                        </div>

                        {/* Benefits */}
                        <div
                            className="text-left bg-[#f9fafb] rounded-2xl p-4 mb-6"
                            style={{ animation: 'slide-up 0.5s ease 0.55s both' }}
                        >
                            <p className="text-xs font-bold text-[#14532d] tracking-wider uppercase mb-3 flex items-center gap-1.5">
                                <Leaf className="w-3.5 h-3.5" />
                                You will receive
                            </p>
                            <ul className="space-y-2.5">
                                {benefits.map(({ icon, text }, i) => (
                                    <li key={i} className="flex items-start gap-2.5 text-sm text-text">
                                        <span className="text-base leading-none mt-0.5">{icon}</span>
                                        {text}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* ── Footer ── */}
                    <div className="px-8 pb-8" style={{ animation: 'slide-up 0.5s ease 0.65s both' }}>
                        <button
                            onClick={closeAll}
                            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#14532d] to-[#166534] hover:from-[#166534] hover:to-[#15803d] text-white font-bold text-sm shadow-lg shadow-green-900/25 hover:shadow-green-900/35 transition-all duration-300 active:scale-[0.98]"
                        >
                            Continue to Dashboard →
                        </button>
                        <p className="text-center text-xs text-subtext mt-3">
                            A confirmation has been sent to your registered email.
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SuccessModal
