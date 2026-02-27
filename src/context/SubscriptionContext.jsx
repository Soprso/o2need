import { createContext, useContext, useState, useCallback } from 'react'

const SubscriptionContext = createContext()
export const useSubscription = () => useContext(SubscriptionContext)

// ─── Plans Data ──────────────────────────────────────────────────────────────
export const MEMBERSHIP_PLANS = [
    {
        id: 'starter',
        name: 'Starter Plan',
        price: 899,
        period: 'month',
        visits: 2,
        visitsLabel: '2 visits / month',
        recommended: false,
        services: [
            { label: 'Plant Health Analysis', included: true },
            { label: 'Basic Cutting & Pruning', included: true },
            { label: 'Dry Leaf Removal', included: true },
            { label: 'Plant Watering', included: true },
            { label: 'Site Cleaning', included: true },
            { label: 'Soil Nourishment Tips', included: false },
            { label: 'Pest & Disease Control', included: false },
            { label: 'Priority Support', included: false },
        ],
        features: [
            'Plant health analysis',
            'Basic cutting & pruning',
            'Dry leaf removal',
            'Plant watering',
            'Site cleaning',
        ],
    },
    {
        id: 'standard',
        name: 'Standard Plan',
        price: 1199,
        period: 'month',
        visits: 3,
        visitsLabel: '3 visits / month',
        recommended: false,
        services: [
            { label: 'Plant Health Analysis', included: true },
            { label: 'Cutting & Pruning', included: true },
            { label: 'Dry Leaf Removal', included: true },
            { label: 'Plant Watering', included: true },
            { label: 'Site Cleaning', included: true },
            { label: 'Soil Nourishment Tips', included: true },
            { label: 'Pest & Disease Control', included: false },
            { label: 'Priority Support', included: false },
        ],
        features: [
            'Plant health analysis',
            'Cutting & pruning',
            'Dry leaf removal',
            'Plant watering',
            'Site cleaning',
            'Soil nourishment tips',
        ],
    },
    {
        id: 'pro',
        name: 'Pro Plan',
        price: 1699,
        period: 'month',
        visits: 4,
        visitsLabel: '4 visits / month',
        recommended: true,
        services: [
            { label: 'Full Plant Health Analysis', included: true },
            { label: 'Advanced Cutting & Pruning', included: true },
            { label: 'Dry Leaf Removal', included: true },
            { label: 'Plant Watering', included: true },
            { label: 'Deep Site Cleaning', included: true },
            { label: 'Soil Nourishment & Fertilising', included: true },
            { label: 'Pest & Disease Control', included: true },
            { label: 'Priority Support', included: true },
        ],
        features: [
            'Full plant health analysis',
            'Advanced cutting & pruning',
            'Dry leaf removal',
            'Plant watering',
            'Deep site cleaning',
            'Soil nourishment & fertilising',
            'Pest & disease control',
            'Dedicated phone support',
        ],
    },
]

// modal steps: null | 'plans' | 'details' | 'loading' | 'success'

// ─── Provider ─────────────────────────────────────────────────────────────────
export const SubscriptionProvider = ({ children }) => {
    const [step, setStep] = useState(null)        // null | 'plans' | 'details' | 'success'
    const [selectedPlan, setSelectedPlan] = useState(null)
    const [isPaying, setIsPaying] = useState(false)

    // Open the plans picker modal
    const openModal = useCallback(() => setStep('plans'), [])

    // Close everything
    const closeAll = useCallback(() => {
        setStep(null)
        setSelectedPlan(null)
        setIsPaying(false)
    }, [])

    // Called from SubscriptionCard → open Service Details modal
    const openServiceDetails = useCallback((plan) => {
        setSelectedPlan(plan)
        setStep('details')
    }, [])

    // Go back from Service Details to Plans
    const goBackToPlans = useCallback(() => setStep('plans'), [])

    // ── Load Razorpay checkout.js script once ─────────────────────────────────
    const loadRazorpayScript = () =>
        new Promise((resolve) => {
            if (document.getElementById('razorpay-script')) { resolve(true); return }
            const script = document.createElement('script')
            script.id = 'razorpay-script'
            script.src = 'https://checkout.razorpay.com/v1/checkout.js'
            script.onload = () => resolve(true)
            script.onerror = () => resolve(false)
            document.body.appendChild(script)
        })

    // ── Real Razorpay integration ─────────────────────────────────────────────
    const handlePayment = useCallback(async (plan, contactPhone) => {
        setIsPaying(true)

        const loaded = await loadRazorpayScript()
        if (!loaded) {
            alert('Failed to load Razorpay. Please check your internet connection.')
            setIsPaying(false)
            return
        }

        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: plan.price * 100,          // paise
            currency: 'INR',
            name: 'O2need',
            description: `${plan.name} — ${plan.visitsLabel}`,
            image: '/as/logo.png',
            handler: (response) => {
                // payment.id guarantees server-side verification later
                console.log('Razorpay payment success:', response.razorpay_payment_id)
                setIsPaying(false)
                setStep('success')
            },
            prefill: {
                contact: contactPhone || '',
            },
            notes: {
                plan_id: plan.id,
                plan_name: plan.name,
            },
            theme: {
                color: '#14532d',
            },
            modal: {
                ondismiss: () => {
                    console.log('Razorpay checkout closed by user')
                    setIsPaying(false)
                },
            },
        }

        const rzp = new window.Razorpay(options)
        rzp.on('payment.failed', (response) => {
            console.error('Payment failed:', response.error)
            alert(`Payment failed: ${response.error.description}`)
            setIsPaying(false)
        })
        rzp.open()
    }, [])


    return (
        <SubscriptionContext.Provider
            value={{
                step,
                selectedPlan,
                isPaying,
                plans: MEMBERSHIP_PLANS,
                openModal,
                closeAll,
                openServiceDetails,
                goBackToPlans,
                handlePayment,
            }}
        >
            {children}
        </SubscriptionContext.Provider>
    )
}
