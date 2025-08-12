'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import CalendarWidget from '../components/Dashboard/CalendarWidget'
import TaskInput from '../components/Dashboard/TaskInput'
import TaskList from '../components/Dashboard/TaskList'
import SubjectProgress from '../components/Dashboard/SubjectProgress'
import WellnessCheck from '../components/Dashboard/WellnessCheck'
import ArenaButton from '../components/Dashboard/ArenaButton'
import Header from '../components/UI/Header'
import { useTasks, useUser, useToast } from '../context/AppContext'
import type { Subject } from '../types'

export default function Dashboard() {
  const router = useRouter()
  const { state: taskState, loadTasks } = useTasks()
  const { state: userState } = useUser()
  const toast = useToast()

  // Load tasks on component mount
  useEffect(() => {
    loadTasks().catch(() => {
      toast.error('Failed to load tasks', 'Please refresh the page')
    })
  }, [loadTasks, toast])

  const subjects: Subject[] = [
    { name: 'Mathematics', progress: 75, color: 'text-blue-500' },
    { name: 'English', progress: 60, color: 'text-green-500' },
    { name: 'History', progress: 80, color: 'text-yellow-500' },
    { name: 'Chemistry', progress: 45, color: 'text-purple-500' },
    { name: 'Economics', progress: 70, color: 'text-pink-500' },
    { name: 'French', progress: 55, color: 'text-indigo-500' }
  ]

  const handleEnterArena = (): void => {
    // Check if there are tasks to work on
    const incompleteTasks = taskState.tasks.filter(task => !task.completed)
    
    if (incompleteTasks.length === 0) {
      toast.warning('No tasks available', 'Add some tasks before starting Arena Mode')
      return
    }
    
    router.push('/arena')
  }

  if (taskState.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {userState.profile?.displayName || 'Student'}! 👋
          </h1>
          <p className="text-gray-600">
            Ready to tackle your IB studies? You have {taskState.filteredTasks.filter(t => !t.completed).length} pending tasks.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel */}
          <div className="space-y-6">
            <CalendarWidget />
            <TaskInput />
            <TaskList />
          </div>

          {/* Right Panel */}
          <div className="space-y-6">
            <ArenaButton onEnterArena={handleEnterArena} />
            <SubjectProgress subjects={subjects} />
            <WellnessCheck />
          </div>
        </div>
      </div>
    </>
  )
}