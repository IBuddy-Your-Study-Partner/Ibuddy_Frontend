'use client'

import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react'
import type { Task, TaskPriority } from '../types'

// Types for Task Context
interface TaskState {
  tasks: Task[]
  filteredTasks: Task[]
  filters: {
    subject?: string
    priority?: TaskPriority
    completed?: boolean
    searchQuery?: string
  }
  sortBy: 'due' | 'priority' | 'subject' | 'created'
  sortOrder: 'asc' | 'desc'
  isLoading: boolean
  error: string | null
}

// Action types
type TaskAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOAD_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: { id: number; updates: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: number }
  | { type: 'TOGGLE_TASK'; payload: number }
  | { type: 'SET_FILTERS'; payload: Partial<TaskState['filters']> }
  | { type: 'CLEAR_FILTERS' }
  | { type: 'SET_SORT'; payload: { sortBy: TaskState['sortBy']; sortOrder: TaskState['sortOrder'] } }
  | { type: 'FILTER_TASKS' }

// Initial state
const initialTaskState: TaskState = {
  tasks: [],
  filteredTasks: [],
  filters: {},
  sortBy: 'due',
  sortOrder: 'asc',
  isLoading: false,
  error: null
}

// Helper functions
const filterTasks = (tasks: Task[], filters: TaskState['filters']): Task[] => {
  return tasks.filter(task => {
    // Subject filter
    if (filters.subject && task.subject !== filters.subject) {
      return false
    }
    
    // Priority filter
    if (filters.priority && task.priority !== filters.priority) {
      return false
    }
    
    // Completion filter
    if (filters.completed !== undefined && task.completed !== filters.completed) {
      return false
    }
    
    // Search query filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      return (
        task.title.toLowerCase().includes(query) ||
        task.subject.toLowerCase().includes(query)
      )
    }
    
    return true
  })
}

const sortTasks = (tasks: Task[], sortBy: TaskState['sortBy'], sortOrder: TaskState['sortOrder']): Task[] => {
  const sorted = [...tasks].sort((a, b) => {
    let comparison = 0
    
    switch (sortBy) {
      case 'due':
        // Simple string comparison for demo - in real app, parse dates
        comparison = a.due.localeCompare(b.due)
        break
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        comparison = priorityOrder[b.priority] - priorityOrder[a.priority]
        break
      case 'subject':
        comparison = a.subject.localeCompare(b.subject)
        break
      case 'created':
        comparison = a.id - b.id
        break
    }
    
    return sortOrder === 'asc' ? comparison : -comparison
  })
  
  return sorted
}

// Reducer function
function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false }
    
    case 'LOAD_TASKS':
      const sortedTasks = sortTasks(action.payload, state.sortBy, state.sortOrder)
      const filteredTasks = filterTasks(sortedTasks, state.filters)
      return {
        ...state,
        tasks: action.payload,
        filteredTasks,
        isLoading: false,
        error: null
      }
    
    case 'ADD_TASK':
      const newTasks = [action.payload, ...state.tasks]
      const newSortedTasks = sortTasks(newTasks, state.sortBy, state.sortOrder)
      const newFilteredTasks = filterTasks(newSortedTasks, state.filters)
      return {
        ...state,
        tasks: newTasks,
        filteredTasks: newFilteredTasks
      }
    
    case 'UPDATE_TASK':
      const updatedTasks = state.tasks.map(task =>
        task.id === action.payload.id
          ? { ...task, ...action.payload.updates }
          : task
      )
      const updatedSortedTasks = sortTasks(updatedTasks, state.sortBy, state.sortOrder)
      const updatedFilteredTasks = filterTasks(updatedSortedTasks, state.filters)
      return {
        ...state,
        tasks: updatedTasks,
        filteredTasks: updatedFilteredTasks
      }
    
    case 'DELETE_TASK':
      const remainingTasks = state.tasks.filter(task => task.id !== action.payload)
      const remainingSortedTasks = sortTasks(remainingTasks, state.sortBy, state.sortOrder)
      const remainingFilteredTasks = filterTasks(remainingSortedTasks, state.filters)
      return {
        ...state,
        tasks: remainingTasks,
        filteredTasks: remainingFilteredTasks
      }
    
    case 'TOGGLE_TASK':
      const toggledTasks = state.tasks.map(task =>
        task.id === action.payload
          ? { ...task, completed: !task.completed }
          : task
      )
      const toggledSortedTasks = sortTasks(toggledTasks, state.sortBy, state.sortOrder)
      const toggledFilteredTasks = filterTasks(toggledSortedTasks, state.filters)
      return {
        ...state,
        tasks: toggledTasks,
        filteredTasks: toggledFilteredTasks
      }
    
    case 'SET_FILTERS':
      const newFilters = { ...state.filters, ...action.payload }
      const reFilteredTasks = filterTasks(
        sortTasks(state.tasks, state.sortBy, state.sortOrder),
        newFilters
      )
      return {
        ...state,
        filters: newFilters,
        filteredTasks: reFilteredTasks
      }
    
    case 'CLEAR_FILTERS':
      const clearedFilteredTasks = sortTasks(state.tasks, state.sortBy, state.sortOrder)
      return {
        ...state,
        filters: {},
        filteredTasks: clearedFilteredTasks
      }
    
    case 'SET_SORT':
      const reSortedTasks = sortTasks(state.tasks, action.payload.sortBy, action.payload.sortOrder)
      const reSortedFilteredTasks = filterTasks(reSortedTasks, state.filters)
      return {
        ...state,
        sortBy: action.payload.sortBy,
        sortOrder: action.payload.sortOrder,
        filteredTasks: reSortedFilteredTasks
      }
    
    case 'FILTER_TASKS':
      const reProcessedTasks = sortTasks(state.tasks, state.sortBy, state.sortOrder)
      const reProcessedFilteredTasks = filterTasks(reProcessedTasks, state.filters)
      return {
        ...state,
        filteredTasks: reProcessedFilteredTasks
      }
    
    default:
      return state
  }
}

