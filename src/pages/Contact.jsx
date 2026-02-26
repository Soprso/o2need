import { useState } from "react"
import { Mail, Phone, MapPin, Send } from "lucide-react"

const Contact = () => {
    const [form, setForm] = useState({ name: '', email: '', message: '' })
    const [sent, setSent] = useState(false)

    const handleSubmit = (e) => { e.preventDefault(); setSent(true) }

    return (
        <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-24 max-w-5xl">
            <div className="text-center mb-12 sm:mb-16 space-y-4">
                <h1 className="text-4xl sm:text-5xl font-heading font-bold text-primary">Contact Us</h1>
                <div className="w-16 sm:w-20 h-1.5 bg-secondary rounded-full mx-auto"></div>
                <p className="text-subtext max-w-md mx-auto text-sm sm:text-base">Have questions or need help choosing the perfect plant? We'd love to hear from you.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-16">
                <div className="space-y-6">
                    <h2 className="text-xl sm:text-2xl font-heading font-bold text-text">Get In Touch</h2>
                    {[
                        { icon: Mail, label: "Email", value: "hello@o2need.com" },
                        { icon: Phone, label: "Phone", value: "+91 98765 43210" },
                        { icon: MapPin, label: "Address", value: "123 Green Street, Mumbai, India" },
                    ].map((item, i) => (
                        <div key={i} className="flex items-start gap-4">
                            <div className="bg-primary/10 p-3 rounded-xl flex-shrink-0">
                                <item.icon className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-subtext uppercase tracking-wide">{item.label}</p>
                                <p className="text-text font-medium mt-1 text-sm sm:text-base">{item.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm">
                    {sent ? (
                        <div className="flex flex-col items-center justify-center text-center space-y-4 py-10">
                            <div className="bg-secondary/10 p-5 rounded-full"><Send className="w-8 h-8 text-secondary" /></div>
                            <h3 className="text-xl font-bold font-heading text-text">Message Sent!</h3>
                            <p className="text-subtext text-sm">Thank you! We'll get back to you within 24 hours.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {[{ label: 'Name', type: 'text', key: 'name', placeholder: 'Your Name' }, { label: 'Email', type: 'email', key: 'email', placeholder: 'your@email.com' }].map(f => (
                                <div key={f.key}>
                                    <label className="block text-xs font-bold uppercase tracking-wide text-text mb-2">{f.label}</label>
                                    <input required type={f.type} placeholder={f.placeholder}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
                                        value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
                                </div>
                            ))}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wide text-text mb-2">Message</label>
                                <textarea required rows="4" placeholder="How can we help you?"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none text-sm"
                                    value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
                            </div>
                            <button type="submit" className="w-full btn-primary py-3 flex items-center justify-center gap-2 text-sm">
                                <Send className="w-4 h-4" /> Send Message
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}
export default Contact
