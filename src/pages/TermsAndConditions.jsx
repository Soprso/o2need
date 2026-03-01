const TermsAndConditions = () => (
    <div className="container mx-auto px-6 py-24 max-w-3xl">
        <div className="mb-12 space-y-4">
            <h1 className="text-5xl font-heading font-bold text-primary">Terms &amp; Conditions</h1>
            <div className="w-20 h-1.5 bg-secondary rounded-full"></div>
            <p className="text-subtext text-sm">Last updated: February 2026</p>
        </div>

        <div className="space-y-10 text-subtext leading-relaxed">
            {[
                {
                    title: '1. Service Coverage Area',
                    content:
                        'All subscription plans cover gardening and plant-care services for a maximum area of 100 sq ft. This includes maintenance visits, plant health checks, seasonal treatments, and other inclusions specified in your chosen plan. Any garden or terrace space beyond 100 sq ft will attract additional charges as outlined in Section 2.',
                },
                {
                    title: '2. Additional Area Charges',
                    content:
                        'For garden spaces exceeding 100 sq ft, an additional charge of ₹99 per 10 sq ft is applicable for the extra area per visit. This rate applies uniformly across all plan tiers. The additional charge will be communicated to you clearly before work commences on the extra area.',
                },
                {
                    title: '3. Cancellation Policy',
                    content:
                        'Subscriptions may be cancelled at any time. Cancellations take effect at the end of the current billing cycle — no partial refunds are issued for unused visits within an active billing period. To cancel, use the Account Settings page or contact our support team.',
                },
            ].map((section, i) => (
                <div key={i}>
                    <h2 className="text-xl font-heading font-bold text-text mb-3">{section.title}</h2>
                    <p>{section.content}</p>
                </div>
            ))}
        </div>
    </div>
)

export default TermsAndConditions
