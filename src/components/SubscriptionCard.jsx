import { Check, X, Crown, Zap } from 'lucide-react'
import { useSubscription } from '../context/SubscriptionContext'

const SubscriptionCard = ({ plan }) => {
    const { openServiceDetails } = useSubscription()
    const { name, price, period, visitsLabel, features, recommended } = plan

    return (
        <div
            onClick={() => openServiceDetails(plan)}
            className={`
                relative flex flex-col rounded-2xl p-6 cursor-pointer
                transition-all duration-300 ease-out
                ${recommended
                    ? [
                        'bg-gradient-to-b from-[#14532d] to-[#166534] text-white',
                        'border-2 border-[#22c55e]',
                        'shadow-2xl shadow-green-900/40',
                        'scale-[1.04] hover:scale-[1.07]',
                        'ring-4 ring-[#22c55e]/20',
                    ].join(' ')
                    : [
                        'bg-white text-text',
                        'border border-gray-100',
                        'shadow-md',
                        'hover:scale-[1.05] hover:shadow-xl hover:shadow-green-900/10 hover:border-[#22c55e]/50',
                    ].join(' ')
                }
            `}
            style={recommended ? { animation: 'glow-pulse 3s ease-in-out infinite' } : {}}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && openServiceDetails(plan)}
            aria-label={`Select ${name}`}
        >
            {/* Recommended Badge */}
            {recommended && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <div className="flex items-center gap-1.5 bg-[#22c55e] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-green-400/40 whitespace-nowrap">
                        <Crown className="w-3.5 h-3.5 fill-white" />
                        Recommended
                    </div>
                </div>
            )}

            {/* Plan name label */}
            <div className={`mt-2 flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase mb-3 ${recommended ? 'text-green-300' : 'text-[#14532d]'}`}>
                {recommended && <Zap className="w-3.5 h-3.5 fill-current" />}
                {name}
            </div>

            {/* Price */}
            <div className="flex items-end gap-1.5 mb-3">
                <span className={`text-4xl font-bold font-heading leading-none ${recommended ? 'text-white' : 'text-[#14532d]'}`}>
                    ₹{price.toLocaleString('en-IN')}
                </span>
                <span className={`text-sm mb-1 ${recommended ? 'text-green-200' : 'text-subtext'}`}>
                    / {period}
                </span>
            </div>

            {/* Visits pill */}
            <div className={`inline-block self-start px-3 py-1 rounded-full text-xs font-semibold mb-5 ${recommended ? 'bg-green-700/50 text-green-100' : 'bg-green-50 text-[#14532d]'}`}>
                {visitsLabel}
            </div>

            {/* Divider */}
            <div className={`h-px mb-5 ${recommended ? 'bg-green-600/40' : 'bg-gray-100'}`} />

            {/* Features */}
            <ul className="flex-1 space-y-2.5 mb-6">
                {features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm">
                        <span className={`
                            flex-shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center
                            ${recommended ? 'bg-green-400/20 text-green-300' : 'bg-green-50 text-[#22c55e]'}
                        `}>
                            <Check className="w-3 h-3" strokeWidth={3} />
                        </span>
                        <span className={recommended ? 'text-green-100' : 'text-subtext'}>
                            {feature}
                        </span>
                    </li>
                ))}
            </ul>

            {/* CTA Button */}
            <button
                onClick={(e) => { e.stopPropagation(); openServiceDetails(plan) }}
                className={`
                    w-full py-3 rounded-xl font-semibold text-sm
                    transition-all duration-200 active:scale-95
                    ${recommended
                        ? 'bg-[#22c55e] hover:bg-[#16a34a] text-white shadow-lg shadow-green-400/30 hover:shadow-green-500/50'
                        : 'bg-[#14532d] hover:bg-[#166534] text-white hover:shadow-lg hover:shadow-green-900/20'
                    }
                `}
            >
                Get Started →
            </button>
        </div>
    )
}

export default SubscriptionCard
