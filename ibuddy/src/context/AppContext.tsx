'use client'

import { ReactNode } from 'react'
import { ArenaProvider } from './ArenaContext'
import { TaskProvider } from './TaskContext'
import { UserProvider } from './UserContext'
import { ThemeProvider } from './ThemeContext'
import { NotificationProvider } from './NotificationContext'

interface AppContextProviderProps {
  children: ReactNode
}

/**
 * Main context provider that wraps all other providers
 * This ensures proper context hierarchy and prevents provider nesting issues
 */
export function AppContextProvider({ children }: AppContextProviderProps): JSX.Element {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <UserProvider>
          <TaskProvider>
            <ArenaProvider>
              {children}
            </ArenaProvider>
          </TaskProvider>
        </UserProvider>
      </NotificationProvider>
    </ThemeProvider>
  )
}

// Re-export all hooks for convenience
export { useArena, useArenaTimer, useArenaProgress } from './ArenaContext'
export { useTasks, useTaskList, useTaskStats } from './TaskContext'
export { useUser, useUserProfile, useUserStats, useUserPreferences } from './UserContext'
export { useTheme } from './ThemeContext'
export { useNotifications, useToast } from './NotificationContext'