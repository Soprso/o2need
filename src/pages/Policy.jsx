const Policy = () => (
    <div className="container mx-auto px-6 py-24 max-w-3xl">
        <div className="mb-12 space-y-4">
            <h1 className="text-5xl font-heading font-bold text-primary">Privacy Policy</h1>
            <div className="w-20 h-1.5 bg-secondary rounded-full"></div>
            <p className="text-subtext text-sm">Last updated: February 2026</p>
        </div>

        <div className="space-y-10 text-subtext leading-relaxed">
            {[
                {
                    title: "1. Information We Collect",
                    content: "We collect information that you provide directly to us, such as your name, email address, and payment information when you create an account or make a purchase. We also collect usage data automatically when you visit our website."
                },
                {
                    title: "2. How We Use Your Information",
                    content: "We use the information we collect to process your orders, personalize your experience, send you important notifications, improve our services, and provide customer support."
                },
                {
                    title: "3. Data Sharing & Security",
                    content: "We do not sell, trade, or share your personal information with third parties except to provide the services you request (e.g., payment processing and shipping). All data is stored securely and encrypted."
                },
                {
                    title: "4. Cookies",
                    content: "Our website uses cookies to enhance your browsing experience. Cookies are small files stored on your device. You can choose to disable cookies through your browser settings, though this may affect some functionality."
                },
                {
                    title: "5. Returns & Refunds",
                    content: "We accept returns within 7 days of delivery for damaged or incorrect plants. Refunds are processed within 5-7 business days to the original payment method. Perishable or healthy plants cannot be returned."
                },
                {
                    title: "6. Contact",
                    content: "For any privacy concerns or questions about this policy, please contact us at privacy@o2need.com or use our Contact Us form."
                }
            ].map((section, i) => (
                <div key={i}>
                    <h2 className="text-xl font-heading font-bold text-text mb-3">{section.title}</h2>
                    <p>{section.content}</p>
                </div>
            ))}
        </div>
    </div>
)

export default Policy
