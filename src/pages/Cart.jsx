import { useCart } from '../context/CartContext'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Leaf } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

const Cart = () => {
    const { items, removeFromCart, updateQty, totalPrice, clearCart } = useCart()
    const navigate = useNavigate()

    if (items.length === 0) return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 space-y-6">
            <div className="bg-primary/10 p-8 rounded-3xl">
                <ShoppingBag className="w-16 h-16 text-primary" />
            </div>
            <div>
                <h2 className="text-2xl font-heading font-bold text-text">Your cart is empty</h2>
                <p className="text-subtext mt-2 text-sm">Add some beautiful plants to get started!</p>
            </div>
            <Link to="/plants" className="btn-primary text-sm px-8">Shop Now</Link>
        </div>
    )

    const delivery = 0
    const total = totalPrice + delivery

    return (
        <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-16 max-w-5xl">
            <div className="mb-8 space-y-2">
                <h1 className="text-4xl font-heading font-bold text-primary">My Cart</h1>
                <div className="w-16 h-1.5 bg-secondary rounded-full" />
                <p className="text-subtext text-sm">{items.length} item{items.length !== 1 ? 's' : ''} in your cart</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {items.map(({ product, qty }) => (
                        <div key={product.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 flex gap-4 items-start">
                            <img src={product.image_url} alt={product.name} className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover flex-shrink-0" />
                            <div className="flex-1 min-w-0 space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                    <h3 className="font-heading font-bold text-text text-sm sm:text-base leading-snug">{product.name}</h3>
                                    <button onClick={() => removeFromCart(product.id)} className="text-red-400 hover:text-red-600 transition-colors p-1 flex-shrink-0">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <p className="text-primary font-bold text-sm">₹{product.price}</p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                                        <button onClick={() => updateQty(product.id, qty - 1)} className="px-3 py-2 text-subtext hover:text-primary hover:bg-green-50 transition-colors">
                                            <Minus className="w-3.5 h-3.5" />
                                        </button>
                                        <span className="px-3 py-1.5 text-sm font-bold text-text min-w-[2rem] text-center">{qty}</span>
                                        <button onClick={() => updateQty(product.id, qty + 1)} className="px-3 py-2 text-subtext hover:text-primary hover:bg-green-50 transition-colors">
                                            <Plus className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                    <span className="font-bold text-text text-sm">₹{(product.price * qty).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}

                    <button onClick={clearCart} className="text-xs text-red-400 hover:text-red-600 font-medium flex items-center gap-1.5 mt-2 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" /> Clear Cart
                    </button>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-32 space-y-5">
                        <h2 className="font-heading font-bold text-text text-lg">Order Summary</h2>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between text-subtext">
                                <span>Subtotal ({items.reduce((s, i) => s + i.qty, 0)} items)</span>
                                <span className="font-medium text-text">₹{totalPrice.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-subtext">
                                <span>Delivery</span>
                                <span className="font-bold text-secondary">FREE</span>
                            </div>
                            <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-text">
                                <span>Total</span>
                                <span className="text-primary text-lg">₹{total.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl p-3 text-sm text-secondary">
                            <Leaf className="w-4 h-4 flex-shrink-0" />
                            <span className="font-medium">Free delivery on all orders!</span>
                        </div>

                        <button onClick={() => navigate('/checkout')} className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 text-sm font-bold">
                            Proceed to Checkout <ArrowRight className="w-4 h-4" />
                        </button>

                        <Link to="/plants" className="block text-center text-xs text-subtext hover:text-primary transition-colors">
                            ← Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cart
