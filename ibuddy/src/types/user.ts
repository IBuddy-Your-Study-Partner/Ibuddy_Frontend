import { ID, Timestamp, IBSubject } from './index'
import { SessionData } from './session'

// User profile and account
export interface UserProfile {
  id: ID
  email: string
  username?: string
  firstName?: string
  lastName?: string
  displayName: string
  avatar?: string
  
  // IB-specific information
  ibProgram: 'DP' | 'MYP' | 'PYP' // Diploma Programme, Middle Years, Primary Years
  ibYear: number // 1 or 2 for DP
  ibSubjects: IBSubject[]
  ibSchool?: string
  ibCoordinator?: string
  
  // Academic info
  graduationYear: number
  currentGrade?: string
  gpa?: number
  targetUniversities?: string[]
  intendedMajor?: string
  
  // Contact and location
  timeZone: string
  country: string
  language: string
  
  // Account metadata
  createdAt: Timestamp
  updatedAt: Timestamp
  lastLoginAt?: Timestamp
  emailVerified: boolean
  accountStatus: 'active' | 'suspended' | 'pending'
}

// User statistics and progress
export interface UserStats {
  // Basic metrics
  tasksCompleted: number
  totalTasks: number
  focusTime: number // total minutes focused
  totalSessions: number
  
  // Wellness metrics
  stressLevel: number // current stress level 1-5
  averageStressLevel: number
  moodTrend: number // -1 to 1, negative = declining, positive = improving
  wellnessScore: number // 0-100 composite score
  
  // Performance metrics
  streak: number // current daily streak
  longestStreak: number
  averageFocusScore: number
  productivityTrend: number // -1 to 1
  
  // Gamification
  coins: number
  xp: number
  level: number
  totalXpEarned: number
  
  // Time tracking
  dailyFocusTime: number // today's focus time
  weeklyFocusTime: number
  monthlyFocusTime: number
  totalStudyDays: number
  
  // Subject-specific stats
  subjectStats: Record<string, SubjectStats>
  
  // Weekly/monthly trends
  weeklyStats: WeeklyStats
  monthlyStats: MonthlyStats
  
  // Last updated
  lastUpdated: Timestamp
}

export interface SubjectStats {
  subjectCode: string
  tasksCompleted: number
  focusTime: number
  averageGrade?: number
  difficulty: number // 1-5 scale
  confidence: number // 1-5 scale
  timeSpentRatio: number // percentage of total study time
  improvementRate: number // percentage
  lastStudied?: Timestamp
}

export interface WeeklyStats {
  weekOf: Timestamp
  totalFocusTime: number
  tasksCompleted: number
  sessionsCompleted: number
  averageFocusScore: number
  stressLevelChange: number
  daysActive: number
  goals: {
    focusTimeGoal: number
    tasksGoal: number
    achieved: boolean
  }
}

export interface MonthlyStats {
  monthOf: Timestamp
  totalFocusTime: number
  tasksCompleted: number
  sessionsCompleted: number
  averageFocusScore: number
  stressLevelChange: number
  daysActive: number
  subjectBalance: Record<string, number> // percentage time per subject
  productivityGrowth: number // percentage improvement
}

// User preferences and settings
export interface UserPreferences {
  // Study preferences
  studyGoals: {
    dailyFocusTime: number // target minutes per day
    weeklyTaskTarget: number
    preferredStudyTimes: string[] // ["09:00", "14:00", "19:00"]
    preferredSessionLength: number // in minutes
    breakFrequency: number // tasks between breaks
  }
  
  // UI preferences
  theme: 'light' | 'dark' | 'auto'
  language: string
  timeFormat: '12h' | '24h'
  dateFormat: 'US' | 'EU' | 'ISO'
  
  // Notification preferences
  notifications: {
    enabled: boolean
    email: boolean
    push: boolean
    sessionReminders: boolean
    deadlineAlerts: boolean
    achievementNotifications: boolean
    dailySummary: boolean
    weeklyReport: boolean
  }
  
  // Audio preferences
  sounds: {
    enabled: boolean
    volume: number // 0-100
    sessionStart: boolean
    sessionEnd: boolean
    taskComplete: boolean
    timerTick: boolean
    backgroundMusic: boolean
    ambientSounds: 'none' | 'nature' | 'white_noise' | 'lofi' | 'classical'
  }
  
  // Privacy preferences
  privacy: {
    profilePublic: boolean
    statsPublic: boolean
    allowDataCollection: boolean
    shareAchievements: boolean
  }
  
  // Accessibility
  accessibility: {
    highContrast: boolean
    largeText: boolean
    reducedMotion: boolean
    screenReader: boolean
    colorBlindFriendly: boolean
  }
}

// Achievement system
export interface Achievement {
  id: ID
  category: AchievementCategory
  name: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  
  // Requirements
  requirements: AchievementRequirement[]
  prerequisiteIds?: ID[]
  
  // Rewards
  xpReward: number
  coinReward: number
  badgeUrl?: string
  
  // Metadata
  createdAt: Timestamp
  isActive: boolean
  isSecret: boolean // hidden until unlocked
}

export type AchievementCategory = 
  | 'focus'
  | 'productivity'
  | 'consistency'
  | 'wellness'
  | 'academic'
  | 'social'
  | 'milestone'
  | 'special'

export interface AchievementRequirement {
  type: 'total_focus_time' | 'daily_streak' | 'tasks_completed' | 'sessions_completed' | 'stress_reduction'
  value: number
  timeframe?: 'day' | 'week' | 'month' | 'all_time'
  subjectCode?: string
}

export interface UserAchievement {
  achievementId: ID
  userId: ID
  unlockedAt: Timestamp
  progress: number // 0-100 for partially completed achievements
  isCompleted: boolean
  notificationSent: boolean
}

// Study goals and planning
export interface StudyGoal {
  id: ID
  userId: ID
  type: 'daily' | 'weekly' | 'monthly' | 'custom'
  category: 'focus_time' | 'tasks' | 'sessions' | 'subject_balance' | 'wellness'
  
  title: string
  description?: string
  targetValue: number
  currentValue: number
  unit: string // "minutes", "tasks", "sessions", etc.
  
  startDate: Timestamp
  endDate: Timestamp
  isActive: boolean
  isCompleted: boolean
  completedAt?: Timestamp
  
  // Tracking
  dailyProgress: Record<string, number> // ISO date -> progress value
  milestones: GoalMilestone[]
  
  // Metadata
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface GoalMilestone {
  percentage: number // 25, 50, 75, 100
  achievedAt?: Timestamp
  reward?: {
    type: 'xp' | 'coins' | 'achievement'
    value: number | ID
  }
}

// User activity and history
export interface UserActivity {
  id: ID
  userId: ID
  type: ActivityType
  description: string
  data: Record<string, any>
  timestamp: Timestamp
  relatedEntityId?: ID
  relatedEntityType?: 'task' | 'session' | 'achievement' | 'goal'
}

export type ActivityType = 
  | 'task_created'
  | 'task_completed'
  | 'session_started'
  | 'session_completed'
  | 'achievement_unlocked'
  | 'goal_created'
  | 'goal_completed'
  | 'streak_milestone'
  | 'level_up'
  | 'subject_added'
  | 'preferences_updated'