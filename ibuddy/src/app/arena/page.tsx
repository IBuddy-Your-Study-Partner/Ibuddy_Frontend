'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ArenaTimer from '../../components/Arena/ArenaTimer'
import TaskProgress from '../../components/Arena/TaskProgress'
import TaskDisplay from '../../components/Arena/TaskDisplay'
import ArenaControls from '../../components/Arena/ArenaControls'
import BreathingRing from '../../components/Arena/BreathingRing'
import { useArena, useArenaTimer, useTasks, useUser, useToast } from '../../context/AppContext'
import type { ArenaTask } from '../../types'

export default function Arena() {
  const router = useRouter()
  const { 
    state: arenaState, 
    startSession, 
    endSession, 
    completeTask, 
    skipTask, 
    nextTask,
    currentTask,
    sessionProgress
  } = useArena()
  
  const { timeRemaining, isActive, setIsActive } = useArenaTimer()
  const { state: taskState } = useTasks()
  const { addFocusTime, addCompletedTasks } = useUser()
  const toast = useToast()

  // Initialize session when component mounts
  useEffect(() => {
    if (!arenaState.isSessionActive) {
      // Convert tasks to arena tasks
      const incompleteTasks = taskState.tasks
        .filter(task => !task.completed)
        .slice(0, 6) // Limit to 6 tasks for demo
        .map((task, index): ArenaTask => ({
          id: task.id,
          title: task.title,
          subject: task.subject,
          duration: task.estimatedDuration || 25,
          type: 'focus',
          priority: task.priority,
          completed: false
        }))

      if (incompleteTasks.length > 0) {
        startSession(incompleteTasks)
        toast.success('Arena session started!', `Time to focus on ${incompleteTasks.length} tasks`)
      } else {
        toast.error('No tasks available', 'Please add tasks before starting Arena Mode')
        router.push('/')
      }
    }
  }, [arenaState.isSessionActive, startSession, taskState.tasks, router, toast])

  // Handle timer completion
  useEffect(() => {
    if (timeRemaining === 0 && isActive) {
      handleTaskComplete()
    }
  }, [timeRemaining, isActive])

  const handleTaskComplete = (): void => {
    if (!currentTask) return

    const taskIndex = arenaState.currentTaskIndex
    completeTask(taskIndex)
    
    // Add focus time to user stats
    addFocusTime(currentTask.duration)
    addCompletedTasks(1)
    
    toast.success('Task completed!', `Great job on "${currentTask.title}"`)

    // Check if session is complete
    if (taskIndex >= arenaState.tasks.length - 1) {
      handleSessionComplete()
    } else {
      nextTask()
    }
  }

  const handleSkipTask = (): void => {
    if (!currentTask) return

    const taskIndex = arenaState.currentTaskIndex
    skipTask(taskIndex)
    
    toast.info('Task skipped', 'Moving to the next task')

    if (taskIndex >= arenaState.tasks.length - 1) {
      handleSessionComplete()
    } else {
      nextTask()
    }
  }

  const handleSessionComplete = (): void => {
    const sessionData = {
      tasksCompleted: arenaState.completedTasks.length,
      totalTasks: arenaState.tasks.length,
      totalTime: arenaState.tasks.reduce((acc, task) => acc + task.duration, 0),
      focusTime: arenaState.completedTasks.length * 25, // Simplified calculation
      focusScore: Math.round((arenaState.completedTasks.length / arenaState.tasks.length) * 100),
      type: 'focus' as const,
      status: 'completed' as const,
      endTime: new Date()
    }

    endSession(sessionData)
    
    // Store session data for aftermath screen
    localStorage.setItem('lastSession', JSON.stringify(sessionData))
    
    toast.success('Session complete!', 'Great work! Check out your results.')
    router.push('/aftermath')
  }

  const handleExit = (): void => {
    if (arenaState.isSessionActive) {
      const confirmed = window.confirm('Are you sure you want to exit? Your progress will be saved.')
      if (confirmed) {
        handleSessionComplete()
      }
    } else {
      router.push('/')
    }
  }

  // Show loading while session is being initialized
  if (!arenaState.isSessionActive || !currentTask) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold">Preparing your Arena session...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-6 bg-black bg-opacity-20 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-lg font-medium">Arena Mode</span>
          <span className="text-sm text-gray-300">
            Session Progress: {Math.round(sessionProgress)}%
          </span>
        </div>
        
        <ArenaTimer timeRemaining={timeRemaining} />

        <button
          onClick={handleExit}
          className="w-10 h-10 rounded-full bg-red-500 bg-opacity-20 hover:bg-opacity-40 flex items-center justify-center transition-all text-2xl"
        >
          ×
        </button>
      </div>

      <TaskProgress 
        tasks={arenaState.tasks} 
        currentTask={arenaState.currentTaskIndex + 1} 
        completedTasks={arenaState.completedTasks} 
      />

      <TaskDisplay 
        task={currentTask} 
        currentTask={arenaState.currentTaskIndex + 1} 
        totalTasks={arenaState.tasks.length} 
      />

      <ArenaControls 
        isActive={isActive}
        onToggleTimer={() => setIsActive(!isActive)}
        onSkipTask={handleSkipTask}
        onCompleteTask={handleTaskComplete}
      />

      <BreathingRing 
        showBreathing={arenaState.showBreathingExercise}
        setShowBreathing={(show) => {
          // This would be handled by the context
          // For now, we'll use a simplified approach
        }}
        breathingAnimation={arenaState.breathingState?.currentPhase || 'inhale'}
      />

      {/* Keyboard shortcuts help */}
      <div className="fixed bottom-4 left-4 text-xs text-gray-400 space-y-1">
        <div>Press <kbd className="px-1 py-0.5 bg-gray-700 rounded">Space</kbd> to play/pause</div>
        <div>Press <kbd className="px-1 py-0.5 bg-gray-700 rounded">B</kbd> for breathing exercise</div>
        <div>Press <kbd className="px-1 py-0.5 bg-gray-700 rounded">Esc</kbd> to exit</div>
      </div>
    </div>
  )
}