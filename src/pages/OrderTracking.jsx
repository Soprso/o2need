import { useParams, Link } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import { CheckCircle, Circle, Package, Truck, Home, MapPin, ShoppingBag } from 'lucide-react'

const steps = [
    { key: 'Order Placed', icon: ShoppingBag, desc: 'We received your order' },
    { key: 'Order Confirmed', icon: CheckCircle, desc: 'Your order has been confirmed' },
    { key: 'Preparing', icon: Package, desc: 'Your plants are being carefully packed' },
    { key: 'Out for Delivery', icon: Truck, desc: 'On the way to your address' },
    { key: 'Delivered', icon: Home, desc: 'Delivered to your doorstep' },
]

const OrderTracking = () => {
    const { orderId } = useParams()
    const { user } = useUser()
    const orders = JSON.parse(localStorage.getItem(`orders_${user?.id}`) || '[]')
    const order = orders.find(o => o.id === orderId)

    if (!order) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 space-y-4">
            <Package className="w-16 h-16 text-gray-200" />
            <p className="text-xl font-heading font-bold text-text">Order not found</p>
            <Link to="/orders" className="btn-primary text-sm px-6">View All Orders</Link>
        </div>
    )

    const currentStepIndex = steps.findIndex(s => s.key === order.status)
    const confirmedIndex = Math.max(currentStepIndex, 1) // At least "Confirmed" is done

    const fmt = (iso) => iso ? new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Pending'

    return (
        <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-16 max-w-3xl">
            <div className="mb-8 space-y-2">
                <h1 className="text-3xl sm:text-4xl font-heading font-bold text-primary">Track Order</h1>
                <div className="w-16 h-1.5 bg-secondary rounded-full" />
                <p className="text-subtext text-sm font-mono">{orderId}</p>
            </div>

            {/* Status Banner */}
            <div className="bg-gradient-to-r from-primary to-[#1a6b38] text-white rounded-2xl p-6 mb-8 flex justify-between items-center">
                <div>
                    <p className="text-white/70 text-xs font-medium uppercase tracking-widest mb-1">Current Status</p>
                    <p className="text-2xl font-heading font-bold">{order.status}</p>
                    <p className="text-white/70 text-xs mt-1">Placed on {fmt(order.placedAt)}</p>
                </div>
                <div className="bg-white/20 p-4 rounded-xl">
                    <Truck className="w-8 h-8" />
                </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
                <h2 className="font-heading font-bold text-text mb-6">Order Timeline</h2>
                <div className="space-y-0">
                    {steps.map((step, i) => {
                        const done = i <= confirmedIndex
                        const isCurrent = i === confirmedIndex
                        const timelineItem = order.timeline?.find(t => t.status === step.key)
                        return (
                            <div key={step.key} className="flex gap-4">
                                {/* Connector */}
                                <div className="flex flex-col items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${done ? 'bg-secondary' : 'bg-gray-100'} ${isCurrent ? 'ring-4 ring-secondary/30' : ''}`}>
                                        {done
                                            ? <CheckCircle className="w-5 h-5 text-white" />
                                            : <Circle className="w-5 h-5 text-gray-300" />
                                        }
                                    </div>
                                    {i < steps.length - 1 && (
                                        <div className={`w-0.5 h-12 mt-1 rounded ${done && i < confirmedIndex ? 'bg-secondary' : 'bg-gray-100'}`} />
                                    )}
                                </div>
                                {/* Content */}
                                <div className="pb-4 pt-1">
                                    <p className={`text-sm font-bold ${done ? 'text-text' : 'text-subtext'}`}>{step.key}</p>
                                    <p className="text-xs text-subtext">{step.desc}</p>
                                    {done && timelineItem?.time && (
                                        <p className="text-xs text-secondary font-medium mt-0.5">{fmt(timelineItem.time)}</p>
                                    )}
                                    {!done && <p className="text-xs text-gray-300 mt-0.5">Pending</p>}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary/10 p-2.5 rounded-xl"><MapPin className="w-5 h-5 text-primary" /></div>
                    <h3 className="font-heading font-bold text-text">Delivery Address</h3>
                </div>
                <p className="text-sm font-semibold text-text">{order.address?.name} &bull; {order.address?.phone}</p>
                <p className="text-sm text-subtext mt-1">
                    {order.address?.line1}{order.address?.line2 ? ', ' + order.address?.line2 : ''}, {order.address?.city}, {order.address?.state} - {order.address?.pincode}
                </p>
            </div>

            {/* Items */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-heading font-bold text-text mb-4">Items in this Order</h3>
                <div className="space-y-4">
                    {order.items?.map(({ product, qty }) => (
                        <div key={product.id} className="flex items-center gap-4">
                            <img src={product.image_url} alt={product.name} className="w-14 h-14 rounded-xl object-cover" />
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-text text-sm truncate">{product.name}</p>
                                <p className="text-xs text-subtext">Qty: {qty}</p>
                            </div>
                            <p className="font-bold text-primary text-sm">₹{(product.price * qty).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
                <div className="border-t border-gray-50 pt-4 mt-4 flex justify-between font-bold text-sm">
                    <span className="text-text">Total (COD)</span>
                    <span className="text-primary">₹{order.total?.toLocaleString()}</span>
                </div>
            </div>

            <div className="flex gap-3 mt-8">
                <Link to="/orders" className="flex-1 text-center border-2 border-primary text-primary py-3 rounded-xl font-bold text-sm hover:bg-primary/5 transition-all">
                    All Orders
                </Link>
                <Link to="/" className="flex-1 text-center btn-primary py-3 text-sm">
                    Shop More
                </Link>
            </div>
        </div>
    )
}

export default OrderTracking
