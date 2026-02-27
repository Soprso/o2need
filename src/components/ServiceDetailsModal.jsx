import { useEffect, useCallback, useState } from 'react'
import {
    X, ArrowLeft, Check, X as XMark,
    Crown, Leaf, Zap, Shield, Phone,
} from 'lucide-react'
import { useSubscription } from '../context/SubscriptionContext'

const ServiceDetailsModal = () => {
    const { step, selectedPlan, isPaying, goBackToPlans, closeAll, handlePayment } = useSubscription()
    const isOpen = step === 'details'

    const [phone, setPhone] = useState('')
    const [phoneError, setPhoneError] = useState('')

    // Reset phone whenever modal opens for a new plan
    useEffect(() => {
        if (isOpen) {
            setPhone('')
            setPhoneError('')
        }
    }, [isOpen])

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

    if (!isOpen || !selectedPlan) return null

    const { name, price, period, visitsLabel, services, recommended } = selectedPlan

    // Validate and submit
    const onContinue = () => {
        const trimmed = phone.trim()
        const phoneRegex = /^[6-9]\d{9}$/   // Indian mobile number
        if (!trimmed) {
            setPhoneError('Please enter your contact number to proceed.')
            return
        }
        if (!phoneRegex.test(trimmed)) {
            setPhoneError('Enter a valid 10-digit Indian mobile number.')
            return
        }
        setPhoneError('')
        handlePayment(selectedPlan, trimmed)
    }

    const iconStyle = (included) =>
        included
            ? 'w-5 h-5 rounded-full bg-green-100 text-[#22c55e] flex items-center justify-center flex-shrink-0 mt-0.5'
            : 'w-5 h-5 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center flex-shrink-0 mt-0.5'

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-[1000] bg-black/65 backdrop-blur-sm"
                style={{ animation: 'fade-in 0.2s ease' }}
                onClick={closeAll}
                aria-hidden="true"
            />

            {/* Panel */}
            <div
                className="fixed inset-0 z-[1001] flex items-center justify-center p-4"
                role="dialog"
                aria-modal="true"
                aria-label={`${name} details`}
            >
                <div
                    className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
                    style={{ animation: 'modal-in 0.32s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* ── Header ── */}
                    <div className={`relative flex-shrink-0 px-8 pt-8 pb-10 overflow-hidden ${recommended ? 'bg-gradient-to-br from-[#14532d] to-[#166534]' : 'bg-gradient-to-br from-[#1a6535] to-[#15803d]'}`}>
                        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-black/10 pointer-events-none" />

                        {recommended && (
                            <div className="inline-flex items-center gap-1.5 bg-[#22c55e] text-white text-xs font-bold px-3 py-1 rounded-full mb-4 shadow-lg shadow-green-500/30">
                                <Crown className="w-3 h-3 fill-white" />
                                Most Popular
                            </div>
                        )}

                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-green-300 text-xs font-bold tracking-widest uppercase mb-1 flex items-center gap-1.5">
                                    {recommended && <Zap className="w-3.5 h-3.5" />}
                                    {name}
                                </p>
                                <div className="flex items-end gap-2">
                                    <span className="text-5xl font-heading font-bold text-white leading-none">
                                        ₹{price.toLocaleString('en-IN')}
                                    </span>
                                    <span className="text-green-200 text-sm mb-1.5">/ {period}</span>
                                </div>
                                <div className="inline-block mt-3 bg-white/15 text-green-100 text-xs font-semibold px-3 py-1.5 rounded-full">
                                    {visitsLabel}
                                </div>
                            </div>

                            <div className="hidden sm:flex flex-col gap-2 mt-1">
                                {[
                                    { icon: <Shield className="w-3 h-3" />, text: 'Cancel anytime' },
                                    { icon: <Leaf className="w-3 h-3" />, text: 'Eco experts' },
                                ].map(({ icon, text }) => (
                                    <span key={text} className="flex items-center gap-1.5 text-green-200 text-xs bg-white/10 px-2.5 py-1 rounded-full whitespace-nowrap">
                                        {icon}{text}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={closeAll}
                            className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/30 text-white transition-all duration-200 hover:rotate-90"
                            aria-label="Close"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Wave */}
                    <div className="flex-shrink-0 -mt-1">
                        <svg viewBox="0 0 700 30" className="w-full" preserveAspectRatio="none" style={{ height: 30 }}>
                            <path d="M0,30 C175,0 525,30 700,0 L700,30 Z" fill="white" />
                        </svg>
                    </div>

                    {/* ── Body ── */}
                    <div className="overflow-y-auto flex-1 px-8 pt-2 pb-6">

                        {/* Services list */}
                        <h3 className="font-heading text-base font-bold text-text mb-5 flex items-center gap-2">
                            <span className="inline-block w-1 h-5 bg-[#22c55e] rounded-full" />
                            What's included in this plan
                        </h3>

                        <ul className="space-y-3">
                            {services.map(({ label, included }, i) => (
                                <li
                                    key={i}
                                    className={`flex items-start gap-3 p-3.5 rounded-xl text-sm transition-colors ${included ? 'bg-green-50' : 'bg-gray-50 opacity-70'}`}
                                >
                                    <span className={iconStyle(included)}>
                                        {included
                                            ? <Check className="w-3 h-3" strokeWidth={3} />
                                            : <XMark className="w-3 h-3" strokeWidth={2.5} />
                                        }
                                    </span>
                                    <span className={included ? 'text-text font-medium' : 'text-subtext line-through decoration-gray-400'}>
                                        {label}
                                    </span>
                                    {included && label === 'Priority Support' && (
                                        <span className="ml-auto text-xs bg-[#22c55e]/15 text-[#14532d] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                                            ★ Premium
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>

                        {/* Updated note */}
                        <div className="mt-6 p-4 bg-[#14532d]/5 border border-[#14532d]/10 rounded-2xl text-xs text-subtext">
                            <span className="font-semibold text-[#14532d]">Note: </span>
                            Visits will be scheduled and our team will contact you soon after the payment is successful. All services are performed by certified garden professionals.
                        </div>

                        {/* ── Phone Number Field ── */}
                        <div className="mt-5">
                            <label
                                htmlFor="sub-phone"
                                className="block text-sm font-semibold text-text mb-2"
                            >
                                Contact Number
                                <span className="text-red-500 ml-1">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                                    <Phone className="w-4 h-4 text-subtext" />
                                    <span className="text-sm text-subtext font-medium border-r border-gray-200 pr-2">+91</span>
                                </div>
                                <input
                                    id="sub-phone"
                                    type="tel"
                                    inputMode="numeric"
                                    maxLength={10}
                                    value={phone}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '')
                                        setPhone(val)
                                        if (phoneError) setPhoneError('')
                                    }}
                                    placeholder="Enter 10-digit mobile number"
                                    className={`
                                        w-full pl-24 pr-4 py-3.5 text-sm rounded-xl border transition-all duration-200
                                        focus:outline-none focus:ring-2
                                        ${phoneError
                                            ? 'border-red-400 bg-red-50 focus:ring-red-300/40 focus:border-red-400'
                                            : 'border-gray-200 bg-white focus:ring-[#22c55e]/30 focus:border-[#14532d]'
                                        }
                                    `}
                                    disabled={isPaying}
                                    aria-describedby={phoneError ? 'phone-error' : undefined}
                                />
                            </div>
                            {phoneError && (
                                <p id="phone-error" className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                                    <XMark className="w-3.5 h-3.5 flex-shrink-0" />
                                    {phoneError}
                                </p>
                            )}
                            <p className="mt-1.5 text-xs text-subtext">
                                Our team will use this number to schedule your garden visits.
                            </p>
                        </div>

                    </div>

                    {/* ── Footer Buttons ── */}
                    <div className="flex-shrink-0 border-t border-gray-100 px-8 py-5 flex items-center gap-3 bg-white">
                        <button
                            onClick={goBackToPlans}
                            disabled={isPaying}
                            className="flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 text-subtext font-medium text-sm hover:bg-gray-50 hover:text-text transition-all duration-200 active:scale-95 disabled:opacity-50"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </button>

                        <button
                            onClick={onContinue}
                            disabled={isPaying}
                            className="flex-1 relative flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-[#14532d] to-[#166534] hover:from-[#166534] hover:to-[#15803d] text-white font-bold text-sm shadow-lg shadow-green-900/25 hover:shadow-green-900/35 transition-all duration-300 active:scale-[0.98] disabled:opacity-75"
                        >
                            {isPaying ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Processing payment…
                                </>
                            ) : (
                                <>
                                    Continue to Payment
                                    <span className="text-lg">→</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ServiceDetailsModal
