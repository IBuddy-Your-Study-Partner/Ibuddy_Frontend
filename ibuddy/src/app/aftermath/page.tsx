'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PerformanceChart from '../../components/Aftermath/PerformanceChart'
import SessionSummary from '../../components/Aftermath/SessionSummary'
import Achievements from '../../components/Aftermath/Achievements'
import Recommendations from '../../components/Aftermath/Recommendations'
import Header from '../../components/UI/Header'
import { useUser, useArena, useToast } from '../../context/AppContext'
import type { SessionData } from '../../types'

export default function Aftermath() {
  const router = useRouter()
  const [showCelebration, setShowCelebration] = useState(true)
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  
  const { state: userState, addCoins } = useUser()
  const { state: arenaState } = useArena()
  const toast = useToast()

  useEffect(() => {
    // Get session data from localStorage or context
    const lastSession = localStorage.getItem('lastSession')
    if (lastSession) {
      try {
        const parsedSession = JSON.parse(lastSession)
        setSessionData(parsedSession)
        
        // Award coins based on performance
        const coinsEarned = Math.floor(parsedSession.focusScore / 4) + parsedSession.tasksCompleted * 5
        addCoins(coinsEarned)
        
      } catch (error) {
        console.error('Failed to parse session data:', error)
        toast.error('Failed to load session data')
      }
    } else if (arenaState.currentSession) {
      setSessionData(arenaState.currentSession)
    }
    
    // Hide celebration after 3 seconds
    const timer = setTimeout(() => setShowCelebration(false), 3000)
    return () => clearTimeout(timer)
  }, [arenaState.currentSession, addCoins, toast])

  const handleReturnToDashboard = (): void => {
    // Clean up session data
    localStorage.removeItem('lastSession')
    router.push('/')
  }

  const defaultSessionData: SessionData = {
    type: 'focus',
    status: 'completed',
    tasksCompleted: 4,
    totalTasks: 6,
    totalTime: 85,
    focusTime: 75,
    breakTime: 10,
    focusScore: 85,
    stressReduction: 2,
    endTime: new Date()
  }

  const session = sessionData || defaultSessionData
  const coinsEarned = Math.floor(session.focusScore / 4) + session.tasksCompleted * 5

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Celebration Animation */}
      {showCelebration && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="text-center text-white animate-bounce">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-4xl font-bold mb-2">Amazing Session!</h2>
            <p className="text-xl">You completed your focus session</p>
            <div className="mt-4 text-lg">
              <span className="inline-block bg-yellow-500 text-white px-3 py-1 rounded-full">
                +{coinsEarned} coins earned!
              </span>
            </div>
          </div>
        </div>
      )}

      <Header />

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Session Complete!</h1>
            <SessionSummary session={session} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <PerformanceChart />
            <SessionSummary session={session} detailed />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <Achievements 
              session={session} 
              userStats={{
                streak: userState.stats.streak,
                coins: userState.stats.coins
              }}
            />
            <Recommendations 
              onReturnToDashboard={handleReturnToDashboard}
              sessionData={{
                focusScore: session.focusScore,
                tasksCompleted: session.tasksCompleted
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}