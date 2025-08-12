'use client'

import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react'
import type { UserStats } from '../types'

// Extended user profile interface
interface UserProfile {
  id: string
  name: string
  email: string
  avatar?: string
  ibSubjects: string[]
  studyGoals: {
    dailyFocusTime: number // in minutes
    weeklyTaskTarget: number
    preferredStudyTimes: string[]
  }
  preferences: {
    pomodoroLength: number
    shortBreakLength: number
    longBreakLength: number
    theme: 'light' | 'dark' | 'auto'
    notifications: boolean
    soundEnabled: boolean
    breathingReminders: boolean
  }
  achievements: {
    id: string
    name: string
    description: string
    unlockedAt: Date
    rarity: 'common' | 'rare' | 'epic' | 'legendary'
  }[]
}

// User state interface
interface UserState {
  profile: UserProfile | null
  stats: UserStats
  isLoading: boolean
  error: string | null
  lastSync: Date | null
}

// Action types
type UserAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOAD_USER_DATA'; payload: { profile: UserProfile; stats: UserStats } }
  | { type: 'UPDATE_PROFILE'; payload: Partial<UserProfile> }
  | { type: 'UPDATE_STATS'; payload: Partial<UserStats> }
  | { type: 'UPDATE_PREFERENCES'; payload: Partial<UserProfile['preferences']> }
  | { type: 'ADD_ACHIEVEMENT'; payload: UserProfile['achievements'][0] }
  | { type: 'INCREMENT_STREAK' }
  | { type: 'RESET_STREAK' }
  | { type: 'ADD_FOCUS_TIME'; payload: number }
  | { type: 'ADD_COMPLETED_TASKS'; payload: number }
  | { type: 'UPDATE_STRESS_LEVEL'; payload: number }
  | { type: 'ADD_COINS'; payload: number }
  | { type: 'SPEND_COINS'; payload: number }
  | { type: 'SYNC_SUCCESS' }

// Initial state
const initialUserState: UserState = {
  profile: null,
  stats: {
    tasksCompleted: 0,
    focusTime: 0,
    stressLevel: 3,
    streak: 0,
    coins: 0,
    level: 1,
    xp: 0
  },
  isLoading: true,
  error: null,
  lastSync: null
}

// Helper functions
const calculateLevel = (xp: number): number => {
  // Simple level calculation: every 1000 XP = 1 level
  return Math.floor(xp / 1000) + 1
}

const calculateXPForLevel = (level: number): number => {
  return (level - 1) * 1000
}

const getXPForNextLevel = (currentXP: number, currentLevel: number): number => {
  return calculateXPForLevel(currentLevel + 1) - currentXP
}

// Reducer function
function userReducer(state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false }
    
    case 'LOAD_USER_DATA':
      return {
        ...state,
        profile: action.payload.profile,
        stats: action.payload.stats,
        isLoading: false,
        error: null
      }
    
    case 'UPDATE_PROFILE':
      return {
        ...state,
        profile: state.profile ? { ...state.profile, ...action.payload } : null
      }
    
    case 'UPDATE_STATS':
      const updatedStats = { ...state.stats, ...action.payload }
      const newLevel = calculateLevel(updatedStats.xp || 0)
      
      return {
        ...state,
        stats: {
          ...updatedStats,
          level: newLevel
        }
      }
    
    case 'UPDATE_PREFERENCES':
      return {
        ...state,
        profile: state.profile ? {
          ...state.profile,
          preferences: { ...state.profile.preferences, ...action.payload }
        } : null
      }
    
    case 'ADD_ACHIEVEMENT':
      return {
        ...state,
        profile: state.profile ? {
          ...state.profile,
          achievements: [...state.profile.achievements, action.payload]
        } : null
      }
    
    case 'INCREMENT_STREAK':
      return {
        ...state,
        stats: { ...state.stats, streak: state.stats.streak + 1 }
      }
    
    case 'RESET_STREAK':
      return {
        ...state,
        stats: { ...state.stats, streak: 0 }
      }
    
    case 'ADD_FOCUS_TIME':
      const newFocusTime = state.stats.focusTime + action.payload
      const focusXP = Math.floor(action.payload / 10) // 1 XP per 10 minutes
      return {
        ...state,
        stats: {
          ...state.stats,
          focusTime: newFocusTime,
          xp: (state.stats.xp || 0) + focusXP,
          level: calculateLevel((state.stats.xp || 0) + focusXP)
        }
      }
    
    case 'ADD_COMPLETED_TASKS':
      const taskXP = action.payload * 50 // 50 XP per task
      return {
        ...state,
        stats: {
          ...state.stats,
          tasksCompleted: state.stats.tasksCompleted + action.payload,
          xp: (state.stats.xp || 0) + taskXP,
          level: calculateLevel((state.stats.xp || 0) + taskXP)
        }
      }
    
    case 'UPDATE_STRESS_LEVEL':
      return {
        ...state,
        stats: { ...state.stats, stressLevel: action.payload }
      }
    
    case 'ADD_COINS':
      return {
        ...state,
        stats: { ...state.stats, coins: state.stats.coins + action.payload }
      }
    
    case 'SPEND_COINS':
      return {
        ...state,
        stats: { 
          ...state.stats, 
          coins: Math.max(0, state.stats.coins - action.payload) 
        }
      }
    
    case 'SYNC_SUCCESS':
      return {
        ...state,
        lastSync: new Date()
      }
    
    default:
      return state
  }
}

// Context interface
interface UserContextType {
  state: UserState
  
  // Profile management
  updateProfile: (updates: Partial<UserProfile>) => void
  updatePreferences: (preferences: Partial<UserProfile['preferences']>) => void
  
