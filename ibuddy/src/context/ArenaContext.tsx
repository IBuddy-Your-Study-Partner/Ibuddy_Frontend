'use client'

import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react'
import type { ArenaTask, SessionData, TimerState } from '../types'

// Types for Arena Context
interface ArenaState {
  // Session management
  currentSession: SessionData | null
  isSessionActive: boolean
  sessionHistory: SessionData[]
  
  // Timer state
  timer: TimerState
  
  // Task management
  currentTaskIndex: number
  tasks: ArenaTask[]
  completedTasks: number[]
  skippedTasks: number[]
  
  // Arena settings
  sessionSettings: {
    pomodoroLength: number // in minutes
    shortBreakLength: number
    longBreakLength: number
    tasksBeforeLongBreak: number
    autoStartBreaks: boolean
    autoStartPomodoros: boolean
  }
  
  // UI state
  showBreathingExercise: boolean
  showTaskPanel: boolean
  arenaMode: 'focus' | 'break' | 'paused'
}

// Action types
type ArenaAction =
  | { type: 'START_SESSION'; payload: { tasks: ArenaTask[] } }
  | { type: 'END_SESSION'; payload: SessionData }
  | { type: 'PAUSE_SESSION' }
  | { type: 'RESUME_SESSION' }
  | { type: 'UPDATE_TIMER'; payload: { timeRemaining: number; isActive: boolean } }
  | { type: 'COMPLETE_TASK'; payload: { taskIndex: number } }
  | { type: 'SKIP_TASK'; payload: { taskIndex: number } }
  | { type: 'NEXT_TASK' }
  | { type: 'SET_ARENA_MODE'; payload: 'focus' | 'break' | 'paused' }
  | { type: 'TOGGLE_BREATHING_EXERCISE' }
  | { type: 'TOGGLE_TASK_PANEL' }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<ArenaState['sessionSettings']> }
  | { type: 'RESET_ARENA' }

// Initial state
const initialArenaState: ArenaState = {
  currentSession: null,
  isSessionActive: false,
  sessionHistory: [],
  
  timer: {
    timeRemaining: 25 * 60, // 25 minutes
    isActive: false,
    currentTask: 1,
    completedTasks: []
  },
  
  currentTaskIndex: 0,
  tasks: [],
  completedTasks: [],
  skippedTasks: [],
  
  sessionSettings: {
    pomodoroLength: 25,
    shortBreakLength: 5,
    longBreakLength: 15,
    tasksBeforeLongBreak: 4,
    autoStartBreaks: false,
    autoStartPomodoros: false
  },
  
  showBreathingExercise: false,
  showTaskPanel: true,
  arenaMode: 'focus'
}

// Reducer function
function arenaReducer(state: ArenaState, action: ArenaAction): ArenaState {
  switch (action.type) {
    case 'START_SESSION':
      return {
        ...state,
        tasks: action.payload.tasks,
        currentTaskIndex: 0,
        completedTasks: [],
        skippedTasks: [],
        isSessionActive: true,
        arenaMode: 'focus',
        timer: {
          ...state.timer,
          timeRemaining: state.sessionSettings.pomodoroLength * 60,
          isActive: false,
          currentTask: 1
        },
        currentSession: {
          tasksCompleted: 0,
          totalTime: 0,
          focusScore: 0,
          startTime: new Date()
        }
      }

    case 'END_SESSION':
      const completedSession = {
        ...action.payload,
        endTime: new Date()
      }
      return {
        ...state,
        currentSession: null,
        isSessionActive: false,
        sessionHistory: [...state.sessionHistory, completedSession],
        arenaMode: 'focus'
      }

    case 'PAUSE_SESSION':
      return {
        ...state,
        arenaMode: 'paused',
        timer: { ...state.timer, isActive: false }
      }

    case 'RESUME_SESSION':
      return {
        ...state,
        arenaMode: 'focus',
        timer: { ...state.timer, isActive: true }
      }

    case 'UPDATE_TIMER':
      return {
        ...state,
        timer: {
          ...state.timer,
          timeRemaining: action.payload.timeRemaining,
          isActive: action.payload.isActive
        }
      }

    case 'COMPLETE_TASK':
      const newCompletedTasks = [...state.completedTasks, action.payload.taskIndex]
      return {
        ...state,
        completedTasks: newCompletedTasks,
        timer: {
          ...state.timer,
          completedTasks: newCompletedTasks
        }
      }

    case 'SKIP_TASK':
      return {
        ...state,
        skippedTasks: [...state.skippedTasks, action.payload.taskIndex]
      }

    case 'NEXT_TASK':
      const nextIndex = state.currentTaskIndex + 1
      return {
        ...state,
        currentTaskIndex: nextIndex,
        timer: {
          ...state.timer,
          currentTask: nextIndex + 1,
          timeRemaining: state.sessionSettings.pomodoroLength * 60,
          isActive: false
        }
      }

    case 'SET_ARENA_MODE':
      return {
        ...state,
        arenaMode: action.payload
      }

    case 'TOGGLE_BREATHING_EXERCISE':
      return {
        ...state,
        showBreathingExercise: !state.showBreathingExercise
      }

    case 'TOGGLE_TASK_PANEL':
      return {
        ...state,
        showTaskPanel: !state.showTaskPanel
      }

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        sessionSettings: {
          ...state.sessionSettings,
          ...action.payload
        }
      }

    case 'RESET_ARENA':
      return {
        ...initialArenaState,
        sessionSettings: state.sessionSettings, // Preserve settings
        sessionHistory: state.sessionHistory // Preserve history
      }

    default:
      return state
  }
}