// Context interface
interface TaskContextType {
  state: TaskState
  
  // Task CRUD operations
  addTask: (task: Omit<Task, 'id'>) => void
  updateTask: (id: number, updates: Partial<Task>) => void
  deleteTask: (id: number) => void
  toggleTask: (id: number) => void
  
  // Filtering and sorting
  setFilters: (filters: Partial<TaskState['filters']>) => void
  clearFilters: () => void
  setSort: (sortBy: TaskState['sortBy'], sortOrder: TaskState['sortOrder']) => void
  
  // Async operations
  loadTasks: () => Promise<void>
  
  // Computed values
  completedTasksCount: number
  pendingTasksCount: number
  highPriorityTasksCount: number
  tasksGroupedBySubject: Record<string, Task[]>
}

// Create context
const TaskContext = createContext<TaskContextType | undefined>(undefined)

// Provider component
interface TaskProviderProps {
  children: ReactNode
}

export function TaskProvider({ children }: TaskProviderProps): JSX.Element {
  const [state, dispatch] = useReducer(taskReducer, initialTaskState)

  // Load tasks from localStorage on mount
  useEffect(() => {
    loadTasks()
  }, [])

  // Save tasks to localStorage when they change
  useEffect(() => {
    if (state.tasks.length > 0) {
      localStorage.setItem('ibuddy-tasks', JSON.stringify(state.tasks))
    }
  }, [state.tasks])

  // Action creators
  const loadTasks = async (): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true })
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const savedTasks = localStorage.getItem('ibuddy-tasks')
      const tasks: Task[] = savedTasks 
        ? JSON.parse(savedTasks)
        : [
            { id: 1, title: 'Math IA Research', subject: 'Mathematics', priority: 'high', due: 'Today', completed: false },
            { id: 2, title: 'History Essay Draft', subject: 'History', priority: 'medium', due: 'Tomorrow', completed: false },
            { id: 3, title: 'Chemistry Lab Report', subject: 'Chemistry', priority: 'high', due: '2 days', completed: false },
            { id: 4, title: 'TOK Presentation Prep', subject: 'TOK', priority: 'low', due: '1 week', completed: true }
          ]
      
      dispatch({ type: 'LOAD_TASKS', payload: tasks })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load tasks' })
    }
  }

  const addTask = (taskData: Omit<Task, 'id'>): void => {
    const newTask: Task = {
      ...taskData,
      id: Date.now() // Simple ID generation
    }
    dispatch({ type: 'ADD_TASK', payload: newTask })
  }

  const updateTask = (id: number, updates: Partial<Task>): void => {
    dispatch({ type: 'UPDATE_TASK', payload: { id, updates } })
  }

  const deleteTask = (id: number): void => {
    dispatch({ type: 'DELETE_TASK', payload: id })
  }

  const toggleTask = (id: number): void => {
    dispatch({ type: 'TOGGLE_TASK', payload: id })
  }

  const setFilters = (filters: Partial<TaskState['filters']>): void => {
    dispatch({ type: 'SET_FILTERS', payload: filters })
  }

  const clearFilters = (): void => {
    dispatch({ type: 'CLEAR_FILTERS' })
  }

  const setSort = (sortBy: TaskState['sortBy'], sortOrder: TaskState['sortOrder']): void => {
    dispatch({ type: 'SET_SORT', payload: { sortBy, sortOrder } })
  }

  // Computed values
  const completedTasksCount = state.tasks.filter(task => task.completed).length
  const pendingTasksCount = state.tasks.filter(task => !task.completed).length
  const highPriorityTasksCount = state.tasks.filter(task => task.priority === 'high' && !task.completed).length
  
  const tasksGroupedBySubject = state.tasks.reduce((groups, task) => {
    const subject = task.subject
    if (!groups[subject]) {
      groups[subject] = []
    }
    groups[subject].push(task)
    return groups
  }, {} as Record<string, Task[]>)

  const value: TaskContextType = {
    state,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    setFilters,
    clearFilters,
    setSort,
    loadTasks,
    completedTasksCount,
    pendingTasksCount,
    highPriorityTasksCount,
    tasksGroupedBySubject
  }

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  )
}

// Custom hook to use Task context
export function useTasks(): TaskContextType {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider')
  }
  return context
}

// Selector hooks for performance optimization
export function useTaskList() {
  const { state } = useTasks()
  return state.filteredTasks
}

export function useTaskStats() {
  const { completedTasksCount, pendingTasksCount, highPriorityTasksCount } = useTasks()
  return { completedTasksCount, pendingTasksCount, highPriorityTasksCount }
}