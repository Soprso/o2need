import { useState, useRef } from 'react'
import { ArrowLeft, Upload, X, Loader2, Flag, FileText, ImageIcon, AlertTriangle } from 'lucide-react'
import { adminFetch, FN_BASE } from './crmUtils'

const PRIORITIES = [
    { value: 'P1', label: 'P1 — Critical', desc: 'Drop everything, fix now' },
    { value: 'P2', label: 'P2 — High', desc: 'Urgent, fix today' },
    { value: 'P3', label: 'P3 — Medium', desc: 'Important, fix this week' },
    { value: 'P4', label: 'P4 — Low', desc: 'Fix when possible' },
    { value: 'P5', label: 'P5 — Minimal', desc: 'Nice to have' },
]

const PRIORITY_COLORS = {
    P1: 'border-red-400 bg-red-50 text-red-700',
    P2: 'border-orange-400 bg-orange-50 text-orange-700',
    P3: 'border-yellow-400 bg-yellow-50 text-yellow-700',
    P4: 'border-blue-400 bg-blue-50 text-blue-700',
    P5: 'border-gray-300 bg-gray-50 text-gray-600',
}

const CrmCreateTask = ({ user, onBack, onCreated }) => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [priority, setPriority] = useState('P3')
    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const fileRef = useRef()

    const handleFile = (file) => {
        if (!file) return
        if (!file.type.startsWith('image/')) { setError('Please select an image file.'); return }
        if (file.size > 10 * 1024 * 1024) { setError('Image must be under 10 MB.'); return }
        setImageFile(file)
        const reader = new FileReader()
        reader.onloadend = () => setImagePreview(reader.result)
        reader.readAsDataURL(file)
        setError('')
    }

    const handleDrop = (e) => {
        e.preventDefault()
        handleFile(e.dataTransfer.files[0])
    }

    const uploadImage = async () => {
        if (!imageFile) return null
        setUploading(true)
        try {
            const reader = new FileReader()
            const base64 = await new Promise((res, rej) => {
                reader.onloadend = () => res(reader.result)
                reader.onerror = rej
                reader.readAsDataURL(imageFile)
            })
            const res = await fetch(`${FN_BASE}/todo-upload`, {
                method: 'POST',
                headers: {
                    'x-admin-token': 'o2need-admin-secret-2025',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ data: base64, name: imageFile.name }),
            })
            const json = await res.json()
            return json.url || null
        } finally {
            setUploading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!title.trim()) { setError('Task title is required.'); return }
        setError('')
        setSaving(true)
        try {
            const image_url = await uploadImage()
            const res = await adminFetch('todos', {
                method: 'POST',
                body: JSON.stringify({
                    title: title.trim(),
                    description: description.trim(),
                    priority,
                    image_url,
                    created_by_name: user?.fullName || 'Anonymous Admin',
                    created_by_email: user?.primaryEmailAddress?.emailAddress || ''
                }),
            })
            if (!res.ok) { const j = await res.json(); throw new Error(j.error || 'Failed to create task') }
            const task = await res.json()
            onCreated?.(task)
        } catch (err) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="space-y-6 max-w-3xl">
            {/* Header */}
            <div className="flex items-center gap-3">
                <button onClick={onBack}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#14532d] font-medium transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Tasks
                </button>
            </div>
            <div>
                <h1 className="text-2xl font-heading font-bold text-gray-900">Create New Task</h1>
                <p className="text-sm text-gray-500 mt-1">Fill in the details to create a new task</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                    <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#14532d]" /> Task Details
                    </h2>
                    <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Task Title *</label>
                        <input
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="Enter a clear, concise task title…"
                            className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#14532d]/25 focus:border-[#14532d] transition-all font-medium text-gray-900 placeholder:font-normal"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Description</label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            rows={5}
                            placeholder="Describe the task in detail, what needs to be done, acceptance criteria, context…"
                            className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#14532d]/25 focus:border-[#14532d] transition-all resize-none leading-relaxed"
                        />
                    </div>
                </div>

                {/* Priority */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-4">
                        <Flag className="w-4 h-4 text-[#14532d]" /> Priority Level
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                        {PRIORITIES.map(p => (
                            <button type="button" key={p.value}
                                onClick={() => setPriority(p.value)}
                                className={`flex flex-col items-center gap-1 px-3 py-3 rounded-xl border-2 transition-all text-center ${priority === p.value
                                    ? `${PRIORITY_COLORS[p.value]} border-current shadow-sm scale-[1.03]`
                                    : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50'}`}>
                                <span className="text-sm font-black tracking-tight">{p.value}</span>
                                <span className="text-[10px] font-medium leading-tight opacity-80">{p.desc}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Image upload */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-4">
                        <ImageIcon className="w-4 h-4 text-[#14532d]" /> Attach Image <span className="text-xs font-normal text-gray-400">(optional)</span>
                    </h2>
                    {imagePreview ? (
                        <div className="relative inline-block">
                            <img src={imagePreview} alt="Preview" className="max-h-48 rounded-xl border border-gray-200 object-cover shadow-sm" />
                            <button type="button" onClick={() => { setImageFile(null); setImagePreview(null) }}
                                className="absolute -top-2 -right-2 w-7 h-7 bg-white rounded-full border border-gray-200 shadow-md flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors">
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ) : (
                        <div
                            onDrop={handleDrop}
                            onDragOver={e => e.preventDefault()}
                            onClick={() => fileRef.current?.click()}
                            className="border-2 border-dashed border-gray-200 rounded-xl p-10 flex flex-col items-center gap-3 text-center cursor-pointer hover:border-[#14532d] hover:bg-green-50/30 transition-all group">
                            <div className="w-12 h-12 bg-gray-50 group-hover:bg-green-50 rounded-xl flex items-center justify-center transition-colors">
                                <Upload className="w-5 h-5 text-gray-400 group-hover:text-[#14532d] transition-colors" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-700">Drop image here or click to browse</p>
                                <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP — max 10 MB</p>
                            </div>
                        </div>
                    )}
                    <input ref={fileRef} type="file" accept="image/*" className="hidden"
                        onChange={e => handleFile(e.target.files[0])} />
                </div>

                {/* Error */}
                {error && (
                    <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0" /> {error}
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <button type="button" onClick={onBack}
                        className="px-6 py-3 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all">
                        Cancel
                    </button>
                    <button type="submit" disabled={saving || uploading}
                        className="flex-1 sm:flex-none sm:min-w-[180px] flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-[#14532d] to-[#166534] text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100">
                        {(saving || uploading) && <Loader2 className="w-4 h-4 animate-spin" />}
                        {uploading ? 'Uploading image…' : saving ? 'Creating task…' : 'Create Task'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CrmCreateTask
