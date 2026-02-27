import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import { CartProvider } from './context/CartContext'
import { SubscriptionProvider } from './context/SubscriptionContext'
import App from './App.jsx'
import './index.css'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
    throw new Error("Missing Publishable Key. Add VITE_CLERK_PUBLISHABLE_KEY to your .env file")
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ClerkProvider
            publishableKey={PUBLISHABLE_KEY}
            afterSignInUrl="/"
            afterSignUpUrl="/"
            afterSignOutUrl="/"
        >
            <BrowserRouter>
                <SubscriptionProvider>
                    <CartProvider>
                        <App />
                    </CartProvider>
                </SubscriptionProvider>
            </BrowserRouter>
        </ClerkProvider>
    </React.StrictMode>,
)
