import { Target, Clock, Zap, TrendingUp } from 'lucide-react'
import Card from '../UI/Card'
import type { SessionData } from '../../types'

interface SessionSummaryProps {
  session: SessionData
  detailed?: boolean
}

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>
  value: string | number
  label: string
  color: string
  trend?: number
}

function StatCard({ icon: Icon, value, label, color, trend }: StatCardProps): JSX.Element {
  return (
    <div className={`p-4 rounded-lg ${color}`}>
      <div className="flex items-center justify-between mb-2">
        <Icon className="w-6 h-6" />
        {trend && (
          <div className={`flex items-center text-xs ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className={`w-3 h-3 ${trend < 0 ? 'rotate-180' : ''}`} />
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm opacity-75">{label}</div>
    </div>
  )
}

export default function SessionSummary({ session, detailed = false }: SessionSummaryProps): JSX.Element {
  if (!detailed) {
    // Compact version for header
    return (
      <div className="flex items-center justify-center space-x-8 text-lg">
        <div className="flex items-center space-x-2">
          <Target className="w-5 h-5 text-green-500" />
          <span>{session.tasksCompleted} tasks completed</span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-blue-500" />
          <span>{session.totalTime} minutes focused</span>
        </div>
        <div className="flex items-center space-x-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          <span>Focus score: {session.focusScore}%</span>
        </div>
      </div>
    )
  }

  // Detailed version for main content
  return (
    <Card>
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Session Breakdown</h3>
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          icon={Target}
          value={session.tasksCompleted}
          label="Tasks Completed"
          color="bg-green-50 text-green-600"
          trend={12}
        />
        <StatCard
          icon={Clock}
          value={`${session.totalTime}min`}
          label="Focus Time"
          color="bg-blue-50 text-blue-600"
          trend={8}
        />
        <StatCard
          icon={Zap}
          value={`${session.focusScore}%`}
          label="Focus Score"
          color="bg-yellow-50 text-yellow-600"
          trend={5}
        />
        <StatCard
          icon={TrendingUp}
          value={session.stressReduction ? `-${session.stressReduction}` : '+1'}
          label="Stress Change"
          color="bg-purple-50 text-purple-600"
          trend={session.stressReduction ? session.stressReduction * 10 : -10}
        />
      </div>
      
      {/* Additional insights */}
      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Session Duration</span>
          <span className="text-sm text-gray-600">{session.totalTime} minutes</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Average per Task</span>
          <span className="text-sm text-gray-600">{Math.round(session.totalTime / session.tasksCompleted)} minutes</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Productivity Rate</span>
          <span className="text-sm text-gray-600">{session.focusScore >= 80 ? 'Excellent' : session.focusScore >= 60 ? 'Good' : 'Needs Improvement'}</span>
        </div>
      </div>
    </Card>
  )
}