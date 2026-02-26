import { useParams, Link } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import { CheckCircle, Package, ArrowRight, Home } from 'lucide-react'

const OrderConfirmation = () => {
    const { orderId } = useParams()
    const { user } = useUser()
    const orders = JSON.parse(localStorage.getItem(`orders_${user?.id}`) || '[]')
    const order = orders.find(o => o.id === orderId)

    return (
        <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-24 max-w-2xl text-center">
            {/* Success Icon */}
            <div className="flex items-center justify-center mb-8">
                <div className="bg-secondary/10 p-8 rounded-full">
                    <CheckCircle className="w-20 h-20 text-secondary" />
                </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-primary mb-3">Order Placed!</h1>
            <p className="text-subtext mb-2">Thank you, <strong>{order?.address?.name || user?.firstName}</strong>! 🌿</p>
            <p className="text-subtext text-sm mb-8">
                Your order <span className="font-bold text-primary">{orderId}</span> has been confirmed.
                You'll receive your plants within 2–5 business days.
            </p>

            {/* Order Summary Card */}
            {order && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8 text-left space-y-4">
                    <div className="flex items-center gap-3 pb-4 border-b border-gray-50">
                        <div className="bg-primary/10 p-3 rounded-xl"><Package className="w-5 h-5 text-primary" /></div>
                        <div>
                            <p className="font-bold text-text text-sm">{orderId}</p>
                            <p className="text-xs text-subtext">Cash on Delivery • Free Delivery</p>
                        </div>
                        <span className="ml-auto bg-secondary/10 text-secondary text-xs font-bold px-3 py-1 rounded-full">Confirmed</span>
                    </div>

                    {order.items.map(({ product, qty }) => (
                        <div key={product.id} className="flex items-center gap-3">
                            <img src={product.image_url} alt={product.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-text truncate">{product.name}</p>
                                <p className="text-xs text-subtext">Qty: {qty}</p>
                            </div>
                            <p className="text-sm font-bold text-primary">₹{(product.price * qty).toLocaleString()}</p>
                        </div>
                    ))}

                    <div className="pt-4 border-t border-gray-50 flex justify-between font-bold">
                        <span className="text-sm text-text">Total Paid (COD)</span>
                        <span className="text-primary">₹{order.total.toLocaleString()}</span>
                    </div>

                    <div className="text-sm text-subtext">
                        <p className="font-semibold text-text mb-0.5">Deliver to:</p>
                        <p>{order.address.line1}{order.address.line2 ? ', ' + order.address.line2 : ''}, {order.address.city}, {order.address.state} - {order.address.pincode}</p>
                    </div>
                </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to={`/track/${orderId}`} className="btn-primary px-8 py-3 flex items-center gap-2 justify-center text-sm">
                    <Package className="w-4 h-4" /> Track Order <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/" className="border-2 border-primary text-primary px-8 py-3 rounded-xl font-bold flex items-center gap-2 justify-center text-sm hover:bg-primary/5 transition-all">
                    <Home className="w-4 h-4" /> Back to Home
                </Link>
            </div>
        </div>
    )
}

export default OrderConfirmation
