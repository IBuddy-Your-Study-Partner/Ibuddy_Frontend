import { Target, Clock, Zap, Users } from 'lucide-react'
import { useTasks, useArena } from '../../context/AppContext'

interface ArenaButtonProps {
  onEnterArena: () => void
}

export default function ArenaButton({ onEnterArena }: ArenaButtonProps): JSX.Element {
  const { state: taskState } = useTasks()
  const { state: arenaState } = useArena()

  // Calculate session preview data
  const incompleteTasks = taskState.tasks.filter(task => !task.completed)
  const estimatedTime = incompleteTasks
    .slice(0, 6) // Limit to 6 tasks for Arena
    .reduce((total, task) => total + (task.estimatedDuration || 25), 0)
  
  const highPriorityTasks = incompleteTasks.filter(task => task.priority === 'high').length
  const canStartSession = incompleteTasks.length > 0

  return (
    <div className="bg-gradient-to-r from-teal-400 to-blue-500 rounded-xl shadow-lg p-8 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full transform translate-x-8 -translate-y-8" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full transform -translate-x-4 translate-y-4" />
      
      <div className="text-center relative z-10">
        <Target className="w-12 h-12 mx-auto mb-4 opacity-90" />
        <h2 className="text-2xl font-bold mb-2">Ready to Focus?</h2>
        <p className="text-blue-100 mb-6">
          {canStartSession 
            ? "Start your personalized study session" 
            : "Add some tasks to begin your Arena session"
          }
        </p>
        
        {/* Session Preview */}
        {canStartSession && (
          <div className="flex items-center justify-center space-x-6 mb-6 text-blue-100">
            <div className="flex items-center space-x-1 text-sm">
              <Clock className="w-4 h-4" />
              <span>~{estimatedTime}min</span>
            </div>
            <div className="flex items-center space-x-1 text-sm">
              <Target className="w-4 h-4" />
              <span>{Math.min(incompleteTasks.length, 6)} tasks</span>
            </div>
            {highPriorityTasks > 0 && (
              <div className="flex items-center space-x-1 text-sm">
                <Zap className="w-4 h-4 text-yellow-200" />
                <span>{highPriorityTasks} urgent</span>
              </div>
            )}
          </div>
        )}

        {/* Recent session info */}
        {arenaState.sessionHistory.length > 0 && (
          <div className="mb-6 text-sm text-blue-200">
            Last session: {arenaState.sessionHistory[0].tasksCompleted} tasks completed
          </div>
        )}
        
        <button
          onClick={onEnterArena}
          disabled={!canStartSession}
          className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg ${
            canStartSession
              ? 'bg-white text-blue-600 hover:bg-blue-50 transform hover:scale-105'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {canStartSession ? 'Enter Arena Mode' : 'Add Tasks First'}
        </button>

        {/* Arena features preview */}
        <div className="mt-6 grid grid-cols-3 gap-3 text-xs">
          <div className="bg-white bg-opacity-10 rounded-lg p-2">
            <Target className="w-4 h-4 mx-auto mb-1" />
            <div>Focus Timer</div>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-2">
            <Zap className="w-4 h-4 mx-auto mb-1" />
            <div>Progress Tracking</div>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-2">
            <Users className="w-4 h-4 mx-auto mb-1" />
            <div>Wellness Check</div>
          </div>
        </div>
      </div>
    </div>
  )
}