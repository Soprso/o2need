import { Routes, Route, Navigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'
import Home from './pages/Home'
import ProductDetails from './pages/ProductDetails'
import About from './pages/About'
import Policy from './pages/Policy'
import Contact from './pages/Contact'
import Plants from './pages/Plants'
import Fertilizers from './pages/Fertilizers'
import Blogs from './pages/Blogs'
import BlogPost from './pages/BlogPost'
import Profile from './pages/Profile'
import OrderHistory from './pages/OrderHistory'
import Wishlist from './pages/Wishlist'
import Notifications from './pages/Notifications'
import Settings from './pages/Settings'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import OrderTracking from './pages/OrderTracking'
import Dashboard from './pages/Admin/Dashboard'
import AddProduct from './pages/Admin/AddProduct'

const Loader = () => (
    <div className="h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 rounded-full border-t-2 border-primary" />
    </div>
)

const AdminRoute = ({ children }) => {
    const { isLoaded, user } = useUser()
    if (!isLoaded) return <Loader />
    if (user?.primaryEmailAddress?.emailAddress !== 'admin@o2need.com') return <Navigate to="/" replace />
    return children
}

const ProtectedRoute = ({ children }) => {
    const { isLoaded, isSignedIn } = useUser()
    if (!isLoaded) return <Loader />
    if (!isSignedIn) return <Navigate to="/" replace />
    return children
}

function App() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                {/* Public */}
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Plants />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/plants" element={<Plants />} />
                <Route path="/fertilizers" element={<Fertilizers />} />
                <Route path="/blogs" element={<Blogs />} />
                <Route path="/blogs/:id" element={<BlogPost />} />
                <Route path="/about" element={<About />} />
                <Route path="/policy" element={<Policy />} />
                <Route path="/contact" element={<Contact />} />

                {/* Protected — user account */}
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
                <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
                <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

                {/* Protected — e-commerce */}
                <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="/order-confirmation/:orderId" element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />
                <Route path="/track/:orderId" element={<ProtectedRoute><OrderTracking /></ProtectedRoute>} />
            </Route>

            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                <Route index element={<Dashboard />} />
                <Route path="add" element={<AddProduct />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}

export default App
