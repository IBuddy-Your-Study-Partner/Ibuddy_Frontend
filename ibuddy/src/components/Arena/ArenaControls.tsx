import { Play, Pause, SkipForward, Coffee } from 'lucide-react'

interface ArenaControlsProps {
  isActive: boolean
  onToggleTimer: () => void
  onSkipTask: () => void
  onTakeBreak?: () => void
}

export default function ArenaControls({ 
  isActive, 
  onToggleTimer, 
  onSkipTask,
  onTakeBreak 
}: ArenaControlsProps): JSX.Element {
  return (
    <div className="flex justify-center space-x-4 py-8">
      <button
        onClick={onToggleTimer}
        className="flex items-center space-x-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-semibold transition-all transform hover:scale-105"
      >
        {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        <span>{isActive ? 'Pause' : 'Start'}</span>
      </button>
      
      <button
        onClick={onSkipTask}
        className="flex items-center space-x-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-xl font-semibold transition-all transform hover:scale-105"
      >
        <SkipForward className="w-5 h-5" />
        <span>Skip</span>
      </button>

      {onTakeBreak && (
        <button
          onClick={onTakeBreak}
          className="flex items-center space-x-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 rounded-xl font-semibold transition-all transform hover:scale-105"
        >
          <Coffee className="w-5 h-5" />
          <span>Break</span>
        </button>
      )}
    </div>
  )
}