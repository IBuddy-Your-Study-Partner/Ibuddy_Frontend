'use client'

import { useState } from 'react'
import { Calendar } from 'lucide-react'
import Card from '../UI/Card'

interface CalendarDay {
    date: number
    hasDeadline?: boolean
    isToday?: boolean
}

export default function CalendarWidget(): JSX.Element {
    const [currentDate] = useState(new Date())
    
    const today = currentDate.getDate()
    const currentMonth = currentDate.toLocaleDateString('en-US', { month: 'long' })
    const currentYear = currentDate.getFullYear()
    
    // Generate calendar days (simplified for demo)
    const daysInMonth = new Date(currentYear, currentDate.getMonth() + 1, 0).getDate()
    const calendarDays: CalendarDay[] = Array.from({ length: daysInMonth }, (_, i) => ({
        date: i + 1,
        hasDeadline: [3, 15, 22, 28].includes(i + 1),
        isToday: i + 1 === today
    }))

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return (
    <Card>
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
            {currentMonth} {currentYear}
            </h3>
            <Calendar className="w-5 h-5 text-gray-600" />
        </div>
        
        <div className="grid grid-cols-7 gap-2 text-center text-sm">
            {weekDays.map(day => (
            <div key={day} className="py-2 text-gray-600 font-medium">
                {day}
            </div>
            ))}
            
            {calendarDays.map(({ date, hasDeadline, isToday }) => (
            <div
                key={date}
                className={`py-2 hover:bg-gray-100 rounded cursor-pointer relative transition-colors ${
                isToday ? 'bg-blue-500 text-white rounded hover:bg-blue-600' : 'text-gray-900'
                }`}
            >
                {date}
                {hasDeadline && (
                    <div className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full" />
                )}
            </div>
            ))}
        </div>
        
        <div className="mt-4 flex items-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-red-400 rounded-full" />
                <span>Deadlines</span>
            </div>
            <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span>Today</span>
            </div>
        </div>
    </Card>
  )
}