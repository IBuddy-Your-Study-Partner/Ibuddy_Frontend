import { useCallback } from 'react'
import { useArenaTimer } from '../context/AppContext'

interface UseTimerReturn {
  timeRemaining: number
  isActive: boolean
  setIsActive: (active: boolean) => void
  formatTime: string
  progress: number
}

export function useTimer(): UseTimerReturn {
  const { timeRemaining, isActive, setIsActive, updateTimer } = useArenaTimer()

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }, [])

  const progress = useCallback((): number => {
    const totalTime = 25 * 60 // 25 minutes default
    return ((totalTime - timeRemaining) / totalTime) * 100
  }, [timeRemaining])

  return {
    timeRemaining,
    isActive,
    setIsActive,
    formatTime: formatTime(timeRemaining),
    progress: progress()
  }
}