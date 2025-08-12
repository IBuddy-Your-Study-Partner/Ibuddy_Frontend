'use client'

import { createContext, useContext, useReducer, ReactNode, useCallback } from 'react'

// Notification types
interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
  dismissible?: boolean
  persistent?: boolean
}

interface NotificationState {
  notifications: Notification[]
  globalSettings: {
    position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
    defaultDuration: number
    maxNotifications: number
    pauseOnHover: boolean
  }
}

// Action types
type NotificationAction =
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_ALL_NOTIFICATIONS' }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<NotificationState['globalSettings']> }

// Initial state
const initialNotificationState: NotificationState = {
  notifications: [],
  globalSettings: {
    position: 'top-right',
    defaultDuration: 5000,
    maxNotifications: 5,
    pauseOnHover: true
  }
}

// Reducer function
function notificationReducer(state: NotificationState, action: NotificationAction): NotificationState {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      const newNotifications = [action.payload, ...state.notifications]
      
      // Limit number of notifications
      const limitedNotifications = newNotifications.slice(0, state.globalSettings.maxNotifications)
      
      return {
        ...state,
        notifications: limitedNotifications
      }
    
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(notification => notification.id !== action.payload)
      }
    
    case 'CLEAR_ALL_NOTIFICATIONS':
      return {
        ...state,
        notifications: []
      }
    
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        globalSettings: { ...state.globalSettings, ...action.payload }
      }
    
    default:
      return state
  }
}

// Context interface
interface NotificationContextType {
  notifications: Notification[]
  settings: NotificationState['globalSettings']
  
  // Notification management
  addNotification: (notification: Omit<Notification, 'id'>) => string
  removeNotification: (id: string) => void
  clearAllNotifications: () => void
  
  // Convenience methods for different types
  showSuccess: (title: string, message?: string, options?: Partial<Notification>) => string
  showError: (title: string, message?: string, options?: Partial<Notification>) => string
  showWarning: (title: string, message?: string, options?: Partial<Notification>) => string
  showInfo: (title: string, message?: string, options?: Partial<Notification>) => string
  
  // Settings
  updateSettings: (settings: Partial<NotificationState['globalSettings']>) => void
}

// Create context
const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

// Provider component
interface NotificationProviderProps {
  children: ReactNode
}

export function NotificationProvider({ children }: NotificationProviderProps): JSX.Element {
  const [state, dispatch] = useReducer(notificationReducer, initialNotificationState)

  // Auto-remove notifications after duration
  const scheduleRemoval = useCallback((id: string, duration: number) => {
    setTimeout(() => {
      dispatch({ type: 'REMOVE_NOTIFICATION', payload: id })
    }, duration)
  }, [])

  // Action creators
  const addNotification = (notification: Omit<Notification, 'id'>): string => {
    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const fullNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration ?? state.globalSettings.defaultDuration,
      dismissible: notification.dismissible ?? true
    }
    
    dispatch({ type: 'ADD_NOTIFICATION', payload: fullNotification })
    
    // Schedule auto-removal if not persistent
    if (!fullNotification.persistent && fullNotification.duration) {
      scheduleRemoval(id, fullNotification.duration)
    }
    
    return id
  }

  const removeNotification = (id: string): void => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id })
  }

  const clearAllNotifications = (): void => {
    dispatch({ type: 'CLEAR_ALL_NOTIFICATIONS' })
  }

  const updateSettings = (settings: Partial<NotificationState['globalSettings']>): void => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings })
  }

  // Convenience methods
  const showSuccess = (title: string, message?: string, options: Partial<Notification> = {}): string => {
    return addNotification({ ...options, type: 'success', title, message })
  }

  const showError = (title: string, message?: string, options: Partial<Notification> = {}): string => {
    return addNotification({ ...options, type: 'error', title, message })
  }

  const showWarning = (title: string, message?: string, options: Partial<Notification> = {}): string => {
    return addNotification({ ...options, type: 'warning', title, message })
  }

  const showInfo = (title: string, message?: string, options: Partial<Notification> = {}): string => {
    return addNotification({ ...options, type: 'info', title, message })
  }

  const value: NotificationContextType = {
    notifications: state.notifications,
    settings: state.globalSettings,
    addNotification,
    removeNotification,
    clearAllNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    updateSettings
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

// Custom hook to use Notification context
export function useNotifications(): NotificationContextType {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

// Hook for easy toast notifications
export function useToast() {
  const { showSuccess, showError, showWarning, showInfo } = useNotifications()
  
  return {
    success: showSuccess,
    error: showError,
    warning: showWarning,
    info: showInfo
  }
}