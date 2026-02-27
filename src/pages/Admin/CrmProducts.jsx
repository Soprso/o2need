import { useState, useEffect, useCallback } from 'react'
import { Search, RefreshCw, Pencil, Trash2, X, Check, AlertTriangle, Upload, Package } from 'lucide-react'
import { productService } from '../../services/productService'
import { allStaticProducts } from '../../data/products'
import { CATEGORIES } from './crmUtils'

const EditProductModal = ({ product, onClose, onSave }) => {
    const [form, setForm] = useState({ name: product.name, price: String(product.price), description: product.description, category: product.category || '' })
    const [imageFile, setImageFile] = useState(null)
    const [preview, setPreview] = useState(product.image_url)
    const [saving, setSaving] = useState(false)

    const save = async () => {
        setSaving(true)
        try {
            const updated = await productService.updateProduct(product.id, form, imageFile)
            onSave({ ...product, ...form, image_url: updated?.image_url || product.image_url })
            onClose()
        } catch {
            // If backend unavailable, update locally
            onSave({ ...product, ...form, price: parseInt(form.price) || product.price })
            onClose()
        } finally { setSaving(false) }
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="bg-gradient-to-r from-[#14532d] to-[#166534] px-6 py-4 rounded-t-2xl flex items-center justify-between sticky top-0">
                    <p className="text-white font-bold text-sm">Edit Product</p>
                    <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/30 text-white hover:rotate-90 transition-all">
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    {/* Image */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Image</label>
                        <div className="relative h-36 rounded-xl border-2 border-dashed border-gray-200 overflow-hidden bg-gray-50">
                            {preview && <img src={preview} className="w-full h-full object-cover" alt="" />}
                            <label className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                                <div className="text-white text-center"><Upload className="w-6 h-6 mx-auto mb-1" /><p className="text-xs font-bold">Change</p></div>
                                <input type="file" className="hidden" accept="image/*" onChange={e => { const f = e.target.files[0]; if (f) { setImageFile(f); setPreview(URL.createObjectURL(f)) } }} />
                            </label>
                        </div>
                    </div>
                    {[{ k: 'name', l: 'Product Name', t: 'text' }, { k: 'price', l: 'Price (₹)', t: 'number' }, { k: 'description', l: 'Description', t: 'textarea' }].map(({ k, l, t }) => (
                        <div key={k}>
                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">{l}</label>
                            {t === 'textarea'
                                ? <textarea rows={3} value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#14532d]/30 text-sm resize-none" />
                                : <input type={t} value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#14532d]/30 text-sm" />
                            }
                        </div>
                    ))}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Category</label>
                        <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#14532d]/30 text-sm">
                            <option value="">Select…</option>
                            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                        </select>
                    </div>
                    <button onClick={save} disabled={saving}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#14532d] to-[#166534] text-white font-bold py-2.5 rounded-xl transition-all disabled:opacity-75">
                        {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check className="w-4 h-4" />}
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    )
}

const CrmProductsPage = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [catFilter, setCatFilter] = useState('all')
    const [editProd, setEditProd] = useState(null)
    const [error, setError] = useState('')

    const load = useCallback(async () => {
        setLoading(true); setError('')
        try {
            const data = await productService.getProducts()
            setProducts(data?.length ? data : allStaticProducts)
        } catch {
            setProducts(allStaticProducts)
            setError('Backend offline — showing static catalog. Changes will not persist.')
        } finally { setLoading(false) }
    }, [])

    useEffect(() => { load() }, [load])

    const handleDelete = async (prod) => {
        if (!confirm(`Delete "${prod.name}"?`)) return
        try {
            await productService.deleteProduct(prod.id)
            setProducts(prev => prev.filter(p => p.id !== prod.id))
        } catch { setProducts(prev => prev.filter(p => p.id !== prod.id)) }
    }

    const handleSave = (updated) => setProducts(prev => prev.map(p => p.id === updated.id ? updated : p))

    const filtered = products
        .filter(p => catFilter === 'all' ? true : p.category === catFilter)
        .filter(p => !search.trim() || p.name.toLowerCase().includes(search.toLowerCase()))

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-heading font-bold text-gray-900">Products</h1>
                    <p className="text-sm text-gray-500 mt-1">{products.length} products in catalog</p>
                </div>
                <button onClick={load} disabled={loading} className="flex items-center gap-2 text-sm text-[#14532d] font-medium disabled:opacity-50">
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
                </button>
            </div>

            {error && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700 flex items-start gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />{error}
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
                    {[['all', 'All'], ...CATEGORIES.map(c => [c.value, c.label])].map(([v, l]) => (
                        <button key={v} onClick={() => setCatFilter(v)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${catFilter === v ? 'bg-white text-[#14532d] shadow-sm' : 'text-gray-500'}`}>{l}</button>
                    ))}
                </div>
                <div className="relative ml-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…"
                        className="pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#14532d]/30 w-40" />
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100">
                            <div className="h-40 bg-gray-100 animate-pulse" />
                            <div className="p-3 space-y-2"><div className="h-3 bg-gray-100 rounded animate-pulse w-3/4" /><div className="h-3 bg-gray-100 rounded animate-pulse w-1/3" /></div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filtered.map(p => (
                        <div key={p.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm group hover:shadow-md transition-all">
                            <div className="relative h-40 overflow-hidden">
                                {p.image_url
                                    ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    : <div className="w-full h-full bg-green-50 flex items-center justify-center"><Package className="w-10 h-10 text-gray-200" /></div>
                                }
                                {p.category && (
                                    <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 text-[#14532d] capitalize">{p.category}</span>
                                )}
                                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => setEditProd(p)} className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow text-[#14532d] hover:bg-green-50 transition-colors">
                                        <Pencil className="w-3.5 h-3.5" />
                                    </button>
                                    <button onClick={() => handleDelete(p)} className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow text-red-500 hover:bg-red-50 transition-colors">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-3">
                                <p className="text-sm font-bold text-gray-900 leading-tight truncate">{p.name}</p>
                                <p className="text-sm font-heading font-bold text-[#14532d] mt-1">₹{(p.price || 0).toLocaleString('en-IN')}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {editProd && <EditProductModal product={editProd} onClose={() => setEditProd(null)} onSave={handleSave} />}
        </div>
    )
}

export default CrmProductsPage
