'use client'

import { useState, useEffect } from 'react'
import { Heart, Brain, Zap, TrendingUp, TrendingDown } from 'lucide-react'
import Card from '../UI/Card'
import { useUser, useToast } from '../../context/AppContext'

export default function WellnessCheck(): JSX.Element {
  const { state: userState, updateStressLevel } = useUser()
  const toast = useToast()
  
  const [localStressLevel, setLocalStressLevel] = useState<number>(userState.stats.stressLevel)
  const [mood, setMood] = useState<number>(3)
  const [hasUpdatedToday, setHasUpdatedToday] = useState<boolean>(false)

  // Sync with context state
  useEffect(() => {
    setLocalStressLevel(userState.stats.stressLevel)
  }, [userState.stats.stressLevel])

  const stressLabels = ['Very Calm', 'Calm', 'Neutral', 'Stressed', 'Very Stressed']
  const moodEmojis = ['😔', '😐', '🙂', '😊', '😃']

  const getStressColor = (level: number): string => {
    if (level <= 2) return 'text-green-600'
    if (level <= 3) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getStressBackground = (level: number): string => {
    if (level <= 2) return 'bg-green-50'
    if (level <= 3) return 'bg-yellow-50'
    return 'bg-red-50'
  }

  const getTipForStress = (level: number): string => {
    if (level <= 2) return "Great! You're feeling calm. Perfect time for complex tasks."
    if (level <= 3) return "You're doing well. Consider a short break if needed."
    return "Take a 5-minute breathing exercise before starting your next study session."
  }

  const handleStressLevelChange = (newLevel: number): void => {
    setLocalStressLevel(newLevel)
    updateStressLevel(newLevel)
    
    if (!hasUpdatedToday) {
      setHasUpdatedToday(true)
      toast.info('Wellness check saved', 'Your stress level has been recorded')
    }
  }

  const handleMoodChange = (newMood: number): void => {
    setMood(newMood)
    // TODO: Implement mood tracking in context
    toast.success('Mood recorded', 'Thanks for sharing how you feel!')
  }

  // Calculate stress trend (simplified)
  const stressTrend = localStressLevel < 3 ? 'improving' : localStressLevel > 3 ? 'concerning' : 'stable'

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Wellness Check</h3>
      
      <div className="space-y-6">
        {/* Stress Level */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <Brain className="w-4 h-4" />
              <span>Stress Level: {stressLabels[localStressLevel - 1]}</span>
            </label>
            <div className="flex items-center space-x-1 text-xs">
              {stressTrend === 'improving' && <TrendingDown className="w-3 h-3 text-green-500" />}
              {stressTrend === 'concerning' && <TrendingUp className="w-3 h-3 text-red-500" />}
              <span className={getStressColor(localStressLevel)}>
                {stressTrend}
              </span>
            </div>
          </div>
          
          <input
            type="range"
            min="1"
            max="5"
            value={localStressLevel}
            onChange={(e) => handleStressLevelChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500"
            style={{
              background: `linear-gradient(to right, #10b981 0%, #f59e0b 50%, #ef4444 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Very Calm</span>
            <span>Very Stressed</span>
          </div>
        </div>

        {/* Mood */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
            <Heart className="w-4 h-4" />
            <span>How are you feeling?</span>
          </label>
          <div className="flex justify-between">
            {moodEmojis.map((emoji, index) => (
              <button
                key={index}
                onClick={() => handleMoodChange(index + 1)}
                className={`text-2xl p-2 rounded-lg transition-all hover:scale-110 ${
                  mood === index + 1 
                    ? 'bg-blue-100 scale-110 shadow-sm' 
                    : 'hover:bg-gray-100'
                }`}
                aria-label={`Mood level ${index + 1}`}
              >
                {emoji}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Poor</span>
            <span>Excellent</span>
          </div>
        </div>

        {/* Personalized Tip */}
        <div className={`p-4 rounded-lg ${getStressBackground(localStressLevel)}`}>
          <div className="flex items-start space-x-2">
            <Zap className={`w-4 h-4 mt-0.5 ${getStressColor(localStressLevel)}`} />
            <div>
              <p className={`text-sm ${getStressColor(localStressLevel)}`}>
                <strong>Wellness Tip:</strong> {getTipForStress(localStressLevel)}
              </p>
              
              {localStressLevel >= 4 && (
                <button className="mt-2 text-xs bg-white bg-opacity-50 px-2 py-1 rounded text-red-700 hover:bg-opacity-75 transition-colors">
                  Start breathing exercise →
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Weekly summary */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">This week's average:</span>
            <div className="flex items-center space-x-2">
              <span className={`font-medium ${getStressColor(2.8)}`}>
                2.8/5 stress
              </span>
              <TrendingDown className="w-3 h-3 text-green-500" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}