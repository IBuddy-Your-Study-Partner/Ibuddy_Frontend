import { ID, Timestamp, Priority, TaskStatus, IBSubject } from './index'

// Basic task types
export type TaskPriority = 'high' | 'medium' | 'low'
export type TaskType = 'assignment' | 'study' | 'revision' | 'project' | 'exam' | 'other'

export interface Task {
  id: ID
  title: string
  description?: string
  subject: string
  subjectCode?: string
  type: TaskType
  priority: TaskPriority
  status: TaskStatus
  due: string // ISO date string or relative like "Today", "Tomorrow"
  dueDate?: Timestamp // Actual date object
  completed: boolean
  completedAt?: Timestamp
  createdAt: Timestamp
  updatedAt: Timestamp
  
  // Time tracking
  estimatedDuration?: number // in minutes
  actualDuration?: number // in minutes
  timeSpent?: number // in minutes
  
  // Metadata
  tags?: string[]
  attachments?: TaskAttachment[]
  dependencies?: ID[] // IDs of tasks that must be completed first
  parentTaskId?: ID // For subtasks
  
  // IB-specific fields
  ibAssessment?: IBAssessmentType
  ibCriteria?: string[]
  wordCount?: number
  maxWordCount?: number
}

export type IBAssessmentType = 
  | 'IA' // Internal Assessment
  | 'EE' // Extended Essay
  | 'TOK_Essay'
  | 'TOK_Exhibition'
  | 'Exam'
  | 'Mock_Exam'
  | 'Coursework'
  | 'CAS_Reflection'

export interface TaskAttachment {
  id: ID
  name: string
  url: string
  type: 'pdf' | 'doc' | 'image' | 'link' | 'other'
  size?: number
  uploadedAt: Timestamp
}

// Task creation and editing
export interface CreateTaskData {
  title: string
  description?: string
  subject: string
  type: TaskType
  priority: TaskPriority
  due: string
  estimatedDuration?: number
  tags?: string[]
  ibAssessment?: IBAssessmentType
}

export interface UpdateTaskData extends Partial<Omit<Task, 'id' | 'createdAt'>> {
  updatedAt: Timestamp
}

// Task filtering and sorting
export interface TaskFilters {
  subject?: string
  subjects?: string[]
  priority?: TaskPriority
  priorities?: TaskPriority[]
  status?: TaskStatus
  statuses?: TaskStatus[]
  type?: TaskType
  types?: TaskType[]
  completed?: boolean
  dueBefore?: Timestamp
  dueAfter?: Timestamp
  tags?: string[]
  searchQuery?: string
  ibAssessment?: IBAssessmentType
}

export type TaskSortField = 
  | 'title'
  | 'due'
  | 'dueDate'
  | 'priority'
  | 'subject'
  | 'status'
  | 'createdAt'
  | 'updatedAt'
  | 'estimatedDuration'

export type SortOrder = 'asc' | 'desc'

export interface TaskSort {
  field: TaskSortField
  order: SortOrder
}

// Task statistics and analytics
export interface TaskStats {
  total: number
  completed: number
  pending: number
  overdue: number
  highPriority: number
  mediumPriority: number
  lowPriority: number
  bySubject: Record<string, number>
  byType: Record<TaskType, number>
  byStatus: Record<TaskStatus, number>
  averageCompletionTime: number // in minutes
  totalTimeSpent: number // in minutes
}

// Task list state
export interface TaskListState {
  tasks: Task[]
  filteredTasks: Task[]
  selectedTasks: ID[]
  filters: TaskFilters
  sort: TaskSort
  isLoading: boolean
  error: string | null
  searchQuery: string
  viewMode: 'list' | 'grid' | 'calendar' | 'kanban'
}

// Bulk operations
export interface BulkTaskOperation {
  type: 'complete' | 'delete' | 'update_priority' | 'update_subject' | 'add_tag'
  taskIds: ID[]
  data?: any
}

export interface BulkTaskResult {
  success: ID[]
  failed: { id: ID; error: string }[]
}