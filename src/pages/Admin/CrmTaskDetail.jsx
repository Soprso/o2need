import { useState } from 'react'
import {
    ArrowLeft, Flag, Calendar, Clock, CheckCircle2, Circle, XCircle,
    AlertCircle, Edit2, Save, X, Image as ImageIcon, Loader2, Pencil, Trash2
} from 'lucide-react'
import { adminFetch, fmtTime, fmt } from './crmUtils'
import { StatusBadge, PriorityBadge, PRIORITY_COLOR, STATUS_CONFIG } from './CrmTodos'

const STATUSES = Object.entries(STATUS_CONFIG).map(([value, v]) => ({ value, label: v.label }))
const PRIORITIES = ['P1', 'P2', 'P3', 'P4', 'P5']

const PRIORITY_COLORS = {
    P1: 'text-red-600 bg-red-50', P2: 'text-orange-600 bg-orange-50',
    P3: 'text-yellow-700 bg-yellow-50', P4: 'text-blue-600 bg-blue-50', P5: 'text-gray-500 bg-gray-100',
}

const PRIORITY_LABELS = { P1: 'Critical', P2: 'High', P3: 'Medium', P4: 'Low', P5: 'Minimal' }

const CrmTaskDetail = ({ task: initialTask, onBack, onDelete }) => {
    const [task, setTask] = useState(initialTask)
    const [editMode, setEditMode] = useState(false)
    const [editTitle, setEditTitle] = useState(task.title)
    const [editDesc, setEditDesc] = useState(task.description || '')
    const [statusSaving, setStatusSaving] = useState(false)
    const [saving, setSaving] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [error, setError] = useState('')
    const [confirmDelete, setConfirmDelete] = useState(false)

    const patch = async (fields) => {
        setError('')
        const res = await adminFetch(`todos?id=${task.id}`, {
            method: 'PATCH',
            body: JSON.stringify(fields),
        })
        if (!res.ok) { const j = await res.json(); throw new Error(j.error || 'Failed to update') }
        const updated = await res.json()
        setTask(updated)
        return updated
    }

    const handleStatusChange = async (newStatus) => {
        setStatusSaving(true)
        try { await patch({ status: newStatus }) }
        catch (e) { setError(e.message) }
        finally { setStatusSaving(false) }
    }

    const handlePriorityChange = async (newPriority) => {
        try { await patch({ priority: newPriority }) }
        catch (e) { setError(e.message) }
    }

    const handleSaveEdit = async () => {
        if (!editTitle.trim()) { setError('Title cannot be empty'); return }
        setSaving(true)
        try {
            await patch({ title: editTitle.trim(), description: editDesc.trim() })
            setEditMode(false)
        } catch (e) { setError(e.message) }
        finally { setSaving(false) }
    }

    const handleDelete = async () => {
        setDeleting(true)
        try {
            const res = await adminFetch(`todos?id=${task.id}`, { method: 'DELETE' })
            if (!res.ok) throw new Error('Failed to delete')
            onDelete?.()
            onBack()
        } catch (e) { setError(e.message); setDeleting(false) }
    }

    const pc = PRIORITY_COLOR[task.priority] || PRIORITY_COLOR.P3
    const scfg = STATUS_CONFIG[task.status] || STATUS_CONFIG.new
    const StatusIcon = scfg.icon

    return (
        <div className="max-w-4xl space-y-6">
            {/* Breadcrumb / Back */}
            <div className="flex items-center justify-between">
                <button onClick={onBack}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#14532d] font-medium transition-colors">
                    <ArrowLeft className="w-4 h-4" /> All Tasks
                </button>
                <div className="flex items-center gap-2">
                    {!editMode && (
                        <button onClick={() => { setEditMode(true); setEditTitle(task.title); setEditDesc(task.description || ''); setError('') }}
                            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-sm">
                            <Pencil className="w-3.5 h-3.5" /> Edit
                        </button>
                    )}
                    <button onClick={() => setConfirmDelete(true)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-500 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 transition-all shadow-sm">
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                </div>
            </div>

            {/* Delete confirm */}
            {confirmDelete && (
                <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 flex items-center gap-4">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <div className="flex-1">
                        <p className="text-sm font-bold text-red-700">Delete this task?</p>
                        <p className="text-xs text-red-500 mt-0.5">This action cannot be undone.</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setConfirmDelete(false)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-all">
                            Cancel
                        </button>
                        <button onClick={handleDelete} disabled={deleting}
                            className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-red-500 hover:bg-red-600 transition-all disabled:opacity-60 flex items-center gap-1.5">
                            {deleting && <Loader2 className="w-3 h-3 animate-spin" />} Delete
                        </button>
                    </div>
                </div>
            )}

            {/* Ticket card — ServiceNow-inspired */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Priority ribbon */}
                <div className={`h-1.5 w-full ${pc.dot}`} />

                {/* Title area */}
                <div className="px-6 pt-6 pb-4 border-b border-gray-100">
                    {editMode ? (
                        <div className="space-y-3">
                            <input value={editTitle} onChange={e => setEditTitle(e.target.value)}
                                className="w-full text-xl font-heading font-bold text-gray-900 border-b-2 border-[#14532d] outline-none bg-transparent pb-1" />
                            <textarea value={editDesc} onChange={e => setEditDesc(e.target.value)} rows={4}
                                placeholder="Task description…"
                                className="w-full text-sm text-gray-600 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#14532d]/25 focus:border-[#14532d] resize-none" />
                            <div className="flex gap-2">
                                <button onClick={handleSaveEdit} disabled={saving}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-[#14532d] text-white text-sm font-bold rounded-xl hover:bg-[#166534] transition-all disabled:opacity-60">
                                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    {saving ? 'Saving…' : 'Save Changes'}
                                </button>
                                <button onClick={() => { setEditMode(false); setError('') }}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-all">
                                    <X className="w-4 h-4" /> Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h1 className="text-xl font-heading font-bold text-gray-900">{task.title}</h1>
                            {task.description && (
                                <p className="mt-2 text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{task.description}</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Metadata grid */}
                <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {/* Status */}
                    <div className="space-y-2">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</p>
                        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${scfg.bg}`}>
                            <StatusIcon className={`w-4 h-4 ${scfg.color}`} />
                            <select value={task.status} onChange={e => handleStatusChange(e.target.value)}
                                disabled={statusSaving}
                                className={`text-sm font-bold bg-transparent outline-none cursor-pointer ${scfg.color} disabled:opacity-60`}>
                                {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                            </select>
                            {statusSaving && <Loader2 className="w-3.5 h-3.5 animate-spin text-gray-400" />}
                        </div>
                    </div>

                    {/* Priority */}
                    <div className="space-y-2">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Priority</p>
                        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${PRIORITY_COLORS[task.priority] || 'bg-gray-50 text-gray-600'}`}>
                            <Flag className="w-4 h-4 flex-shrink-0" />
                            <select value={task.priority} onChange={e => handlePriorityChange(e.target.value)}
                                className="text-sm font-bold bg-transparent outline-none cursor-pointer">
                                {PRIORITIES.map(p => <option key={p} value={p}>{p} — {PRIORITY_LABELS[p]}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Created at */}
                    <div className="space-y-2">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Created At</p>
                        <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                            <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-xs">{fmtTime(task.created_at)}</span>
                        </div>
                    </div>

                    {/* Updated at */}
                    <div className="space-y-2">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Last Updated</p>
                        <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                            <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-xs">{fmtTime(task.updated_at)}</span>
                        </div>
                    </div>
                </div>

                {/* Status timeline */}
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Status Pipeline</p>
                    <div className="flex items-center gap-0">
                        {STATUSES.map((s, i) => {
                            const cfg = STATUS_CONFIG[s.value]
                            const Icon = cfg.icon
                            const isActive = task.status === s.value
                            const statusOrder = STATUSES.map(x => x.value)
                            const currentIdx = statusOrder.indexOf(task.status)
                            const isPast = i < currentIdx
                            return (
                                <div key={s.value} className="flex items-center flex-1">
                                    <button onClick={() => handleStatusChange(s.value)}
                                        title={s.label}
                                        className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all group ${isActive ? 'scale-110' : 'opacity-50 hover:opacity-80'}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${isActive ? `${cfg.bg} border-current ${cfg.color}` : isPast ? 'bg-green-50 border-green-200 text-green-500' : 'bg-gray-100 border-gray-200 text-gray-400'}`}>
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <span className={`text-[9px] font-bold uppercase tracking-tight text-center leading-tight hidden sm:block ${isActive ? cfg.color : 'text-gray-400'}`}>
                                            {s.label.split(' ').map(w => w[0]).join('')}
                                        </span>
                                    </button>
                                    {i < STATUSES.length - 1 && (
                                        <div className={`flex-1 h-0.5 mx-1 rounded transition-all ${i < currentIdx ? 'bg-[#14532d]' : 'bg-gray-200'}`} />
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Attached image */}
            {task.image_url && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-[#14532d]" />
                        <h3 className="font-heading font-bold text-gray-900 text-sm">Attached Image</h3>
                    </div>
                    <div className="p-5">
                        <a href={task.image_url} target="_blank" rel="noopener noreferrer">
                            <img src={task.image_url} alt="Task attachment"
                                className="max-h-80 rounded-xl object-cover border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-zoom-in" />
                        </a>
                        <p className="text-xs text-gray-400 mt-2">Click image to open full size</p>
                    </div>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
                </div>
            )}
        </div>
    )
}

export default CrmTaskDetail
