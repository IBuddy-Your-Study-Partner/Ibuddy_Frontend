'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Brain, Bell, User, Settings, Moon, Sun } from 'lucide-react'
import { useUser, useTheme, useNotifications } from '../../context/AppContext'

export default function Header(): JSX.Element | null {
  const pathname = usePathname()
  const { state: userState } = useUser()
  const { theme, toggleTheme } = useTheme()
  const { notifications } = useNotifications()
  
  // Don't show header on arena page for full immersion
  if (pathname === '/arena') {
    return null
  }

  const unreadNotifications = notifications.filter(n => !n.persistent).length

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-r from-teal-400 to-blue-500 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">iBuddy</h1>
              <p className="text-xs text-gray-500">IB Study Companion</p>
            </div>
          </Link>
          
          {/* User Stats */}
          {userState.profile && (
            <div className="hidden md:flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-gray-600">
                  {userState.stats.streak} day streak
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-yellow-600 font-medium">
                  {userState.stats.coins} coins
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-blue-600 font-medium">
                  Level {userState.stats.level}
                </span>
              </div>
            </div>
          )}
          
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100">
              <Bell className="w-5 h-5" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </span>
              )}
            </button>

            {/* Settings */}
            <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100">
              <Settings className="w-5 h-5" />
            </button>

            {/* User Avatar */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-teal-400 to-blue-500 rounded-full flex items-center justify-center">
                {userState.profile?.avatar ? (
                  <img 
                    src={userState.profile.avatar} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <User className="w-5 h-5 text-white" />
                )}
              </div>
              
              {userState.profile && (
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">
                    {userState.profile.displayName}
                  </p>
                  <p className="text-xs text-gray-500">
                    IB Year {userState.profile.ibYear || 1}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}