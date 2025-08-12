'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import Card from '../UI/Card'
import type { PerformanceDataPoint } from '../../types'

interface PerformanceChartProps {
  data?: PerformanceDataPoint[]
}

export default function PerformanceChart({ data }: PerformanceChartProps): JSX.Element {
    const defaultData: PerformanceDataPoint[] = [
        { time: '0min', mood: 3, focus: 2 },
        { time: '15min', mood: 4, focus: 4 },
        { time: '30min', mood: 4, focus: 5 },
        { time: '45min', mood: 5, focus: 4 },
        { time: '60min', mood: 5, focus: 5 }
    ]

    const chartData = data || defaultData

  return (
    <Card>
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Performance Overview</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="time" 
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              domain={[0, 5]}
              stroke="#6b7280"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="mood" 
              stroke="#10b981" 
              strokeWidth={3}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
              name="Mood"
            />
            <Line 
              type="monotone" 
              dataKey="focus" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
              name="Focus"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full" />
          <span className="text-gray-600">Mood improvement: +2 points</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full" />
          <span className="text-gray-600">Peak focus: 45-60 min mark</span>
        </div>
      </div>
    </Card>
  )
}