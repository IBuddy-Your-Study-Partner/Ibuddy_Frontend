import { ID, Timestamp } from './index'
import { SessionData } from './session'
import { Task } from './tasks'

// Analytics event tracking
export interface AnalyticsEvent {
  id: ID
  userId: ID
  sessionId?: ID
  
  // Event details
  name: string
  category: AnalyticsCategory
  properties: Record<string, any>
  timestamp: Timestamp
  
  // Context
  page?: string
  component?: string
  userAgent?: string
  device?: DeviceInfo
  location?: LocationInfo
  
  // Performance
  duration?: number // milliseconds
  value?: number // numeric value for the event
}

export type AnalyticsCategory = 
  | 'user_action'
  | 'session'
  | 'task'
  | 'achievement'
  | 'error'
  | 'performance'
  | 'engagement'
  | 'conversion'

export interface DeviceInfo {
  type: 'desktop' | 'tablet' | 'mobile'
  os: string
  browser: string
  screenSize: string
  viewport: string
  pixelRatio: number
}

export interface LocationInfo {
  country?: string
  region?: string
  city?: string
  timezone: string
  language: string
}

// Study analytics
export interface StudyAnalytics {
  userId: ID
  timeframe: {
    start: Timestamp
    end: Timestamp
    type: 'day' | 'week' | 'month' | 'quarter' | 'year' | 'custom'
  }
  
  // Time metrics
  totalStudyTime: number // minutes
  focusTime: number
  breakTime: number
  averageSessionLength: number
  longestSession: number
  shortestSession: number
  
  // Task metrics
  tasksCompleted: number
  tasksCreated: number
  taskCompletionRate: number
  averageTaskDuration: number
  overdueTasksCount: number
  
  // Subject distribution
  subjectBreakdown: Record<string, {
    timeSpent: number
    tasksCompleted: number
    focusScore: number
    difficulty: number
  }>
  
  // Performance trends
  focusScoreTrend: DataPoint[]
  productivityTrend: DataPoint[]
  stressLevelTrend: DataPoint[]
  moodTrend: DataPoint[]
  
  // Patterns
  mostProductiveHours: number[]
  mostProductiveDays: string[]
  peakPerformancePatterns: string[]
  
  // Achievements
  achievementsUnlocked: number
  coinsEarned: number
  levelUps: number
  streakData: {
    current: number
    longest: number
    total: number
  }
}

export interface DataPoint {
  timestamp: Timestamp
  value: number
  label?: string
  metadata?: Record<string, any>
}

// Performance analytics
export interface PerformanceMetrics {
  // App performance
  pageLoadTime: number
  timeToInteractive: number
  firstContentfulPaint: number
  largestContentfulPaint: number
  cumulativeLayoutShift: number
  
  // Arena performance
  arenaLoadTime: number
  timerAccuracy: number
  memoryUsage: number
  errorRate: number
  
  // User experience
  averageSessionLength: number
  bounceRate: number
  taskCompletionRate: number
  featureAdoptionRate: Record<string, number>
  
  // Technical metrics
  apiResponseTimes: Record<string, number>
  errorsByType: Record<string, number>
  browserCompatibility: Record<string, number>
  
  timestamp: Timestamp
}

// A/B testing types
export interface ABTest {
  id: ID
  name: string
  description: string
  hypothesis: string
  
  // Test configuration
  startDate: Timestamp
  endDate?: Timestamp
  status: 'draft' | 'running' | 'paused' | 'completed' | 'cancelled'
  
  // Variants
  variants: ABTestVariant[]
  trafficSplit: Record<string, number> // variant ID -> percentage
  
  // Targeting
  targetAudience: {
    userSegments?: string[]
    includeNewUsers?: boolean
    includeReturningUsers?: boolean
    geolocation?: string[]
    deviceTypes?: string[]
  }
  
  // Metrics
  primaryMetric: string
  secondaryMetrics: string[]
  minimumSampleSize: number
  significanceLevel: number
  
  // Results
  results?: ABTestResults
}

export interface ABTestVariant {
  id: ID
  name: string
  description: string
  isControl: boolean
  configuration: Record<string, any>
  userCount: number
  conversionRate: number
}

export interface ABTestResults {
  winner?: ID
  confidence: number
  pValue: number
  effect: number
  variantResults: Record<ID, {
    users: number
    conversions: number
    conversionRate: number
    averageValue: number
    standardError: number
  }>
  recommendations: string[]
  significantDifference: boolean
}

// User behavior analytics
export interface UserBehaviorAnalytics {
  userId: ID
  
  // Engagement patterns
  sessionFrequency: 'daily' | 'weekly' | 'monthly' | 'irregular'
  averageSessionDuration: number
  featureUsage: Record<string, {
    frequency: number
    lastUsed: Timestamp
    totalTime: number
  }>
  
  // Study patterns
  preferredStudyTimes: string[] // hour ranges
  studySessionTypes: Record<string, number>
  subjectPreferences: Record<string, number>
  taskCreationPatterns: Record<string, number>
  
  // Wellness patterns
  stressLevelPatterns: Record<string, number>
  breakFrequency: number
  breathingExerciseUsage: number
  wellnessFeatureAdoption: Record<string, boolean>
  
  // Gamification engagement
  achievementMotivation: number // 0-1 scale
  coinSpendingPatterns: Record<string, number>
  competitiveEngagement: number
  streakMaintenance: number
  
  // Risk factors
  burnoutRisk: number // 0-1 scale
  churnRisk: number
  disengagementSignals: string[]
  interventionRecommendations: string[]
}

// Cohort analysis
export interface CohortAnalysis {
  cohortDefinition: {
    type: 'registration_date' | 'first_session' | 'feature_adoption'
    startDate: Timestamp
    endDate: Timestamp
    cohortSize: string // 'daily', 'weekly', 'monthly'
  }
  
  cohorts: CohortData[]
  retentionMatrix: number[][] // retention rates by period
  averageRetention: number[]
  insights: CohortInsight[]
}

export interface CohortData {
  cohortId: string
  cohortDate: Timestamp
  initialSize: number
  retentionByPeriod: number[]
  averageLifetimeValue: number
  characteristics: Record<string, any>
}

export interface CohortInsight {
  type: 'retention_drop' | 'high_performance' | 'unusual_pattern'
  cohortId: string
  description: string
  impact: 'low' | 'medium' | 'high'
  recommendation: string
}

// Funnel analysis
export interface FunnelAnalysis {
  name: string
  steps: FunnelStep[]
  conversionRates: number[]
  dropOffPoints: Array<{
    stepIndex: number
    dropOffRate: number
    potentialReasons: string[]
  }>
  totalConversionRate: number
  averageTimeToComplete: number
  segmentBreakdown: Record<string, number[]>
}

export interface FunnelStep {
  name: string
  description: string
  userCount: number
  conversionRate: number
  averageTimeToNext: number
}

// Real-time analytics
export interface RealTimeMetrics {
  timestamp: Timestamp
  
  // Active users
  activeUsers: number
  activeSessions: number
  newUsers: number
  
  // Current activity
  tasksBeingWorked: number
  arenaSessionsActive: number
  averageFocusScore: number
  
  // Performance
  averageLoadTime: number
  errorRate: number
  apiResponseTime: number
  
  // Geographic distribution
  usersByCountry: Record<string, number>
  usersByTimezone: Record<string, number>
}