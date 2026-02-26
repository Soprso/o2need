const About = () => (
    <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-24 max-w-4xl">
        <div className="text-center mb-12 sm:mb-16 space-y-4">
            <h1 className="text-4xl sm:text-5xl font-heading font-bold text-primary">About O2need</h1>
            <div className="w-16 sm:w-20 h-1.5 bg-secondary rounded-full mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-16 items-center mb-16 sm:mb-24">
            <div className="space-y-5 order-2 md:order-1">
                <p className="text-base text-subtext leading-relaxed">O2need was founded with a simple belief — that every home, office, and workspace deserves the calming presence of nature. We are passionate curators of premium indoor plants, sourced sustainably and delivered with care.</p>
                <p className="text-base text-subtext leading-relaxed">Our mission is to make it effortless to bring greenery indoors. Whether you're a first-time plant parent or an experienced botanist, our collection has something for every space and lifestyle.</p>
                <p className="text-base text-subtext leading-relaxed">Every plant we stock undergoes a rigorous quality check, is packed with organic soil, and shipped in eco-friendly packaging — because we care about the planet just as much as we care about your home.</p>
            </div>
            <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl order-1 md:order-2">
                <img src="/as/gardener.png" alt="Our Story" className="w-full h-64 sm:h-[450px] object-cover" />
            </div>
        </div>
        <div className="grid grid-cols-3 gap-4 sm:gap-8 text-center">
            {[{ stat: "100+", label: "Plant Varieties" }, { stat: "5000+", label: "Happy Customers" }, { stat: "100%", label: "Eco Friendly" }].map((item, i) => (
                <div key={i} className="bg-white p-5 sm:p-10 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-2xl sm:text-4xl font-heading font-bold text-primary">{item.stat}</p>
                    <p className="text-subtext mt-1 sm:mt-2 text-xs sm:text-base font-medium">{item.label}</p>
                </div>
            ))}
        </div>
    </div>
)
export default About
