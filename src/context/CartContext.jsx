import { createContext, useContext, useState, useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }) => {
    const { user } = useUser()
    const storageKey = user ? `cart_${user.id}` : 'cart_guest'

    const [items, setItems] = useState(() => {
        try { return JSON.parse(localStorage.getItem(storageKey)) || [] } catch { return [] }
    })

    // Sync with localStorage whenever items or user changes
    useEffect(() => {
        localStorage.setItem(storageKey, JSON.stringify(items))
    }, [items, storageKey])

    // Reload cart when user changes (login/logout)
    useEffect(() => {
        try { setItems(JSON.parse(localStorage.getItem(storageKey)) || []) } catch { setItems([]) }
    }, [storageKey])

    const addToCart = (product, qty = 1) => {
        setItems(prev => {
            const existing = prev.find(i => i.product.id === product.id)
            if (existing) return prev.map(i => i.product.id === product.id ? { ...i, qty: i.qty + qty } : i)
            return [...prev, { product, qty }]
        })
    }

    const removeFromCart = (productId) => setItems(prev => prev.filter(i => i.product.id !== productId))

    const updateQty = (productId, qty) => {
        if (qty < 1) { removeFromCart(productId); return }
        setItems(prev => prev.map(i => i.product.id === productId ? { ...i, qty } : i))
    }

    const clearCart = () => setItems([])

    const totalItems = items.reduce((sum, i) => sum + i.qty, 0)
    const totalPrice = items.reduce((sum, i) => sum + i.product.price * i.qty, 0)

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQty, clearCart, totalItems, totalPrice }}>
            {children}
        </CartContext.Provider>
    )
}
