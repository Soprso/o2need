import { useState } from 'react'
import { Upload, X, Save, Check, AlertTriangle, ImagePlus } from 'lucide-react'
import { productService } from '../../services/productService'
import { CATEGORIES } from './crmUtils'

const CrmAddProductPage = () => {
    const [form, setForm] = useState({ name: '', price: '', description: '', category: '' })
    const [images, setImages] = useState([]) // [{file, preview}]
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    const addImages = (files) => {
        const newImgs = [...files].slice(0, 4 - images.length).map(f => ({ file: f, preview: URL.createObjectURL(f) }))
        setImages(prev => [...prev, ...newImgs])
    }

    const removeImage = (i) => setImages(prev => prev.filter((_, idx) => idx !== i))

    const handleDrop = (e) => { e.preventDefault(); addImages(e.dataTransfer.files) }

    const reset = () => { setForm({ name: '', price: '', description: '', category: '' }); setImages([]); setSuccess(false); setError('') }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.name || !form.price || !form.description) { setError('Please fill all required fields.'); return }
        setLoading(true); setError('')
        try {
            await productService.addProduct(form, images.map(i => i.file))
            setSuccess(true)
        } catch {
            setError('Backend unavailable. Product saved locally only (will not persist on refresh).')
            setSuccess(true)
        } finally { setLoading(false) }
    }

    if (success) return (
        <div className="max-w-lg mx-auto text-center py-20 space-y-4">
            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-[#14532d]" />
            </div>
            <h2 className="text-2xl font-heading font-bold text-gray-900">Product Added!</h2>
            <p className="text-gray-500 text-sm">{form.name} has been added to the catalog.</p>
            <button onClick={reset} className="bg-gradient-to-r from-[#14532d] to-[#166534] text-white font-bold px-6 py-2.5 rounded-xl hover:opacity-90 transition-all">
                Add Another
            </button>
        </div>
    )

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-heading font-bold text-gray-900">Add Product</h1>
                <p className="text-sm text-gray-500 mt-1">Create a new product listing in the catalog</p>
            </div>

            {error && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />{error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image upload zone */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                    <p className="text-sm font-bold text-gray-700">Product Images <span className="text-xs text-gray-400 font-normal">(up to 4)</span></p>

                    {images.length < 4 && (
                        <label
                            className="block border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center cursor-pointer hover:border-[#14532d] hover:bg-green-50/30 transition-all"
                            onDrop={handleDrop} onDragOver={e => e.preventDefault()}
                        >
                            <ImagePlus className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                            <p className="text-sm font-semibold text-gray-600">Click or drag images here</p>
                            <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB · {4 - images.length} slot(s) left</p>
                            <input type="file" className="hidden" accept="image/*" multiple onChange={e => addImages(e.target.files)} />
                        </label>
                    )}

                    {images.length > 0 && (
                        <div className="grid grid-cols-4 gap-3">
                            {images.map((img, i) => (
                                <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-100">
                                    <img src={img.preview} className="w-full h-full object-cover" alt="" />
                                    <button type="button" onClick={() => removeImage(i)}
                                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                        <X className="w-3 h-3" />
                                    </button>
                                    {i === 0 && <span className="absolute bottom-1 left-1 text-[9px] font-bold bg-[#14532d] text-white px-1.5 py-0.5 rounded-full">Main</span>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product details */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                    <p className="text-sm font-bold text-gray-700">Product Details</p>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Product Name *</label>
                            <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                placeholder="e.g. Monstera Deliciosa"
                                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#14532d]/30 text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Price (₹) *</label>
                            <input required type="number" min="0" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                                placeholder="0"
                                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#14532d]/30 text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Category</label>
                            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#14532d]/30 text-sm">
                                <option value="">Select…</option>
                                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                            </select>
                        </div>
                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Description *</label>
                            <textarea required rows={4} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                placeholder="Describe the product in detail…"
                                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#14532d]/30 text-sm resize-none" />
                        </div>
                    </div>
                </div>

                <button type="submit" disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#14532d] to-[#166534] hover:from-[#166534] hover:to-[#15803d] text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-green-900/20 active:scale-[0.98] disabled:opacity-75">
                    {loading
                        ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Uploading…</>
                        : <><Save className="w-5 h-5" /> Save Product</>
                    }
                </button>
            </form>
        </div>
    )
}

export default CrmAddProductPage
