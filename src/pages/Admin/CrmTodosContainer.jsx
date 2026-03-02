// Container component that manages To-Do sub-page routing
// (list → create task, list → task detail)
import { useState } from 'react'
import CrmTodos from './CrmTodos'
import CrmCreateTask from './CrmCreateTask'
import CrmTaskDetail from './CrmTaskDetail'

const VIEW = { LIST: 'list', CREATE: 'create', DETAIL: 'detail' }

const CrmTodosContainer = () => {
    const [view, setView] = useState(VIEW.LIST)
    const [selectedTask, setSelectedTask] = useState(null)

    const goList = () => { setView(VIEW.LIST); setSelectedTask(null) }

    if (view === VIEW.CREATE) {
        return (
            <CrmCreateTask
                onBack={goList}
                onCreated={() => goList()}
            />
        )
    }

    if (view === VIEW.DETAIL && selectedTask) {
        return (
            <CrmTaskDetail
                task={selectedTask}
                onBack={goList}
                onDelete={goList}
            />
        )
    }

    return (
        <CrmTodos
            onCreateTask={() => setView(VIEW.CREATE)}
            onViewTask={(task) => { setSelectedTask(task); setView(VIEW.DETAIL) }}
        />
    )
}

export default CrmTodosContainer
