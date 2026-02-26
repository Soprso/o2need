import { useUser } from '@clerk/clerk-react'
import { User, Mail, Phone, MapPin } from 'lucide-react'

const Profile = () => {
    const { user } = useUser()

    return (
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-20 max-w-3xl">
            <div className="mb-10 space-y-2">
                <h1 className="text-4xl font-heading font-bold text-primary">My Profile</h1>
                <div className="w-16 h-1.5 bg-secondary rounded-full" />
            </div>

            {/* Avatar Card */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 mb-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="w-24 h-24 rounded-2xl bg-primary/10 border-2 border-primary/20 overflow-hidden flex items-center justify-center flex-shrink-0">
                    {user?.imageUrl
                        ? <img src={user.imageUrl} alt={user.firstName} className="w-full h-full object-cover" />
                        : <User className="w-10 h-10 text-primary" />
                    }
                </div>
                <div className="text-center sm:text-left space-y-1">
                    <h2 className="text-2xl font-heading font-bold text-text">{user?.fullName || user?.firstName || 'User'}</h2>
                    <p className="text-subtext text-sm">{user?.primaryEmailAddress?.emailAddress}</p>
                    <span className="inline-block mt-2 bg-secondary/10 text-secondary font-bold text-xs px-3 py-1 rounded-full">
                        Verified Member
                    </span>
                </div>
            </div>

            {/* Info Fields */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-5">
                <h3 className="font-heading font-bold text-text text-lg">Account Information</h3>
                {[
                    { icon: User, label: 'Full Name', value: user?.fullName || '—' },
                    { icon: Mail, label: 'Email', value: user?.primaryEmailAddress?.emailAddress || '—' },
                    { icon: Phone, label: 'Phone', value: user?.primaryPhoneNumber?.phoneNumber || 'Not added' },
                    { icon: MapPin, label: 'Location', value: 'India' },
                ].map((f, i) => (
                    <div key={i} className="flex items-start gap-4 pb-5 border-b border-gray-50 last:border-0 last:pb-0">
                        <div className="bg-primary/10 p-2.5 rounded-xl">
                            <f.icon className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                            <p className="text-xs text-subtext font-bold uppercase tracking-wide">{f.label}</p>
                            <p className="text-text font-medium text-sm mt-0.5">{f.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <p className="mt-6 text-xs text-subtext text-center">
                To update your profile details, visit your{' '}
                <a href="https://accounts.clerk.com" target="_blank" rel="noreferrer" className="text-primary font-semibold hover:underline">
                    Clerk account settings
                </a>
            </p>
        </div>
    )
}

export default Profile
