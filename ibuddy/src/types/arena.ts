import { ID, Timestamp } from './index'
import { ArenaTask, SessionData, SessionSettings, TimerState } from './session'

// Arena-specific state types
export interface ArenaState {
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
  sessionSettings: SessionSettings
  
  // UI state
  showBreathingExercise: boolean
  showTaskPanel: boolean
  showSettings: boolean
  isFullscreen: boolean
  arenaMode: 'focus' | 'break' | 'paused'
  
  // Breathing exercise state
  breathingState: BreathingState
  
  // Background and ambiance
  ambientSettings: AmbientSettings
}

export interface BreathingState {
  isActive: boolean
  pattern: BreathingPattern
  cycleCount: number
  totalCycles: number
  currentPhase: 'inhale' | 'hold' | 'exhale' | 'pause'
  phaseTimeRemaining: number
  autoClose: boolean
}

export interface BreathingPattern {
  name: string
  description: string
  phases: {
    inhale: number // seconds
    holdAfterInhale?: number
    exhale: number
    holdAfterExhale?: number
  }
  totalCycles: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

export interface AmbientSettings {
  backgroundSound: {
    enabled: boolean
    type: 'none' | 'nature' | 'white_noise' | 'lofi' | 'classical' | 'rain' | 'ocean'
    volume: number // 0-100
    fadeInOut: boolean
  }
  
  visualEffects: {
    enabled: boolean
    type: 'particles' | 'gradient' | 'breathing_circle' | 'none'
    intensity: number // 0-100
    colorScheme: 'blue' | 'green' | 'purple' | 'warm' | 'cool'
  }
  
  lighting: {
    dimBackground: boolean
    blueLight: boolean
    contrast: number // 0-100
  }
}

// Arena action types for reducer
export type ArenaAction =
  | { type: 'START_SESSION'; payload: { tasks: ArenaTask[] } }
  | { type: 'END_SESSION'; payload: SessionData }
  | { type: 'PAUSE_SESSION' }
  | { type: 'RESUME_SESSION' }
  | { type: 'CANCEL_SESSION' }
  | { type: 'UPDATE_TIMER'; payload: Partial<TimerState> }
  | { type: 'COMPLETE_TASK'; payload: { taskIndex: number; actualDuration?: number } }
  | { type: 'SKIP_TASK'; payload: { taskIndex: number; reason?: string } }
  | { type: 'NEXT_TASK' }
  | { type: 'PREVIOUS_TASK' }
  | { type: 'SET_ARENA_MODE'; payload: ArenaState['arenaMode'] }
  | { type: 'TOGGLE_BREATHING_EXERCISE' }
  | { type: 'UPDATE_BREATHING_STATE'; payload: Partial<BreathingState> }
  | { type: 'TOGGLE_TASK_PANEL' }
  | { type: 'TOGGLE_SETTINGS' }
  | { type: 'TOGGLE_FULLSCREEN' }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<SessionSettings> }
  | { type: 'UPDATE_AMBIENT_SETTINGS'; payload: Partial<AmbientSettings> }
  | { type: 'RESET_ARENA' }
  | { type: 'LOAD_SESSION_HISTORY'; payload: SessionData[] }

// Arena event types for analytics
export interface ArenaEvent {
  id: ID
  sessionId: ID
  type: ArenaEventType
  timestamp: Timestamp
  data: Record<string, any>
  duration?: number // in milliseconds
}

export type ArenaEventType = 
  | 'session_started'
  | 'session_paused'
  | 'session_resumed'
  | 'session_ended'
  | 'task_started'
  | 'task_completed'
  | 'task_skipped'
  | 'break_started'
  | 'break_ended'
  | 'breathing_exercise_started'
  | 'breathing_exercise_completed'
  | 'settings_changed'
  | 'distraction_noted'
  | 'mood_updated'
  | 'full_screen_toggled'
  | 'ambient_sound_changed'

// Arena performance metrics
export interface ArenaMetrics {
  sessionId: ID
  
  // Time metrics
  totalSessionTime: number // milliseconds
  actualFocusTime: number
  breakTime: number
  pausedTime: number
  
  // Task metrics
  tasksPlanned: number
  tasksCompleted: number
  tasksSkipped: number
  averageTaskDuration: number
  taskCompletionRate: number
  
  // Focus metrics
  focusScore: number // 0-100
  longestFocusStreak: number // minutes
  numberOfPauses: number
  averagePauseLength: number
  distractionCount: number
  
  // Wellness metrics
  stressLevelChange: number
  moodChange: number
  breathingExercisesUsed: number
  
  // Engagement metrics
  interactionCount: number
  settingsChanges: number
  fullScreenTime: number // percentage
  ambientSoundUsage: number // percentage
}

// Arena preferences specific to the Arena Mode
export interface ArenaPreferences {
  // Default session settings
  defaultSessionLength: number // minutes
  defaultBreakLength: number
  autoStartSession: boolean
  autoStartBreaks: boolean
  
  // UI preferences
  defaultFullScreen: boolean
  showTaskEstimates: boolean
  showProgressPercentage: boolean
  enableKeyboardShortcuts: boolean
  
  // Audio preferences
  tickingSound: boolean
  completionSound: boolean
  breakSound: boolean
  ambientSoundDefault: AmbientSettings['backgroundSound']['type']
  
  // Breathing exercise preferences
  defaultBreathingPattern: string
  autoSuggestBreathing: boolean
  breathingReminderInterval: number // minutes
  
  // Advanced features
  strictMode: boolean // prevents pausing during focus
  pomodoroMode: boolean // uses traditional 25/5 timing
  adaptiveBreaks: boolean // adjusts break length based on focus score
  smartTaskOrdering: boolean // reorders tasks based on energy/focus
}

// Arena shortcuts and hotkeys
export interface ArenaShortcut {
  key: string
  modifiers: ('ctrl' | 'alt' | 'shift' | 'meta')[]
  action: ArenaShortcutAction
  description: string
  enabled: boolean
}

export type ArenaShortcutAction = 
  | 'toggle_timer'
  | 'skip_task'
  | 'complete_task'
  | 'toggle_breathing'
  | 'toggle_fullscreen'
  | 'toggle_task_panel'
  | 'emergency_exit'
  | 'increase_volume'
  | 'decrease_volume'
  | 'next_ambient_sound'