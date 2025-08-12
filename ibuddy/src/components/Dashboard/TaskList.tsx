'use client'

import { CheckCircle2, Circle, Clock, AlertCircle, Trash2, Edit3 } from 'lucide-react'
import Card from '../UI/Card'
import { useTasks, useToast } from '../../context/AppContext'
import type { Task } from '../../types'

interface TaskItemProps {
  task: Task
}

function TaskItem({ task }: TaskItemProps): JSX.Element {
  const { toggleTask, deleteTask } = useTasks()
  const toast = useToast()

  const priorityConfig = {
    high: { 
      color: 'bg-red-100 text-red-800 border-red-200', 
      icon: AlertCircle,
      label: 'High Priority'
    },
    medium: { 
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
      icon: Clock,
      label: 'Medium Priority'
    },
    low: { 
      color: 'bg-green-100 text-green-800 border-green-200', 
      icon: Circle,
      label: 'Low Priority'
    }
  }

  const config = priorityConfig[task.priority]
  const PriorityIcon = config.icon

  const handleToggle = async (): Promise<void> => {
    try {
      toggleTask(task.id)
      toast.success(
        task.completed ? 'Task reopened' : 'Task completed!',
        task.completed ? `"${task.title}" has been marked as incomplete` : `Great job on "${task.title}"!`
      )
    } catch (error) {
      toast.error('Failed to update task')
    }
  }

  const handleDelete = async (): Promise<void> => {
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      try {
        deleteTask(task.id)
        toast.success('Task deleted', `"${task.title}" has been removed`)
      } catch (error) {
        toast.error('Failed to delete task')
      }
    }
  }

  return (
    <div className={`group p-4 rounded-lg border transition-all hover:shadow-md ${
      task.completed 
        ? 'bg-green-50 border-green-200' 
        : 'bg-white border-gray-200 hover:border-gray-300'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <button
            onClick={handleToggle}
            className="flex-shrink-0 hover:scale-110 transition-transform"
            aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {task.completed ? (
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400 hover:text-gray-600" />
            )}
          </button>
          
          <div className="flex-1 min-w-0">
            <h4 className={`font-medium truncate ${
              task.completed ? 'text-green-800 line-through' : 'text-gray-900'
            }`}>
              {task.title}
            </h4>
            
            <div className="flex items-center space-x-3 mt-1">
              <span className="text-sm text-gray-600 truncate">{task.subject}</span>
              
              <div className={`flex items-center space-x-1 text-xs px-2 py-1 rounded-full border ${config.color}`}>
                <PriorityIcon className="w-3 h-3" />
                <span className="capitalize">{task.priority}</span>
              </div>
              
              <span className="text-sm text-gray-500 truncate">Due: {task.due}</span>
              
              {task.estimatedDuration && (
                <span className="text-xs text-gray-400">~{task.estimatedDuration}min</span>
              )}
            </div>
          </div>
        </div>

        {/* Action buttons - show on hover */}
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => {/* TODO: Implement edit */}}
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            aria-label="Edit task"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            aria-label="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function TaskList(): JSX.Element {
  const { state, setFilters, setSort } = useTasks()
  const { filteredTasks, filters, sort, isLoading } = state

  if (isLoading) {
    return (
      <Card>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </Card>
    )
  }

  const incompleteTasks = filteredTasks.filter(task => !task.completed)
  const completedTasks = filteredTasks.filter(task => task.completed)

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Your Tasks</h3>
        
        {/* Filter and sort controls */}
        <div className="flex items-center space-x-2">
          <select
            value={filters.priority || ''}
            onChange={(e) => setFilters({ priority: e.target.value || undefined })}
            className="text-sm border border-gray-300 rounded px-2 py-1"
          >
            <option value="">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          
          <select
            value={sort.field}
            onChange={(e) => setSort(e.target.value as any, sort.order)}
            className="text-sm border border-gray-300 rounded px-2 py-1"
          >
            <option value="due">Sort by Due Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="subject">Sort by Subject</option>
            <option value="createdAt">Sort by Created</option>
          </select>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Circle className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No tasks yet. Add one above!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Incomplete tasks */}
          {incompleteTasks.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Pending ({incompleteTasks.length})
              </h4>
              {incompleteTasks.map(task => (
                <TaskItem key={task.id} task={task} />
              ))}
            </div>
          )}

          {/* Completed tasks */}
          {completedTasks.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Completed ({completedTasks.length})
              </h4>
              <div className="space-y-2">
                {completedTasks.slice(0, 3).map(task => (
                  <TaskItem key={task.id} task={task} />
                ))}
                {completedTasks.length > 3 && (
                  <div className="text-center">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      View {completedTasks.length - 3} more completed tasks
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Task statistics */}
      <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600">
        <span>
          {incompleteTasks.length} pending, {completedTasks.length} completed
        </span>
        <span>
          {Math.round((completedTasks.length / (filteredTasks.length || 1)) * 100)}% complete
        </span>
      </div>
    </Card>
  )
}