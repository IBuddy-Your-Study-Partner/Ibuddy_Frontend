import { Home, Brain, Clock, Target, Lightbulb } from 'lucide-react'
import Card from '../UI/Card'
import Button from '../UI/Button'

interface RecommendationsProps {
  onReturnToDashboard: () => void
  sessionData?: {
    focusScore: number
    tasksCompleted: number
    peakPerformanceTime?: string
  }
}

interface RecommendationItemProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  type: 'tip' | 'insight' | 'suggestion'
}

function RecommendationItem({ icon: Icon, title, description, type }: RecommendationItemProps): JSX.Element {
  const typeColors = {
    tip: 'bg-blue-50 text-blue-700 border-blue-200',
    insight: 'bg-purple-50 text-purple-700 border-purple-200',
    suggestion: 'bg-green-50 text-green-700 border-green-200'
  }

  return (
    <div className={`p-4 rounded-lg border ${typeColors[type]}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <Icon className="w-5 h-5 mt-0.5" />
        </div>
        <div>
          <h4 className="font-medium mb-1">{title}</h4>
          <p className="text-sm opacity-90">{description}</p>
        </div>
      </div>
    </div>
  )
}

export default function Recommendations({ onReturnToDashboard, sessionData }: RecommendationsProps): JSX.Element {
  const generateRecommendations = () => {
    const recommendations = []

    // Focus score based recommendations
    if (sessionData?.focusScore && sessionData.focusScore >= 80) {
      recommendations.push({
        icon: Target,
        title: 'Excellent Focus!',
        description: 'Your focus was outstanding. Try maintaining this rhythm for tomorrow\'s session.',
        type: 'insight' as const
      })
    } else if (sessionData?.focusScore && sessionData.focusScore < 60) {
      recommendations.push({
        icon: Brain,
        title: 'Focus Enhancement',
        description: 'Consider shorter 25-minute blocks with 5-minute breaks to improve concentration.',
        type: 'suggestion' as const
      })
    }

    // Time-based recommendations
    recommendations.push({
      icon: Clock,
      title: 'Optimal Timing',
      description: 'You performed best during mid-session. Schedule challenging tasks for 30-45 minute marks.',
      type: 'insight' as const
    })

    // General tips
    recommendations.push({
      icon: Lightbulb,
      title: 'Tomorrow\'s Strategy',
      description: 'Start with Chemistry tasks when your focus is highest, then move to lighter subjects.',
      type: 'tip' as const
    })

    return recommendations
  }

  const recommendations = generateRecommendations()

  return (
    <div className="space-y-6">
      {/* Daily Inspiration */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg p-6 text-white">
        <h3 className="text-xl font-semibold mb-4">Daily Inspiration</h3>
        <blockquote className="text-lg italic mb-4">
          "Success is the sum of small efforts repeated day in and day out."
        </blockquote>
        <p className="text-purple-100 text-sm mb-4">- Robert Collier</p>
        <div className="bg-white bg-opacity-20 rounded-lg p-4">
          <h4 className="font-semibold mb-2">🎵 Recommended for you:</h4>
          <p className="text-sm opacity-90">Lo-fi Hip Hop Study Beats - Perfect for your next session</p>
        </div>
      </div>

      {/* AI Recommendations */}
      <Card>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Recommendations</h3>
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <RecommendationItem key={index} {...rec} />
          ))}
        </div>
        
        {/* Next session preview */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Next Session Preview</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Estimated duration: 50 minutes</li>
            <li>• 5 pending tasks ready</li>
            <li>• Best time to start: Tomorrow 2:00 PM</li>
          </ul>
        </div>

        <Button
          onClick={onReturnToDashboard}
          className="w-full mt-6"
          size="lg"
        >
          <Home className="w-5 h-5 mr-2" />
          Return to Dashboard
        </Button>
      </Card>
    </div>
  )
}