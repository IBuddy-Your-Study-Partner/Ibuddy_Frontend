interface ArenaTimerProps {
        timeRemaining: number
        isActive?: boolean
        onTimeUpdate?: (time: number) => void
}
  
export default function ArenaTimer({ 
    timeRemaining, 
    isActive = false,
    onTimeUpdate 
}: ArenaTimerProps): JSX.Element {
    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`                                                                          
    }   
  
    const progress = ((25 * 60 - timeRemaining) / (25 * 60)) * 100
  
    return (
        <div className="flex-1 flex justify-center">
            <div className="relative">
                <div className="text-6xl font-mono font-bold text-center">
                    {formatTime(timeRemaining)}
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full mt-2">
                    <div 
                    className="h-full bg-gradient-to-r from-teal-400 to-blue-500 rounded-full transition-all duration-1000"
                    style={{ width: `${progress}%` }}
                    />
                </div>
                <div className="text-center mt-2 text-sm text-gray-300">
                    {isActive ? 'Focus Time' : 'Paused'}
                </div>
            </div>
        </div>
    )
}