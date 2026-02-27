import { useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { X, Leaf, Shield, Star } from 'lucide-react'
import { useSubscription } from '../context/SubscriptionContext'
import SubscriptionCard from './SubscriptionCard'

const SubscribeModal = () => {
    const { step, closeAll, plans } = useSubscription()
    const isOpen = step === 'plans'

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

    return (
        <>
            {/* ── Backdrop ── */}
            <div
                className="fixed inset-0 z-[998] bg-black/60 backdrop-blur-sm"
                style={{ animation: 'fade-in 0.25s ease' }}
                onClick={closeAll}
                aria-hidden="true"
            />

            {/* ── Modal Panel ── */}
            <div
                className="fixed inset-0 z-[999] flex items-center justify-center p-4"
                role="dialog"
                aria-modal="true"
                aria-label="Subscription plans"
            >
                <div
                    className="relative w-full max-w-4xl max-h-[92vh] bg-[#f9fafb] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
                    style={{ animation: 'modal-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* ── Header ── */}
                    <div className="relative bg-gradient-to-br from-[#14532d] via-[#166534] to-[#15803d] px-8 pt-6 pb-8 flex-shrink-0 overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
                        <div className="absolute top-6 right-24 w-20 h-20 rounded-full bg-white/5 pointer-events-none" />
                        <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-black/10 pointer-events-none" />

                        {/* Trust badges */}
                        <div className="flex gap-3 mb-5 flex-wrap">
                            {[
                                { icon: <Shield className="w-3.5 h-3.5" />, text: 'Cancel anytime' },
                                { icon: <Star className="w-3.5 h-3.5" />, text: '4.9★ rated service' },
                                { icon: <Leaf className="w-3.5 h-3.5" />, text: 'Eco-friendly experts' },
                            ].map(({ icon, text }) => (
                                <span key={text} className="flex items-center gap-1.5 text-green-200 text-xs font-medium bg-white/10 px-3 py-1.5 rounded-full">
                                    {icon}
                                    {text}
                                </span>
                            ))}
                        </div>

                        <h2 className="font-heading text-3xl md:text-4xl font-bold text-white leading-tight mb-2">
                            Choose your membership
                        </h2>
                        <p className="text-green-200 text-base max-w-xl">
                            Protect your garden with professional care — flexible plans for every green space.
                        </p>

                        {/* Close */}
                        <button
                            onClick={closeAll}
                            className="absolute top-5 right-5 w-9 h-9 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 text-white transition-all duration-200 hover:rotate-90"
                            aria-label="Close"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Wave */}
                    <div className="flex-shrink-0 -mt-1">
                        <svg viewBox="0 0 1440 40" className="w-full" preserveAspectRatio="none" style={{ height: 40 }}>
                            <path d="M0,40 C360,0 1080,40 1440,0 L1440,40 Z" fill="#f9fafb" />
                        </svg>
                    </div>

                    {/* Plans Grid */}
                    <div className="overflow-y-auto flex-1 px-6 md:px-10 pb-10 pt-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-6">
                            {plans.map((plan) => (
                                <SubscriptionCard key={plan.id} plan={plan} />
                            ))}
                        </div>
                        <p className="text-center text-xs text-subtext mt-8">
                            All plans include GST. Visits scheduled at your convenience.&nbsp;
                            <Link
                                to="/terms"
                                onClick={closeAll}
                                className="text-[#14532d] font-medium hover:underline"
                            >
                                *Terms apply.
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SubscribeModal
