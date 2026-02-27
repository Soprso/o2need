import { useUser } from '@clerk/clerk-react'
import { ShoppingBag, Package, Truck, CheckCircle, ArrowRight, Crown, Leaf, Star } from 'lucide-react'
import { Link } from 'react-router-dom'

const statusConfig = {
    'Confirmed': { icon: CheckCircle, color: 'text-secondary', bg: 'bg-secondary/10' },
    'In Transit': { icon: Truck, color: 'text-blue-500', bg: 'bg-blue-50' },
    'Processing': { icon: Package, color: 'text-amber-500', bg: 'bg-amber-50' },
    'Delivered': { icon: CheckCircle, color: 'text-secondary', bg: 'bg-secondary/10' },
}

const fmt = (iso) => iso
    ? new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—'

const OrderHistory = () => {
    const { user } = useUser()
    const orders = JSON.parse(localStorage.getItem(`orders_${user?.id}`) || '[]')

    // ── Subscription from Clerk unsafeMetadata ──────────────────────────────
    const subscription = user?.unsafeMetadata?.subscription ?? null
    const visitsLeft = user?.unsafeMetadata?.visitsLeft ?? 0

    const hasContent = orders.length > 0 || subscription

    if (!hasContent) return (
        <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-24 max-w-3xl">
            <div className="mb-10 space-y-2">
                <h1 className="text-4xl font-heading font-bold text-primary">Order History</h1>
                <div className="w-16 h-1.5 bg-secondary rounded-full" />
            </div>
            <div className="text-center py-20 space-y-4">
                <ShoppingBag className="w-16 h-16 mx-auto text-gray-200" />
                <p className="text-text font-bold">No orders yet</p>
                <p className="text-subtext text-sm">Your orders will appear here once you place one.</p>
                <Link to="/plants" className="btn-primary text-sm px-8 inline-block">Shop Now</Link>
            </div>
        </div>
    )

    return (
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-20 max-w-3xl">
            <div className="mb-10 space-y-2">
                <h1 className="text-4xl font-heading font-bold text-primary">Order History</h1>
                <div className="w-16 h-1.5 bg-secondary rounded-full" />
                {orders.length > 0 && (
                    <p className="text-subtext text-sm">{orders.length} product order{orders.length !== 1 ? 's' : ''}</p>
                )}
            </div>

            <div className="space-y-4">

                {/* ── Membership Subscription Card ── */}
                {subscription && (
                    <div className="relative bg-gradient-to-br from-[#14532d] to-[#166534] rounded-2xl shadow-xl overflow-hidden">
                        {/* decorative blob */}
                        <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />

                        <div className="px-6 py-5 relative">
                            {/* Top row */}
                            <div className="flex items-start justify-between gap-4 mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Crown className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                        <span className="text-green-200 text-xs font-bold tracking-widest uppercase">Membership</span>
                                    </div>
                                    <p className="text-white font-heading font-bold text-xl">{subscription.planName}</p>
                                    <p className="text-green-200 text-sm mt-0.5">{subscription.visitsLabel}</p>
                                </div>

                                {/* Active badge */}
                                <div className="flex items-center gap-1.5 bg-[#22c55e] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex-shrink-0">
                                    <Star className="w-3 h-3 fill-white" />
                                    Active
                                </div>
                            </div>

                            {/* Stats row */}
                            <div className="flex gap-3 mb-4">
                                <div className="bg-white/15 rounded-xl px-4 py-2.5 text-center">
                                    <p className="text-2xl font-heading font-bold text-white leading-none">{visitsLeft}</p>
                                    <p className="text-green-200 text-xs mt-0.5">visits left</p>
                                </div>
                                <div className="bg-white/10 rounded-xl px-4 py-2.5 text-center">
                                    <p className="text-xl font-heading font-bold text-white leading-none">
                                        ₹{(subscription.price || 0).toLocaleString('en-IN')}
                                    </p>
                                    <p className="text-green-200 text-xs mt-0.5">/ {subscription.period}</p>
                                </div>
                            </div>

                            {/* Included features */}
                            <div className="flex flex-wrap gap-1.5 mb-4">
                                {(subscription.features || []).slice(0, 4).map((f, i) => (
                                    <span key={i} className="text-xs bg-white/10 text-green-100 px-2.5 py-1 rounded-full capitalize">
                                        {f}
                                    </span>
                                ))}
                                {(subscription.features || []).length > 4 && (
                                    <span className="text-xs bg-white/10 text-green-100 px-2.5 py-1 rounded-full">
                                        +{subscription.features.length - 4} more
                                    </span>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="border-t border-white/10 pt-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                <div className="text-xs text-green-300 flex items-center gap-1.5">
                                    <Leaf className="w-3 h-3" />
                                    Purchased: {fmt(subscription.purchasedAt)}
                                </div>
                                {subscription.paymentId && (
                                    <span className="text-xs font-mono text-green-400 bg-white/5 px-2 py-0.5 rounded">
                                        #{subscription.paymentId}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Product Orders ── */}
                {orders.map(order => {
                    const s = statusConfig[order.status] || statusConfig['Confirmed']
                    return (
                        <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div>
                                    <p className="font-heading font-bold text-text text-base">{order.id}</p>
                                    <p className="text-xs text-subtext">{fmt(order.placedAt)}</p>
                                </div>
                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold self-start ${s.bg} ${s.color}`}>
                                    <s.icon className="w-3.5 h-3.5" /> {order.status}
                                </div>
                            </div>

                            <div className="flex gap-2 flex-wrap">
                                {order.items?.slice(0, 3).map(({ product }) => (
                                    <img key={product.id} src={product.image_url} alt={product.name} className="w-12 h-12 rounded-xl object-cover" />
                                ))}
                                {order.items?.length > 3 && <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-xs font-bold text-subtext">+{order.items.length - 3}</div>}
                            </div>

                            <div className="border-t border-gray-50 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                <p className="text-primary font-bold text-sm">₹{order.total?.toLocaleString()} • COD</p>
                                <Link to={`/track/${order.id}`} className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-secondary transition-colors">
                                    Track Order <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default OrderHistory
