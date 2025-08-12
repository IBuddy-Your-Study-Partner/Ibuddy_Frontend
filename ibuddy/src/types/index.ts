// Re-export all types for easy importing
export type * from './tasks'
export type * from './session'
export type * from './user'
export type * from './arena'
export type * from './ui'
export type * from './notifications'
export type * from './analytics'

// Global utility types
export type ID = string | number
export type Timestamp = string | Date
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>

// Common enums
export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

// IB-specific types
export interface IBSubject {
  code: string
  name: string
  level: 'HL' | 'SL'
  group: 1 | 2 | 3 | 4 | 5 | 6
  color: string
}

export const IB_SUBJECTS: Record<string, IBSubject> = {
  MATH_AA: { code: 'MATH_AA', name: 'Mathematics AA', level: 'HL', group: 5, color: '#3B82F6' },
  MATH_AI: { code: 'MATH_AI', name: 'Mathematics AI', level: 'SL', group: 5, color: '#3B82F6' },
  ENGLISH_LANG: { code: 'ENG_A', name: 'English A: Language & Literature', level: 'HL', group: 1, color: '#10B981' },
  HISTORY: { code: 'HIST', name: 'History', level: 'HL', group: 3, color: '#F59E0B' },
  CHEMISTRY: { code: 'CHEM', name: 'Chemistry', level: 'HL', group: 4, color: '#8B5CF6' },
  ECONOMICS: { code: 'ECON', name: 'Economics', level: 'SL', group: 3, color: '#EF4444' },
  FRENCH: { code: 'FRENCH_B', name: 'French B', level: 'SL', group: 2, color: '#6366F1' },
  TOK: { code: 'TOK', name: 'Theory of Knowledge', level: 'SL', group: 0, color: '#059669' },
  EE: { code: 'EE', name: 'Extended Essay', level: 'SL', group: 0, color: '#DC2626' },
  CAS: { code: 'CAS', name: 'Creativity, Activity, Service', level: 'SL', group: 0, color: '#7C3AED' }
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
  error?: string
  timestamp: Timestamp
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Error types
export interface AppError {
  code: string
  message: string
  details?: Record<string, any>
  timestamp: Timestamp
}

export type ErrorCode = 
  | 'VALIDATION_ERROR'
  | 'NETWORK_ERROR'
  | 'AUTH_ERROR'
  | 'NOT_FOUND'
  | 'SERVER_ERROR'
  | 'RATE_LIMIT_EXCEEDED'

// Theme types
export type Theme = 'light' | 'dark' | 'auto'
export type ResolvedTheme = 'light' | 'dark'