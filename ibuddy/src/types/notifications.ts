import { ReactNode } from 'react'
import { ID, Timestamp } from './index'

// Notification types
export type NotificationType = 'success' | 'error' | 'warning' | 'info'
export type NotificationPosition = 
  | 'top-left' 
  | 'top-center' 
  | 'top-right'
  | 'bottom-left' 
  | 'bottom-center' 
  | 'bottom-right'

export interface Notification {
  id: ID
  type: NotificationType
  title: string
  message?: string
  description?: string
  icon?: ReactNode
  
  // Timing
  duration?: number // milliseconds, null for permanent
  createdAt: Timestamp
  expiresAt?: Timestamp
  
  // Behavior
  dismissible?: boolean
  persistent?: boolean
  pauseOnHover?: boolean
  
  // Actions
  action?: NotificationAction
  actions?: NotificationAction[]
  
  // Styling
  className?: string
  style?: React.CSSProperties
  
  // Metadata
  category?: string
  priority?: 'low' | 'normal' | 'high' | 'urgent'
  userId?: ID
  relatedEntityId?: ID
  relatedEntityType?: string
}

export interface NotificationAction {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
  loading?: boolean
  disabled?: boolean
}

// Notification settings
export interface NotificationSettings {
  // Global settings
  enabled: boolean
  position: NotificationPosition
  maxNotifications: number
  defaultDuration: number
  pauseOnHover: boolean
  newestOnTop: boolean
  
  // Type-specific settings
  typeSettings: Record<NotificationType, {
    enabled: boolean
    duration: number
    sound?: string
    icon?: string
  }>
  
  // Categories
  categorySettings: Record<string, {
    enabled: boolean
    priority: 'low' | 'normal' | 'high'
    channels: NotificationChannel[]
  }>
}

export type NotificationChannel = 'in_app' | 'email' | 'push' | 'sms'

// Push notification types
export interface PushNotificationPayload {
  title: string
  body: string
  icon?: string
  image?: string
  badge?: string
  tag?: string
  data?: Record<string, any>
  actions?: PushNotificationAction[]
  requireInteraction?: boolean
  silent?: boolean
  vibrate?: number[]
}

export interface PushNotificationAction {
  action: string
  title: string
  icon?: string
}

// Email notification types
export interface EmailNotification {
  id: ID
  to: string[]
  cc?: string[]
  bcc?: string[]
  subject: string
  template: string
  templateData: Record<string, any>
  priority: 'low' | 'normal' | 'high'
  scheduledFor?: Timestamp
  sentAt?: Timestamp
  status: 'pending' | 'sent' | 'failed' | 'cancelled'
  error?: string
}

// In-app notification queue
export interface NotificationQueue {
  notifications: Notification[]
  position: NotificationPosition
  maxVisible: number
  globalPause: boolean
  settings: NotificationSettings
}

// Notification context types
export interface NotificationContextType {
  notifications: Notification[]
  settings: NotificationSettings
  
  // Core methods
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => ID
  removeNotification: (id: ID) => void
  clearAllNotifications: () => void
  clearNotificationsByType: (type: NotificationType) => void
  clearNotificationsByCategory: (category: string) => void
  
  // Convenience methods
  success: (title: string, options?: Partial<Notification>) => ID
  error: (title: string, options?: Partial<Notification>) => ID
  warning: (title: string, options?: Partial<Notification>) => ID
  info: (title: string, options?: Partial<Notification>) => ID
  
  // Settings
  updateSettings: (settings: Partial<NotificationSettings>) => void
  
  // Queue management
  pauseQueue: () => void
  resumeQueue: () => void
  isPaused: boolean
}

// Predefined notification templates
export interface NotificationTemplate {
  id: string
  name: string
  type: NotificationType
  title: string
  message?: string
  duration: number
  category: string
  variables?: string[] // placeholders in title/message
}

export const NOTIFICATION_TEMPLATES: Record<string, NotificationTemplate> = {
  TASK_COMPLETED: {
    id: 'task_completed',
    name: 'Task Completed',
    type: 'success',
    title: 'Task completed!',
    message: 'Great job finishing "{taskTitle}"',
    duration: 3000,
    category: 'tasks',
    variables: ['taskTitle']
  },
  SESSION_STARTED: {
    id: 'session_started',
    name: 'Session Started',
    type: 'info',
    title: 'Focus session started',
    message: 'Time to focus! You\'ve got {taskCount} tasks to complete.',
    duration: 2000,
    category: 'arena',
    variables: ['taskCount']
  },
  ACHIEVEMENT_UNLOCKED: {
    id: 'achievement_unlocked',
    name: 'Achievement Unlocked',
    type: 'success',
    title: '🏆 Achievement Unlocked!',
    message: 'You earned "{achievementName}" and {coinReward} coins!',
    duration: 5000,
    category: 'achievements',
    variables: ['achievementName', 'coinReward']
  },
  DEADLINE_WARNING: {
    id: 'deadline_warning',
    name: 'Deadline Warning',
    type: 'warning',
    title: 'Deadline approaching',
    message: '"{taskTitle}" is due {timeUntilDue}',
    duration: 0, // persistent
    category: 'deadlines',
    variables: ['taskTitle', 'timeUntilDue']
  },
  STRESS_ALERT: {
    id: 'stress_alert',
    name: 'Stress Alert',
    type: 'warning',
    title: 'Take a break',
    message: 'Your stress level is high. Consider a breathing exercise.',
    duration: 4000,
    category: 'wellness'
  }
}