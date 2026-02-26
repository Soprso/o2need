import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { productService } from "../../services/productService"
import { Upload, X, Save, ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"

const AddProduct = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: ''
    })
    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImageFile(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            await productService.addProduct(formData, imageFile)
            alert("Product added successfully!")
            navigate('/admin')
        } catch (error) {
            console.error(error)
            alert("Error adding product")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Link to="/admin" className="inline-flex items-center gap-2 text-subtext hover:text-primary mb-4 transition-colors font-medium">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
            </Link>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                <h3 className="text-2xl font-heading font-bold mb-8">Add New Product</h3>

                <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-12">
                    {/* Left: Metadata */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-text mb-2 uppercase tracking-wide">Product Name</label>
                            <input
                                required
                                type="text"
                                placeholder="e.g. Ficus Lyrata"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-text mb-2 uppercase tracking-wide">Price (INR ₹)</label>
                            <input
                                required
                                type="number"
                                placeholder="0.00"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-text mb-2 uppercase tracking-wide">Description</label>
                            <textarea
                                required
                                rows="5"
                                placeholder="Describe the plant's beauty and care requirements..."
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none resize-none"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Right: Image Upload */}
                    <div className="space-y-6">
                        <label className="block text-sm font-bold text-text mb-2 uppercase tracking-wide">Product Image</label>
                        <div className="relative aspect-[4/5] rounded-2xl border-2 border-dashed border-gray-200 bg-background flex flex-col items-center justify-center overflow-hidden transition-all hover:border-primary group">
                            {imagePreview ? (
                                <>
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => { setImageFile(null); setImagePreview(null); }}
                                        className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </>
                            ) : (
                                <label className="cursor-pointer flex flex-col items-center gap-4 text-subtext group-hover:text-primary transition-colors">
                                    <Upload className="w-12 h-12" />
                                    <div className="text-center">
                                        <p className="font-bold">Select plant image</p>
                                        <p className="text-xs">PNG, JPG up to 10MB</p>
                                    </div>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} required />
                                </label>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-secondary disabled:bg-gray-300 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
                        >
                            {loading ? 'Adding Product...' : <><Save className="w-5 h-5" /> Save Product</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddProduct
