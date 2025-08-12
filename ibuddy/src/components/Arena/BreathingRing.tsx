'use client'

import { useEffect } from 'react'

interface BreathingRingProps {
  showBreathing: boolean
  setShowBreathing: (show: boolean) => void
  breathingAnimation: 'inhale' | 'exhale'
}

export default function BreathingRing({ 
  showBreathing, 
  setShowBreathing, 
  breathingAnimation 
}: BreathingRingProps): JSX.Element {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'b' || e.key === 'B') {
        setShowBreathing(!showBreathing)
      }
      if (e.key === 'Escape' && showBreathing) {
        setShowBreathing(false)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [showBreathing, setShowBreathing])

  return (
    <>
      {/* Floating Breathing Ring */}
      <div 
        className="fixed bottom-8 right-8 cursor-pointer group z-40"
        onClick={() => setShowBreathing(!showBreathing)}
      >
        <div className={`w-32 h-32 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 opacity-70 flex items-center justify-center transition-all duration-4000 ${
          breathingAnimation === 'inhale' ? 'scale-110' : 'scale-100'
        } group-hover:opacity-90`}>
          <div className="text-center">
            <div className="text-sm font-medium">Breathe</div>
            <div className="text-xs opacity-75 capitalize">{breathingAnimation}</div>
          </div>
        </div>
        
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Press 'B' to breathe
        </div>
      </div>

      {/* Breathing Exercise Overlay */}
      {showBreathing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 text-gray-900 text-center max-w-md mx-4">
            <h3 className="text-2xl font-bold mb-4">Breathing Exercise</h3>
            
            {/* Large breathing circle */}
            <div className="relative mb-6">
              <div className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-purple-400 to-blue-500 transition-transform duration-4000 ${
                breathingAnimation === 'inhale' ? 'scale-125' : 'scale-100'
              }`} />
              
              {/* Breathing instructions */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white font-semibold">
                  <div className="text-lg capitalize">{breathingAnimation}</div>
                  <div className="text-sm opacity-75">
                    {breathingAnimation === 'inhale' ? '4 seconds' : '4 seconds'}
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-lg mb-2 capitalize font-semibold">{breathingAnimation}</p>
            <p className="text-gray-600 mb-6">Follow the circle and breathe deeply</p>
            
            {/* Controls */}
            <div className="flex space-x-3 justify-center">
              <button
                onClick={() => setShowBreathing(false)}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Continue Session
              </button>
              <button
                onClick={() => setShowBreathing(false)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
            
            <p className="text-xs text-gray-500 mt-4">Press 'Escape' to close</p>
          </div>
        </div>
      )}
    </>
  )
}