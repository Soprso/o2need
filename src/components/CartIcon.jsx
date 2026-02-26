import { useCart } from '../context/CartContext'
import { ShoppingCart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'

const CartIcon = () => {
    const { totalItems } = useCart()
    const { isSignedIn } = useUser()

    return (
        <Link to={isSignedIn ? '/cart' : '#'} className="relative p-2 text-text hover:text-primary transition-colors">
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                    {totalItems > 9 ? '9+' : totalItems}
                </span>
            )}
        </Link>
    )
}

export default CartIcon
