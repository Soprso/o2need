import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useUser } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Truck, CheckCircle, CreditCard, IndianRupee } from 'lucide-react'

const Checkout = () => {
    const { items, totalPrice, clearCart } = useCart()
    const { user } = useUser()
    const navigate = useNavigate()
    const [step, setStep] = useState(1) // 1=Address, 2=Review & Pay
    const [loading, setLoading] = useState(false)

    const [address, setAddress] = useState({
        name: user?.fullName || '',
        phone: '',
        line1: '',
        line2: '',
        city: '',
        state: '',
        pincode: '',
    })

    const handleAddressChange = (e) => setAddress(prev => ({ ...prev, [e.target.name]: e.target.value }))

    const handlePlaceOrder = async () => {
        setLoading(true)
        await new Promise(r => setTimeout(r, 1500)) // Simulate processing

        const orderId = 'ORD-' + Date.now()
        const order = {
            id: orderId,
            items: items.map(i => ({ ...i })),
            address,
            total: totalPrice,
            payment: 'Cash on Delivery',
            status: 'Confirmed',
            placedAt: new Date().toISOString(),
            timeline: [
                { status: 'Order Placed', time: new Date().toISOString(), done: true },
                { status: 'Order Confirmed', time: new Date().toISOString(), done: true },
                { status: 'Preparing', time: null, done: false },
                { status: 'Out for Delivery', time: null, done: false },
                { status: 'Delivered', time: null, done: false },
            ],
        }

        // Save to localStorage
        const key = `orders_${user.id}`
        const existing = JSON.parse(localStorage.getItem(key) || '[]')
        localStorage.setItem(key, JSON.stringify([order, ...existing]))

        clearCart()
        setLoading(false)
        navigate(`/order-confirmation/${orderId}`)
    }

    const delivery = 0
    const total = totalPrice + delivery

    return (
        <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-16 max-w-5xl">
            <div className="mb-8 space-y-2">
                <h1 className="text-3xl sm:text-4xl font-heading font-bold text-primary">Checkout</h1>
                <div className="w-16 h-1.5 bg-secondary rounded-full" />
            </div>

            {/* Progress Steps */}
            <div className="flex items-center gap-2 mb-10">
                {['Delivery Address', 'Review & Pay'].map((s, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${step === i + 1 ? 'bg-primary text-white' : step > i + 1 ? 'bg-secondary/20 text-secondary' : 'bg-gray-100 text-subtext'}`}>
                            {step > i + 1 ? <CheckCircle className="w-4 h-4" /> : <span>{i + 1}</span>}
                            <span className="hidden sm:inline">{s}</span>
                        </div>
                        {i < 1 && <div className={`flex-1 h-0.5 w-8 rounded ${step > i + 1 ? 'bg-secondary' : 'bg-gray-200'}`} />}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    {/* Step 1: Address */}
                    {step === 1 && (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="bg-primary/10 p-2.5 rounded-xl"><MapPin className="w-5 h-5 text-primary" /></div>
                                <h2 className="font-heading font-bold text-text text-lg">Delivery Address</h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    { name: 'name', label: 'Full Name', full: true },
                                    { name: 'phone', label: 'Phone Number', type: 'tel' },
                                    { name: 'line1', label: 'Address Line 1', full: true },
                                    { name: 'line2', label: 'Address Line 2 (Optional)', full: true },
                                    { name: 'city', label: 'City' },
                                    { name: 'state', label: 'State' },
                                    { name: 'pincode', label: 'PIN Code' },
                                ].map(f => (
                                    <div key={f.name} className={f.full ? 'sm:col-span-2' : ''}>
                                        <label className="block text-xs font-bold uppercase tracking-wide text-subtext mb-1.5">{f.label}</label>
                                        <input
                                            name={f.name} type={f.type || 'text'}
                                            value={address[f.name]} onChange={handleAddressChange}
                                            required={f.name !== 'line2'}
                                            className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
                                        />
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => { if (Object.entries(address).filter(([k]) => k !== 'line2').every(([, v]) => v.trim())) setStep(2) }}
                                className="w-full btn-primary py-3.5 mt-2 text-sm font-bold"
                            >
                                Continue to Review
                            </button>
                        </div>
                    )}

                    {/* Step 2: Review & Pay */}
                    {step === 2 && (
                        <div className="space-y-4">
                            {/* Address Summary */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-primary/10 p-2.5 rounded-xl"><MapPin className="w-5 h-5 text-primary" /></div>
                                        <h3 className="font-heading font-bold text-text">Delivery Address</h3>
                                    </div>
                                    <button onClick={() => setStep(1)} className="text-xs text-primary font-bold hover:underline">Change</button>
                                </div>
                                <p className="text-sm text-text font-semibold">{address.name} &bull; {address.phone}</p>
                                <p className="text-sm text-subtext mt-1">{address.line1}{address.line2 ? ', ' + address.line2 : ''}, {address.city}, {address.state} - {address.pincode}</p>
                            </div>

                            {/* Items */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="bg-primary/10 p-2.5 rounded-xl"><Truck className="w-5 h-5 text-primary" /></div>
                                    <h3 className="font-heading font-bold text-text">Order Items</h3>
                                </div>
                                <div className="space-y-3">
                                    {items.map(({ product, qty }) => (
                                        <div key={product.id} className="flex items-center gap-3">
                                            <img src={product.image_url} alt={product.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-text truncate">{product.name}</p>
                                                <p className="text-xs text-subtext">Qty: {qty}</p>
                                            </div>
                                            <p className="font-bold text-sm text-primary">₹{(product.price * qty).toLocaleString()}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Payment */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="bg-primary/10 p-2.5 rounded-xl"><CreditCard className="w-5 h-5 text-primary" /></div>
                                    <h3 className="font-heading font-bold text-text">Payment Method</h3>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-green-50 border-2 border-primary rounded-xl">
                                    <div className="bg-primary/10 p-2 rounded-lg"><IndianRupee className="w-5 h-5 text-primary" /></div>
                                    <div>
                                        <p className="font-bold text-text text-sm">Cash on Delivery</p>
                                        <p className="text-xs text-subtext">Pay when your plants arrive at your door</p>
                                    </div>
                                    <div className="ml-auto w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                        <div className="w-2.5 h-2.5 rounded-full bg-white" />
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={loading}
                                className="w-full btn-primary py-4 text-base font-bold flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {loading ? (
                                    <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Placing Order...</>
                                ) : 'Place Order — Cash on Delivery'}
                            </button>
                        </div>
                    )}
                </div>

                {/* Order Summary Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-32 space-y-4">
                        <h2 className="font-heading font-bold text-text text-base">Price Details</h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between text-subtext">
                                <span>Price ({items.reduce((s, i) => s + i.qty, 0)} items)</span>
                                <span className="text-text">₹{totalPrice.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-subtext">
                                <span>Delivery Charges</span>
                                <span className="text-secondary font-bold">FREE</span>
                            </div>
                            <div className="border-t pt-3 flex justify-between font-bold text-text">
                                <span>Total Amount</span>
                                <span className="text-primary text-lg">₹{total.toLocaleString()}</span>
                            </div>
                        </div>
                        <p className="text-xs text-secondary font-medium text-center">🎉 You save ₹{(totalPrice * 0.05).toFixed(0)} on this order!</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Checkout
