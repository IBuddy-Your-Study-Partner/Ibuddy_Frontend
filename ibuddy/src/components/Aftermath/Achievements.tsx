import { Award, Zap, Target, Clock, Flame, Trophy } from 'lucide-react'
import Card from '../UI/Card'
import type { SessionData } from '../../types'

interface AchievementsProps {
  session: SessionData
  userStats?: {
    streak: number
    coins: number
    level?: number
  }
}

interface AchievementBadgeProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  unlocked: boolean
  rarity?: 'common' | 'rare' | 'epic' | 'legendary'
}

function AchievementBadge({ icon: Icon, title, description, unlocked, rarity = 'common' }: AchievementBadgeProps): JSX.Element {
  const rarityColors = {
    common: 'bg-gray-100 text-gray-600 border-gray-300',
    rare: 'bg-blue-100 text-blue-600 border-blue-300',
    epic: 'bg-purple-100 text-purple-600 border-purple-300',
    legendary: 'bg-yellow-100 text-yellow-600 border-yellow-300'
  }

  return (
    <div className={`flex items-center space-x-3 p-3 rounded-lg border transition-all ${
      unlocked 
        ? rarityColors[rarity] + ' transform scale-105' 
        : 'bg-gray-50 text-gray-400 border-gray-200'
    }`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
        unlocked ? 'bg-current bg-opacity-20' : 'bg-gray-200'
      }`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1">
        <div className={`font-medium ${unlocked ? '' : 'text-gray-500'}`}>
          {title}
          {unlocked && rarity !== 'common' && (
            <span className="ml-2 text-xs px-1 py-0.5 rounded uppercase font-bold">
              {rarity}
            </span>
          )}
        </div>
        <div className="text-sm opacity-75">{description}</div>
      </div>
    </div>
  )
}

export default function Achievements({ session, userStats = { streak: 5, coins: 125 } }: AchievementsProps): JSX.Element {
  const achievements = [
    {
      icon: Target,
      title: 'Focus Master',
      description: 'Complete 4+ tasks in one session',
      unlocked: session.tasksCompleted >= 4,
      rarity: 'rare' as const
    },
    {
      icon: Clock,
      title: 'Time Warrior',
      description: '60+ minutes of focused work',
      unlocked: session.totalTime >= 60,
      rarity: 'common' as const
    },
    {
      icon: Zap,
      title: 'Peak Performer',
      description: 'Achieve 80%+ focus score',
      unlocked: session.focusScore >= 80,
      rarity: 'epic' as const
    },
    {
      icon: Flame,
      title: 'Streak Legend',
      description: '5+ day study streak',
      unlocked: userStats.streak >= 5,
      rarity: 'legendary' as const
    }
  ]

  const coinsEarned = Math.floor(session.focusScore / 4) + session.tasksCompleted * 5
  const newUnlocks = achievements.filter(a => a.unlocked).length

  return (
    <Card>
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Achievements</h3>
      
      {/* Rewards earned this session */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl text-white">
          <Award className="w-8 h-8 mx-auto mb-2" />
          <div className="text-2xl font-bold">+{coinsEarned}</div>
          <div className="text-sm opacity-90">Arena Coins</div>
        </div>
        <div className="text-center p-4 bg-gradient-to-r from-pink-400 to-red-500 rounded-xl text-white">
          <Flame className="w-8 h-8 mx-auto mb-2" />
          <div className="text-2xl font-bold">{userStats.streak}</div>
          <div className="text-sm opacity-90">Day Streak</div>
        </div>
      </div>

      {/* Achievement badges */}
      <div className="space-y-3">
        {achievements.map((achievement, index) => (
          <AchievementBadge key={index} {...achievement} />
        ))}
      </div>

      {/* New unlocks celebration */}
      {newUnlocks > 0 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-purple-600" />
            <span className="font-medium text-purple-800">
              🎉 {newUnlocks} new achievement{newUnlocks > 1 ? 's' : ''} unlocked!
            </span>
          </div>
        </div>
      )}
    </Card>
  )
}