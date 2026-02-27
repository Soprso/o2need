import { useEffect, useCallback } from 'react'
import { X, Leaf, Crown, Zap, CheckCircle2, Calendar, Phone as PhoneIcon } from 'lucide-react'
import { useSubscription } from '../context/SubscriptionContext'

const MembershipPerksModal = () => {
    const { step, closeAll, userSubscription, visitsLeft } = useSubscription()
    const isOpen = step === 'perks'

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

    if (!isOpen || !userSubscription) return null

    const sub = userSubscription
    const purchasedDate = sub.purchasedAt
        ? new Date(sub.purchasedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
        : '—'

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-[1002] bg-black/65 backdrop-blur-sm"
                style={{ animation: 'fade-in 0.2s ease' }}
                onClick={closeAll}
                aria-hidden="true"
            />

            {/* Panel */}
            <div
                className="fixed inset-0 z-[1003] flex items-center justify-center p-4"
                role="dialog"
                aria-modal="true"
                aria-label="Membership perks"
            >
                <div
                    className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
                    style={{ animation: 'modal-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Shimmer top bar */}
                    <div className="h-1.5 bg-gradient-to-r from-[#14532d] via-[#22c55e] to-[#14532d]" />

                    {/* ── Header ── */}
                    <div className="relative bg-gradient-to-br from-[#14532d] to-[#166534] px-7 pt-8 pb-10 overflow-hidden">
                        <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />
                        <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full bg-black/10 pointer-events-none" />

                        {/* Crown badge */}
                        <div className="inline-flex items-center gap-1.5 bg-[#22c55e] text-white text-xs font-bold px-3 py-1 rounded-full mb-4 shadow-lg shadow-green-500/30">
                            <Crown className="w-3 h-3 fill-white" />
                            Active Membership
                        </div>

                        <p className="text-green-300 text-xs font-bold tracking-widest uppercase mb-1 flex items-center gap-1.5">
                            {sub.planId === 'pro' && <Zap className="w-3.5 h-3.5" />}
                            {sub.planName}
                        </p>
                        <div className="flex items-end gap-2 mb-3">
                            <span className="text-4xl font-heading font-bold text-white leading-none">
                                ₹{(sub.price || 0).toLocaleString('en-IN')}
                            </span>
                            <span className="text-green-200 text-sm mb-1">/ {sub.period}</span>
                        </div>

                        {/* Visits left — big number */}
                        <div className="flex items-center gap-4 mt-4">
                            <div className="bg-white/15 rounded-2xl px-5 py-3 text-center">
                                <p className="text-4xl font-heading font-bold text-white leading-none">{visitsLeft}</p>
                                <p className="text-green-200 text-xs mt-1">visits left</p>
                            </div>
                            <div className="bg-white/10 rounded-2xl px-5 py-3 text-center">
                                <p className="text-2xl font-heading font-bold text-white leading-none">{sub.visits}</p>
                                <p className="text-green-200 text-xs mt-1">total / {sub.period}</p>
                            </div>
                        </div>

                        {/* Close button */}
                        <button
                            onClick={closeAll}
                            className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/30 text-white transition-all duration-200 hover:rotate-90"
                            aria-label="Close"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Wave */}
                    <div className="-mt-1">
                        <svg viewBox="0 0 500 25" className="w-full" preserveAspectRatio="none" style={{ height: 25 }}>
                            <path d="M0,25 C125,0 375,25 500,0 L500,25 Z" fill="white" />
                        </svg>
                    </div>

                    {/* ── Body ── */}
                    <div className="px-7 pt-1 pb-6">

                        {/* Meta info */}
                        <div className="flex flex-wrap gap-3 mb-5">
                            <div className="flex items-center gap-1.5 text-xs text-subtext bg-gray-50 px-3 py-1.5 rounded-full">
                                <Calendar className="w-3.5 h-3.5" />
                                Purchased: {purchasedDate}
                            </div>
                            {sub.paymentId && (
                                <div className="flex items-center gap-1.5 text-xs text-subtext bg-gray-50 px-3 py-1.5 rounded-full truncate max-w-[200px]">
                                    <span className="font-mono">#{sub.paymentId.slice(-8)}</span>
                                </div>
                            )}
                        </div>

                        <h3 className="font-heading text-sm font-bold text-text mb-3 flex items-center gap-2">
                            <span className="inline-block w-1 h-4 bg-[#22c55e] rounded-full" />
                            Your included perks
                        </h3>

                        <ul className="space-y-2.5 mb-5">
                            {(sub.features || []).map((f, i) => (
                                <li key={i} className="flex items-center gap-2.5 text-sm">
                                    <CheckCircle2 className="w-4 h-4 text-[#22c55e] flex-shrink-0" />
                                    <span className="text-text capitalize">{f}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="p-3.5 bg-green-50 border border-green-100 rounded-xl text-xs text-[#166534] flex items-start gap-2">
                            <Leaf className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                            Our team will contact you to schedule your next visit. For queries call +91 85850 03674.
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-7 pb-7">
                        <button
                            onClick={closeAll}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#14532d] to-[#166534] hover:from-[#166534] hover:to-[#15803d] text-white font-bold text-sm transition-all duration-300 active:scale-[0.98]"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MembershipPerksModal
