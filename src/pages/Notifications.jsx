import { Bell, ShoppingBag, Truck, Star } from 'lucide-react'

const notifications = [
    { icon: Truck, color: 'text-blue-500 bg-blue-50', title: 'Your order is on the way!', desc: 'ORD-2026-002 has been dispatched and is expected to arrive by Feb 28.', time: '2 hours ago' },
    { icon: ShoppingBag, color: 'text-secondary bg-secondary/10', title: 'Order Delivered', desc: 'Your ORD-2026-001 has been delivered successfully. Enjoy your plants!', time: '6 days ago' },
    { icon: Star, color: 'text-amber-500 bg-amber-50', title: 'New collection available', desc: 'Check out our exclusive Spring 2026 indoor plant collection.', time: '1 week ago' },
]

const Notifications = () => (
    <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-20 max-w-2xl">
        <div className="mb-10 space-y-2">
            <h1 className="text-4xl font-heading font-bold text-primary">Notifications</h1>
            <div className="w-16 h-1.5 bg-secondary rounded-full" />
        </div>
        <div className="space-y-4">
            {notifications.map((n, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex gap-4 items-start">
                    <div className={`p-3 rounded-xl flex-shrink-0 ${n.color.split(' ')[1]}`}>
                        <n.icon className={`w-5 h-5 ${n.color.split(' ')[0]}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-heading font-bold text-text text-sm">{n.title}</p>
                        <p className="text-subtext text-xs mt-1 leading-relaxed">{n.desc}</p>
                        <p className="text-xs text-subtext mt-2">{n.time}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
)

export default Notifications
