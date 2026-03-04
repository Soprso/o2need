import { createContext, useContext, useState, useCallback } from 'react'
import { useUser, useClerk } from '@clerk/clerk-react'

const SubscriptionContext = createContext()
export const useSubscription = () => useContext(SubscriptionContext)

// ─── Plans Data ──────────────────────────────────────────────────────────────
export const MEMBERSHIP_PLANS = [
    {
        id: 'starter',
        name: 'Starter Plan',
        price: 1399,
        period: 'month',
        visits: 2,
        visitsLabel: '2 visits / month',
        recommended: false,
        services: [
            { label: 'Analyzing overall plant health', included: true },
            { label: 'Removal of dried leaves and dried flowers', included: true },
            { label: 'Cutting, trimming to optimize growth', included: true },
            { label: 'Checking soil condition and loosening soil', included: true },
            { label: 'Providing support to creeper & climber plants', included: true },
            { label: 'Watering plants — spray bio-pesticides included', included: true },
            { label: 'Cleaning site', included: true },
            { label: 'Customer garden service before & after picture', included: true },
        ],
        features: [
            'Analyzing overall plant health',
            'Removal of dried leaves and dried flowers',
            'Cutting, trimming to optimize growth',
            'Checking soil condition and loosening soil',
            'Providing support to creeper & climber plants',
            'Watering plants — spray bio-pesticides included',
            'Cleaning site',
            'Customer garden service before & after picture',
        ],
    },
    {
        id: 'standard',
        name: 'Standard Plan',
        price: 1999,
        period: 'month',
        visits: 3,
        visitsLabel: '3 visits / month',
        recommended: false,
        services: [
            { label: 'Analyzing overall plant health', included: true },
            { label: 'Removal of dried leaves and dried flowers', included: true },
            { label: 'Cutting, trimming to optimize growth', included: true },
            { label: 'Checking soil condition and loosening soil', included: true },
            { label: 'Providing support to creeper & climber plants', included: true },
            { label: 'Watering plants — spray bio-pesticides included', included: true },
            { label: 'Cleaning site', included: true },
            { label: 'Customer garden service before & after picture', included: true },
        ],
        features: [
            'Analyzing overall plant health',
            'Removal of dried leaves and dried flowers',
            'Cutting, trimming to optimize growth',
            'Checking soil condition and loosening soil',
            'Providing support to creeper & climber plants',
            'Watering plants — spray bio-pesticides included',
            'Cleaning site',
            'Customer garden service before & after picture',
        ],
    },
    {
        id: 'pro',
        name: 'Pro Plan',
        price: 2599,
        period: 'month',
        visits: 4,
        visitsLabel: '4 visits / month',
        recommended: true,
        services: [
            { label: 'Analyzing overall plant health', included: true },
            { label: 'Removal of dried leaves and dried flowers', included: true },
            { label: 'Cutting, trimming to optimize growth', included: true },
            { label: 'Checking soil condition and loosening soil', included: true },
            { label: 'Providing support to creeper & climber plants', included: true },
            { label: 'Watering plants — spray bio-pesticides included', included: true },
            { label: 'Cleaning site', included: true },
            { label: 'Customer garden service before & after picture', included: true },
        ],
        features: [
            'Analyzing overall plant health',
            'Removal of dried leaves and dried flowers',
            'Cutting, trimming to optimize growth',
            'Checking soil condition and loosening soil',
            'Providing support to creeper & climber plants',
            'Watering plants — spray bio-pesticides included',
            'Cleaning site',
            'Customer garden service before & after picture',
        ],
    },
]

// ─── Provider ─────────────────────────────────────────────────────────────────
// step: null | 'plans' | 'details' | 'success' | 'perks'
export const SubscriptionProvider = ({ children }) => {
    const { user, isSignedIn } = useUser()
    const { openSignIn } = useClerk()

    const [step, setStep] = useState(null)
    const [selectedPlan, setSelectedPlan] = useState(null)
    const [isPaying, setIsPaying] = useState(false)

    // ── Derived subscription data from Clerk metadata ──────────────────────
    const userSubscription = user?.unsafeMetadata?.subscription ?? null
    const visitsLeft = user?.unsafeMetadata?.visitsLeft ?? 0

    // ── Modal navigation ───────────────────────────────────────────────────
    const openModal = useCallback(() => setStep('plans'), [])
    const openPerksModal = useCallback(() => setStep('perks'), [])
    const closeAll = useCallback(() => {
        setStep(null)
        setSelectedPlan(null)
        setIsPaying(false)
    }, [])
    const openServiceDetails = useCallback((plan) => {
        if (!isSignedIn) {
            // Close the plans modal and open Clerk sign-in
            setStep(null)
            openSignIn()
            return
        }
        setSelectedPlan(plan)
        setStep('details')
    }, [isSignedIn, openSignIn])
    const goBackToPlans = useCallback(() => setStep('plans'), [])

    // ── Load Razorpay checkout.js script once ────────────────────────────
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

    // ── Real Razorpay integration + Clerk metadata save ──────────────────
    const handlePayment = useCallback(async (plan, contactPhone, customerName, customerAddress) => {
        setIsPaying(true)

        const loaded = await loadRazorpayScript()
        if (!loaded) {
            alert('Failed to load Razorpay. Please check your internet connection.')
            setIsPaying(false)
            return
        }

        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: plan.price * 100,
            currency: 'INR',
            name: 'O2need',
            description: `${plan.name} — ${plan.visitsLabel}`,
            image: '/as/logo.png',
            handler: async (response) => {
                console.log('Razorpay payment success:', response.razorpay_payment_id)

                // ── Save subscription to Clerk unsafeMetadata ──────────
                if (user) {
                    const subscriptionData = {
                        planId: plan.id,
                        planName: plan.name,
                        price: plan.price,
                        period: plan.period,
                        visits: plan.visits,
                        visitsLabel: plan.visitsLabel,
                        features: plan.features,
                        purchasedAt: new Date().toISOString(),
                        paymentId: response.razorpay_payment_id,
                    }
                    try {
                        await user.update({
                            unsafeMetadata: {
                                ...user.unsafeMetadata,
                                subscription: subscriptionData,
                                visitsLeft: plan.visits,
                                phone: contactPhone || '',
                                customerName: customerName || '',
                                customerAddress: customerAddress || '',
                            },
                        })
                        console.log('Subscription saved to Clerk metadata')
                    } catch (err) {
                        console.error('Failed to save to Clerk metadata:', err)
                    }
                }

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
            theme: { color: '#14532d' },
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    return (
        <SubscriptionContext.Provider
            value={{
                step,
                selectedPlan,
                isPaying,
                plans: MEMBERSHIP_PLANS,
                userSubscription,
                visitsLeft,
                openModal,
                openPerksModal,
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
