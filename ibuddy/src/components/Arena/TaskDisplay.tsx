import type { ArenaTask } from '../../types'

interface TaskDisplayProps {
    task: ArenaTask
    currentTask: number
    totalTasks: number
}

export default function TaskDisplay({ task, currentTask, totalTasks }: TaskDisplayProps): JSX.Element {
    const subjectColors: Record<string, string> = {
        'Mathematics': 'bg-blue-500',
        'History': 'bg-yellow-500',
        'Chemistry': 'bg-purple-500',
        'TOK': 'bg-green-500',
        'French': 'bg-indigo-500',
        'Economics': 'bg-pink-500'
    }

    return (
        <div className="text-center py-8">
            <h2 className="text-4xl font-bold mb-4">{task.title}</h2>
            <div className="flex items-center justify-center space-x-6 text-lg text-blue-200">
                <span className={`px-3 py-1 rounded-full bg-opacity-30 ${subjectColors[task.subject] || 'bg-gray-500'}`}>
                    {task.subject}
                </span>
                <span>Task {currentTask} of {totalTasks}</span>
                <span>{task.duration} min</span>
            </div>
            
            {/* Progress indicator */}
            <div className="mt-6 max-w-md mx-auto">
                    <div className="flex justify-between text-sm text-gray-300 mb-2">
                    <span>Progress</span>
                    <span>{Math.round((currentTask / totalTasks) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                        className="bg-gradient-to-r from-teal-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(currentTask / totalTasks) * 100}%` }}
                    />
                </div>
            </div>
        </div>
    )
}   