// Context interface
interface ArenaContextType {
  state: ArenaState
  
  // Session actions
  startSession: (tasks: ArenaTask[]) => void
  endSession: (sessionData: SessionData) => void
  pauseSession: () => void
  resumeSession: () => void
  resetArena: () => void
  
  // Timer actions
  updateTimer: (timeRemaining: number, isActive: boolean) => void
  
  // Task actions
  completeTask: (taskIndex: number) => void
  skipTask: (taskIndex: number) => void
  nextTask: () => void
  
  // UI actions
  toggleBreathingExercise: () => void
  toggleTaskPanel: () => void
  setArenaMode: (mode: 'focus' | 'break' | 'paused') => void
  
  // Settings
  updateSettings: (settings: Partial<ArenaState['sessionSettings']>) => void
  
  // Computed values
  currentTask: ArenaTask | null
  sessionProgress: number
  timeSpentInSession: number
  tasksRemaining: number
}

// Create context
const ArenaContext = createContext<ArenaContextType | undefined>(undefined)

// Provider component
interface ArenaProviderProps {
  children: ReactNode
}

export function ArenaProvider({ children }: ArenaProviderProps): JSX.Element {
  const [state, dispatch] = useReducer(arenaReducer, initialArenaState)

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('ibuddy-arena-state')
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState)
        // Restore relevant parts of state
        if (parsed.sessionSettings) {
          dispatch({ type: 'UPDATE_SETTINGS', payload: parsed.sessionSettings })
        }
      } catch (error) {
        console.error('Failed to parse arena state from localStorage:', error)
      }
    }
  }, [])

  // Save state to localStorage when it changes
  useEffect(() => {
    const stateToSave = {
      sessionSettings: state.sessionSettings,
      sessionHistory: state.sessionHistory
    }
    localStorage.setItem('ibuddy-arena-state', JSON.stringify(stateToSave))
  }, [state.sessionSettings, state.sessionHistory])

  // Action creators
  const startSession = (tasks: ArenaTask[]) => {
    dispatch({ type: 'START_SESSION', payload: { tasks } })
  }

  const endSession = (sessionData: SessionData) => {
    dispatch({ type: 'END_SESSION', payload: sessionData })
  }

  const pauseSession = () => {
    dispatch({ type: 'PAUSE_SESSION' })
  }

  const resumeSession = () => {
    dispatch({ type: 'RESUME_SESSION' })
  }

  const resetArena = () => {
    dispatch({ type: 'RESET_ARENA' })
  }

  const updateTimer = (timeRemaining: number, isActive: boolean) => {
    dispatch({ type: 'UPDATE_TIMER', payload: { timeRemaining, isActive } })
  }

  const completeTask = (taskIndex: number) => {
    dispatch({ type: 'COMPLETE_TASK', payload: { taskIndex } })
  }

  const skipTask = (taskIndex: number) => {
    dispatch({ type: 'SKIP_TASK', payload: { taskIndex } })
  }

  const nextTask = () => {
    dispatch({ type: 'NEXT_TASK' })
  }

  const toggleBreathingExercise = () => {
    dispatch({ type: 'TOGGLE_BREATHING_EXERCISE' })
  }

  const toggleTaskPanel = () => {
    dispatch({ type: 'TOGGLE_TASK_PANEL' })
  }

  const setArenaMode = (mode: 'focus' | 'break' | 'paused') => {
    dispatch({ type: 'SET_ARENA_MODE', payload: mode })
  }

  const updateSettings = (settings: Partial<ArenaState['sessionSettings']>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings })
  }

  // Computed values
  const currentTask = state.tasks[state.currentTaskIndex] || null
  const sessionProgress = state.tasks.length > 0 
    ? ((state.currentTaskIndex + 1) / state.tasks.length) * 100 
    : 0
  const timeSpentInSession = state.currentSession 
    ? Date.now() - new Date(state.currentSession.startTime || Date.now()).getTime()
    : 0
  const tasksRemaining = state.tasks.length - state.currentTaskIndex - 1

  const value: ArenaContextType = {
    state,
    startSession,
    endSession,
    pauseSession,
    resumeSession,
    resetArena,
    updateTimer,
    completeTask,
    skipTask,
    nextTask,
    toggleBreathingExercise,
    toggleTaskPanel,
    setArenaMode,
    updateSettings,
    currentTask,
    sessionProgress,
    timeSpentInSession,
    tasksRemaining
  }

  return (
    <ArenaContext.Provider value={value}>
      {children}
    </ArenaContext.Provider>
  )
}

// Custom hook to use Arena context
export function useArena(): ArenaContextType {
  const context = useContext(ArenaContext)
  if (!context) {
    throw new Error('useArena must be used within an ArenaProvider')
  }
  return context
}

// Selector hooks for performance optimization
export function useArenaTimer() {
  const { state, updateTimer } = useArena()
  return {
    timeRemaining: state.timer.timeRemaining,
    isActive: state.timer.isActive,
    updateTimer
  }
}

export function useArenaProgress() {
  const { state, currentTask, sessionProgress, tasksRemaining } = useArena()
  return {
    currentTaskIndex: state.currentTaskIndex,
    completedTasks: state.completedTasks,
    currentTask,
    sessionProgress,
    tasksRemaining,
    totalTasks: state.tasks.length
  }
}