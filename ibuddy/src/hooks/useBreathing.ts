import { useState, useEffect } from 'react'

interface UseBreathingReturn {
    showBreathing: boolean
    setShowBreathing: (show: boolean) => void
    breathingAnimation: 'inhale' | 'exhale'
}

export function useBreathing(): UseBreathingReturn {
    const [showBreathing, setShowBreathing] = useState<boolean>(false)
    const [breathingAnimation, setBreathingAnimation] = useState<'inhale' | 'exhale'>('inhale')

    useEffect(() => {
        if (showBreathing) {
            const breathingInterval = setInterval(() => {
                setBreathingAnimation(prev => prev === 'inhale' ? 'exhale' : 'inhale')
            }, 4000)
            return () => clearInterval(breathingInterval)
        }
    }, [showBreathing])

    return {
        showBreathing,
        setShowBreathing,
        breathingAnimation
    }
}