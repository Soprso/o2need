import { useState, useEffect, useCallback } from 'react'
import { ClipboardList, Plus, Search, Calendar, Flag, ChevronRight, RefreshCw, CheckCircle2, Clock, Circle, XCircle, AlertCircle } from 'lucide-react'
import { adminFetch, fmtTime } from './crmUtils'

const PRIORITY_COLOR = {
    P1: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', dot: 'bg-red-500' },
    P2: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200', dot: 'bg-orange-500' },
    P3: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', dot: 'bg-yellow-500' },
    P4: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', dot: 'bg-blue-500' },
    P5: { bg: 'bg-gray-50', text: 'text-gray-500', border: 'border-gray-200', dot: 'bg-gray-400' },
}

const STATUS_CONFIG = {
    new: { label: 'New', icon: Circle, color: 'text-gray-500', bg: 'bg-gray-100' },
    'in-progress': { label: 'Work In Progress', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
    'review-needed': { label: 'Review Needed', icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
    completed: { label: 'Completed', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    closed: { label: 'Closed', icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' },
}

const StatusBadge = ({ status }) => {
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.new
    const Icon = cfg.icon
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.color}`}>
            <Icon className="w-3 h-3" />
            {cfg.label}
        </span>
    )
}

const PriorityBadge = ({ priority }) => {
    const c = PRIORITY_COLOR[priority] || PRIORITY_COLOR.P3
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${c.bg} ${c.text} ${c.border}`}>
            <Flag className="w-3 h-3" />
            {priority}
        </span>
    )
}

const CrmTodos = ({ onCreateTask, onViewTask }) => {
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')
    const [filterPriority, setFilterPriority] = useState('all')

    const loadTasks = useCallback(() => {
        setLoading(true)
        adminFetch('todos')
            .then(r => r.json())
            .then(data => { setTasks(Array.isArray(data) ? data : []); setLoading(false) })
            .catch(() => setLoading(false))
    }, [])

    useEffect(() => { loadTasks() }, [loadTasks])

    const filtered = tasks.filter(t => {
        const q = search.toLowerCase()
        const matchQ = !q || t.title?.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q)
        const matchS = filterStatus === 'all' || t.status === filterStatus
        const matchP = filterPriority === 'all' || t.priority === filterPriority
        return matchQ && matchS && matchP
    })

    const statCounts = {
        all: tasks.length,
        new: tasks.filter(t => t.status === 'new').length,
        'in-progress': tasks.filter(t => t.status === 'in-progress').length,
        'review-needed': tasks.filter(t => t.status === 'review-needed').length,
        completed: tasks.filter(t => t.status === 'completed').length,
        closed: tasks.filter(t => t.status === 'closed').length,
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-heading font-bold text-gray-900">To-Do List</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage tasks and track progress</p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={loadTasks}
                        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 text-sm font-semibold rounded-xl text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
                        <RefreshCw className="w-4 h-4" />
                    </button>
                    <button onClick={onCreateTask}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#14532d] to-[#166534] text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all">
                        <Plus className="w-4 h-4" /> Create Task
                    </button>
                </div>
            </div>

            {/* Status filter tabs */}
            <div className="flex items-center gap-1.5 flex-wrap">
                {[['all', 'All'], ...Object.entries(STATUS_CONFIG).map(([k, v]) => [k, v.label])].map(([k, lbl]) => (
                    <button key={k} onClick={() => setFilterStatus(k)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${filterStatus === k
                            ? 'bg-[#14532d] text-white shadow-sm'
                            : 'bg-white border border-gray-200 text-gray-600 hover:border-[#14532d] hover:text-[#14532d]'}`}>
                        {lbl} <span className="ml-1 opacity-70">({statCounts[k] ?? 0})</span>
                    </button>
                ))}
            </div>

            {/* Filters row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search tasks…"
                        className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#14532d]/25 focus:border-[#14532d] transition-all" />
                </div>
                <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)}
                    className="px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#14532d]/25 focus:border-[#14532d] text-gray-700">
                    <option value="all">All Priorities</option>
                    {['P1', 'P2', 'P3', 'P4', 'P5'].map(p => <option key={p} value={p}>{p}</option>)}
                </select>
            </div>

            {/* Task list */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="divide-y divide-gray-50">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="px-6 py-4 flex items-center gap-4">
                                <div className="w-10 h-10 bg-gray-100 rounded-xl animate-pulse" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-100 rounded animate-pulse w-2/5" />
                                    <div className="h-3 bg-gray-100 rounded animate-pulse w-3/5" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-4">
                            <ClipboardList className="w-8 h-8 text-[#14532d]" />
                        </div>
                        <p className="text-gray-900 font-semibold">No tasks found</p>
                        <p className="text-sm text-gray-500 mt-1">Create your first task to get started</p>
                        <button onClick={onCreateTask}
                            className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-[#14532d] text-white text-sm font-bold rounded-xl hover:bg-[#166534] transition-all">
                            <Plus className="w-4 h-4" /> Create Task
                        </button>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {filtered.map(task => {
                            const pc = PRIORITY_COLOR[task.priority] || PRIORITY_COLOR.P3
                            return (
                                <button key={task.id} onClick={() => onViewTask(task)}
                                    className="w-full text-left px-5 py-4 flex items-center gap-4 hover:bg-gray-50/70 transition-all group">
                                    {/* Priority indicator */}
                                    <div className={`w-1.5 h-12 rounded-full flex-shrink-0 ${pc.dot}`} />

                                    {/* Task info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="text-sm font-bold text-gray-900 truncate group-hover:text-[#14532d] transition-colors">
                                                {task.title}
                                            </p>
                                        </div>
                                        {task.description && (
                                            <p className="text-xs text-gray-500 truncate leading-relaxed">{task.description}</p>
                                        )}
                                        <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-400">
                                            <Calendar className="w-3 h-3" />
                                            <span>{fmtTime(task.created_at)}</span>
                                        </div>
                                    </div>

                                    {/* Badges */}
                                    <div className="flex-shrink-0 flex flex-col items-end gap-2">
                                        <StatusBadge status={task.status} />
                                        <PriorityBadge priority={task.priority} />
                                    </div>

                                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#14532d] transition-colors flex-shrink-0" />
                                </button>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

export { StatusBadge, PriorityBadge, PRIORITY_COLOR, STATUS_CONFIG }
export default CrmTodos
