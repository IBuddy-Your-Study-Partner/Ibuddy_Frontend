import { ID, Timestamp } from './index'
import { Task } from './tasks'

// Arena session types
export type SessionStatus = 'idle' | 'active' | 'paused' | 'completed' | 'cancelled'
export type SessionType = 'focus' | 'study' | 'revision' | 'mixed'
export type ArenaMode = 'focus' | 'break' | 'paused'

export interface ArenaTask {
  id: ID
  title: string
  subject: string
  subjectCode?: string
  duration: number // estimated duration in minutes
  type: 'focus' | 'break' | 'review'
  priority: 'high' | 'medium' | 'low'
  completed?: boolean
  skipped?: boolean
  actualDuration?: number
  startTime?: Timestamp
  endTime?: Timestamp
  notes?: string
}

export interface SessionData {
  id?: ID
  type: SessionType
  status: SessionStatus
  tasksCompleted: number
  totalTasks: number
  totalTime: number // in minutes
  focusTime: number // in minutes
  breakTime: number // in minutes
  focusScore: number // 0-100
  startTime?: Timestamp
  endTime?: Timestamp
  
  // Wellness metrics
  initialStressLevel?: number
  finalStressLevel?: number
  stressReduction?: number
  moodBefore?: number
  moodAfter?: number
  
  // Performance metrics
  averageTaskDuration?: number
  longestFocusStreak?: number
  numberOfBreaks?: number
  productivityScore?: number
  
  // Tasks data
  tasks?: ArenaTask[]
  completedTaskIds?: ID[]
  skippedTaskIds?: ID[]
  
  // Session settings used
  pomodoroLength?: number
  shortBreakLength?: number
  longBreakLength?: number
  
  // Metadata
  notes?: string
  tags?: string[]
  location?: string
  environment?: 'quiet' | 'normal' | 'noisy'
}

// Timer state
export interface TimerState {
  timeRemaining: number // in seconds
  totalTime: number // in seconds
  isActive: boolean
  currentTask: number
  completedTasks: number[]
  mode: ArenaMode
  sessionStartTime?: Timestamp
  currentTaskStartTime?: Timestamp
}

// Session settings
export interface SessionSettings {
  // Pomodoro settings
  pomodoroLength: number // in minutes
  shortBreakLength: number // in minutes
  longBreakLength: number // in minutes
  tasksBeforeLongBreak: number
  
  // Auto-start settings
  autoStartBreaks: boolean
  autoStartPomodoros: boolean
  autoAdvanceTasks: boolean
  
  // Notification settings
  soundEnabled: boolean
  notificationsEnabled: boolean
  breathingReminders: boolean
  remindersInterval: number // in minutes
  
  // UI settings
  showTaskPanel: boolean
  showProgressBar: boolean
  enableFullscreen: boolean
  dimBackground: boolean
  
  // Advanced settings
  strictMode: boolean // prevents pausing during focus time
  minimumBreakTime: number // minimum break time in minutes
  maximumSessionTime: number // maximum session time in minutes
  backgroundSounds: boolean
  ambientSoundType?: 'nature' | 'white_noise' | 'lofi' | 'classical'
}

// Performance data for charts
export interface PerformanceDataPoint {
  time: string // "0min", "15min", etc.
  timeMinutes: number
  mood: number // 1-5 scale
  focus: number // 1-5 scale
  energy: number // 1-5 scale
  stress: number // 1-5 scale
  productivity: number // calculated score
  timestamp: Timestamp
}

export interface SessionAnalytics {
  sessionId: ID
  performanceData: PerformanceDataPoint[]
  insights: SessionInsight[]
  recommendations: string[]
  achievements: string[]
  improvements: {
    category: string
    suggestion: string
    impact: 'low' | 'medium' | 'high'
  }[]
}

export interface SessionInsight {
  type: 'peak_performance' | 'low_energy' | 'mood_improvement' | 'stress_reduction' | 'focus_pattern'
  message: string
  timeframe: string
  data: Record<string, any>
  confidence: number // 0-1
}

// Session history and trends
export interface SessionTrends {
  dailyAverage: number
  weeklyAverage: number
  monthlyAverage: number
  streak: number
  longestStreak: number
  totalSessions: number
  totalFocusTime: number
  averageFocusScore: number
  improvementRate: number // percentage
  consistency: number // 0-1 score
}

// Break types and activities
export interface BreakActivity {
  id: ID
  name: string
  type: 'physical' | 'mental' | 'social' | 'creative'
  duration: number // in minutes
  description?: string
  instructions?: string[]
  benefits?: string[]
  difficulty: 'easy' | 'medium' | 'hard'
  equipment?: string[]
}

export interface BreakSession {
  activityId: ID
  startTime: Timestamp
  endTime?: Timestamp
  completed: boolean
  rating?: number // 1-5 how helpful it was
  notes?: string
}