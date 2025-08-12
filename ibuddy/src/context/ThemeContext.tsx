'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// Theme types
type Theme = 'light' | 'dark' | 'auto'
type ResolvedTheme = 'light' | 'dark'

interface ThemeState {
  theme: Theme
  resolvedTheme: ResolvedTheme
  systemTheme: ResolvedTheme
}

// Context interface
interface ThemeContextType {
  theme: Theme
  resolvedTheme: ResolvedTheme
  systemTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

// Create context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Provider component
interface ThemeProviderProps {
  children: ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

export function ThemeProvider({ 
  children, 
  defaultTheme = 'auto',
  storageKey = 'ibuddy-theme'
}: ThemeProviderProps): JSX.Element {
  const [themeState, setThemeState] = useState<ThemeState>({
    theme: defaultTheme,
    resolvedTheme: 'light',
    systemTheme: 'light'
  })

  // Check system theme preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const systemTheme: ResolvedTheme = mediaQuery.matches ? 'dark' : 'light'
    
    setThemeState(prev => ({ ...prev, systemTheme }))

    const handleChange = (e: MediaQueryListEvent) => {
      const newSystemTheme: ResolvedTheme = e.matches ? 'dark' : 'light'
      setThemeState(prev => ({ ...prev, systemTheme: newSystemTheme }))
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Load theme from localStorage
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(storageKey) as Theme
      if (savedTheme && ['light', 'dark', 'auto'].includes(savedTheme)) {
        setThemeState(prev => ({ ...prev, theme: savedTheme }))
      }
    } catch (error) {
      console.error('Failed to load theme from localStorage:', error)
    }
  }, [storageKey])

  // Update resolved theme when theme or system theme changes
  useEffect(() => {
    const resolvedTheme: ResolvedTheme = 
      themeState.theme === 'auto' ? themeState.systemTheme : themeState.theme as ResolvedTheme
    
    setThemeState(prev => ({ ...prev, resolvedTheme }))
  }, [themeState.theme, themeState.systemTheme])

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark')
    
    // Add current theme class
    root.classList.add(themeState.resolvedTheme)
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content', 
        themeState.resolvedTheme === 'dark' ? '#1f2937' : '#ffffff'
      )
    }
  }, [themeState.resolvedTheme])

  const setTheme = (theme: Theme): void => {
    setThemeState(prev => ({ ...prev, theme }))
    
    try {
      localStorage.setItem(storageKey, theme)
    } catch (error) {
      console.error('Failed to save theme to localStorage:', error)
    }
  }

  const toggleTheme = (): void => {
    const newTheme: Theme = themeState.resolvedTheme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }

  const value: ThemeContextType = {
    theme: themeState.theme,
    resolvedTheme: themeState.resolvedTheme,
    systemTheme: themeState.systemTheme,
    setTheme,
    toggleTheme
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

// Custom hook to use Theme context
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}