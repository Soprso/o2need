import { Bell, Lock, Moon, Globe } from 'lucide-react'
import { useState } from 'react'

const Toggle = ({ defaultOn = false }) => {
    const [on, setOn] = useState(defaultOn)
    return (
        <button onClick={() => setOn(!on)} className={`w-11 h-6 rounded-full transition-all flex-shrink-0 ${on ? 'bg-secondary' : 'bg-gray-200'}`}>
            <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${on ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
    )
}

const Settings = () => (
    <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-20 max-w-2xl">
        <div className="mb-10 space-y-2">
            <h1 className="text-4xl font-heading font-bold text-primary">Settings</h1>
            <div className="w-16 h-1.5 bg-secondary rounded-full" />
        </div>

        {[
            {
                title: 'Notifications', icon: Bell,
                items: [
                    { label: 'Email notifications', sub: 'Receive order updates via email', on: true },
                    { label: 'Push notifications', sub: 'Browser and app alerts', on: false },
                    { label: 'Promotional offers', sub: 'Deals, sales, and new arrivals', on: true },
                ],
            },
            {
                title: 'Privacy & Security', icon: Lock,
                items: [
                    { label: 'Two-factor authentication', sub: 'Extra security for your account', on: false },
                    { label: 'Login alerts', sub: 'Get notified on new sign-ins', on: true },
                ],
            },
            {
                title: 'Appearance', icon: Moon,
                items: [
                    { label: 'Dark mode', sub: 'Switch to dark theme', on: false },
                ],
            },
            {
                title: 'Language & Region', icon: Globe,
                items: [
                    { label: 'Indian Rupee (₹)', sub: 'Currency display preference', on: true },
                ],
            },
        ].map((section, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
                <div className="flex items-center gap-3 mb-5">
                    <div className="bg-primary/10 p-2.5 rounded-xl"><section.icon className="w-5 h-5 text-primary" /></div>
                    <h2 className="font-heading font-bold text-text text-base">{section.title}</h2>
                </div>
                <div className="space-y-4">
                    {section.items.map((item, j) => (
                        <div key={j} className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-text">{item.label}</p>
                                <p className="text-xs text-subtext mt-0.5">{item.sub}</p>
                            </div>
                            <Toggle defaultOn={item.on} />
                        </div>
                    ))}
                </div>
            </div>
        ))}
    </div>
)

export default Settings
