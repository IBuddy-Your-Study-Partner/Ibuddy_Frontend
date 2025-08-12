import type { ArenaTask } from '../../types'

interface TaskProgressProps {
    tasks: ArenaTask[]
    currentTask: number
    completedTasks: number[]
}

interface ProgressCircleProps {
    task: ArenaTask
    index: number
    isActive: boolean
    isCompleted: boolean
}

function ProgressCircle({ task, index, isActive, isCompleted }: ProgressCircleProps): JSX.Element {
  return (
    <div className="flex flex-col items-center">
      <div className={`relative w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold transition-all ${
        isCompleted 
          ? 'bg-green-500 border-green-400 text-white' 
          : isActive
            ? 'bg-blue-500 border-blue-400 text-white scale-110'
            : 'border-gray-500 text-gray-400'
      }`}>
        {isCompleted ? '✓' : index + 1}
        {isActive && (
          <div className="absolute inset-0 rounded-full border-2 border-blue-300 animate-ping" />
        )}
      </div>
      
      {/* Task title on hover */}
      <div className="absolute top-16 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        {task.title}
      </div>
    </div>
  )
}

export default function TaskProgress({ tasks, currentTask, completedTasks }: TaskProgressProps): JSX.Element {
  return (
    <div className="flex justify-center py-8">
      <div className="flex items-center space-x-8">
        {tasks.map((task, index) => (
          <div key={task.id} className="group relative">
            <ProgressCircle
              task={task}
              index={index}
              isActive={index + 1 === currentTask}
              isCompleted={completedTasks.includes(index + 1)}
            />
            {index < tasks.length - 1 && (
              <div className={`absolute top-6 left-12 w-8 h-0.5 ${
                completedTasks.includes(index + 1) ? 'bg-green-400' : 'bg-gray-600'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}