  // Stats management
  updateStats: (stats: Partial<UserStats>) => void
  addFocusTime: (minutes: number) => void
  addCompletedTasks: (count: number) => void
  updateStressLevel: (level: number) => void
  
  // Gamification
  addCoins: (amount: number) => void
  spendCoins: (amount: number) => boolean
  addAchievement: (achievement: UserProfile['achievements'][0]) => void
  incrementStreak: () => void
  resetStreak: () => void
  
  // Data management
  loadUserData: () => Promise<void>
  syncUserData: () => Promise<void>
  
  // Computed values
  xpForNextLevel: number
  levelProgress: number
  canAfford: (cost: number) => boolean
}

// Create context
const UserContext = createContext<UserContextType | undefined>(undefined)

// Provider component
interface UserProviderProps {
  children: ReactNode
}

export function UserProvider({ children }: UserProviderProps): JSX.Element {
  const [state, dispatch] = useReducer(userReducer, initialUserState)

  // Load user data on mount
  useEffect(() => {
    loadUserData()
  }, [])

  // Auto-save user data when it changes
  useEffect(() => {
    if (state.profile && state.stats && !state.isLoading) {
      const userData = {
        profile: state.profile,
        stats: state.stats,
        lastUpdated: new Date().toISOString()
      }
      localStorage.setItem('ibuddy-user-data', JSON.stringify(userData))
    }
  }, [state.profile, state.stats, state.isLoading])

  // Action creators
  const loadUserData = async (): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true })
    
    try {
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const savedData = localStorage.getItem('ibuddy-user-data')
      
      if (savedData) {
        const { profile, stats } = JSON.parse(savedData)
        dispatch({ type: 'LOAD_USER_DATA', payload: { profile, stats } })
      } else {
        // Create default user profile
        const defaultProfile: UserProfile = {
          id: 'user-' + Date.now(),
          name: 'IB Student',
          email: 'student@example.com',
          ibSubjects: ['Mathematics', 'English', 'History', 'Chemistry', 'Economics', 'French'],
          studyGoals: {
            dailyFocusTime: 120, // 2 hours
            weeklyTaskTarget: 20,
            preferredStudyTimes: ['14:00', '19:00']
          },
          preferences: {
            pomodoroLength: 25,
            shortBreakLength: 5,
            longBreakLength: 15,
            theme: 'light',
            notifications: true,
            soundEnabled: true,
            breathingReminders: true
          },
          achievements: []
        }
        
        const defaultStats: UserStats = {
          tasksCompleted: 0,
          focusTime: 0,
          stressLevel: 3,
          streak: 0,
          coins: 100, // Starting coins
          level: 1,
          xp: 0
        }
        
        dispatch({ type: 'LOAD_USER_DATA', payload: { profile: defaultProfile, stats: defaultStats } })
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load user data' })
    }
  }

  const syncUserData = async (): Promise<void> => {
    try {
      // In a real app, this would sync with a backend
      await new Promise(resolve => setTimeout(resolve, 500))
      dispatch({ type: 'SYNC_SUCCESS' })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to sync user data' })
    }
  }

  const updateProfile = (updates: Partial<UserProfile>): void => {
    dispatch({ type: 'UPDATE_PROFILE', payload: updates })
  }

  const updatePreferences = (preferences: Partial<UserProfile['preferences']>): void => {
    dispatch({ type: 'UPDATE_PREFERENCES', payload: preferences })
  }

  const updateStats = (stats: Partial<UserStats>): void => {
    dispatch({ type: 'UPDATE_STATS', payload: stats })
  }

  const addFocusTime = (minutes: number): void => {
    dispatch({ type: 'ADD_FOCUS_TIME', payload: minutes })
  }

  const addCompletedTasks = (count: number): void => {
    dispatch({ type: 'ADD_COMPLETED_TASKS', payload: count })
  }

  const updateStressLevel = (level: number): void => {
    dispatch({ type: 'UPDATE_STRESS_LEVEL', payload: level })
  }

  const addCoins = (amount: number): void => {
    dispatch({ type: 'ADD_COINS', payload: amount })
  }

  const spendCoins = (amount: number): boolean => {
    if (state.stats.coins >= amount) {
      dispatch({ type: 'SPEND_COINS', payload: amount })
      return true
    }
    return false
  }

  const addAchievement = (achievement: UserProfile['achievements'][0]): void => {
    dispatch({ type: 'ADD_ACHIEVEMENT', payload: achievement })
  }

  const incrementStreak = (): void => {
    dispatch({ type: 'INCREMENT_STREAK' })
  }

  const resetStreak = (): void => {
    dispatch({ type: 'RESET_STREAK' })
  }

  // Computed values
  const xpForNextLevel = getXPForNextLevel(state.stats.xp || 0, state.stats.level || 1)
  const levelProgress = ((state.stats.xp || 0) % 1000) / 1000 * 100
  const canAfford = (cost: number): boolean => state.stats.coins >= cost

  const value: UserContextType = {
    state,
    updateProfile,
    updatePreferences,
    updateStats,
    addFocusTime,
    addCompletedTasks,
    updateStressLevel,
    addCoins,
    spendCoins,
    addAchievement,
    incrementStreak,
    resetStreak,
    loadUserData,
    syncUserData,
    xpForNextLevel,
    levelProgress,
    canAfford
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

// Custom hook to use User context
export function useUser(): UserContextType {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

// Selector hooks for performance optimization
export function useUserProfile() {
  const { state } = useUser()
  return state.profile
}

export function useUserStats() {
  const { state } = useUser()
  return state.stats
}

export function useUserPreferences() {
  const { state } = useUser()
  return state.profile?.preferences
}