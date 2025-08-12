'use client'

import { useState, FormEvent } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import Card from '../UI/Card'
import Button from '../UI/Button'
import { useTasks, useToast } from '../../context/AppContext'

export default function TaskInput(): JSX.Element {
  const [newTask, setNewTask] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  
  const { addTask } = useTasks()
  const toast = useToast()

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault()
    if (!newTask.trim()) return

    setIsSubmitting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 300)) // Simulate API call
      
      addTask({
        title: newTask.trim(),
        subject: 'General',
        type: 'assignment',
        priority: 'medium',
        status: 'pending',
        due: 'Later',
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      
      setNewTask('')
      toast.success('Task added!', `"${newTask.trim()}" has been added to your list`)
      
    } catch (error) {
      toast.error('Failed to add task', 'Please try again')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Add Task</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex space-x-3">
          <input
            type="text"
            placeholder="What do you need to work on?"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder-gray-500"
            disabled={isSubmitting}
            maxLength={100}
          />
          <Button
            type="submit"
            disabled={!newTask.trim() || isSubmitting}
            isLoading={isSubmitting}
            className="flex items-center space-x-2"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            <span>Add</span>
          </Button>
        </div>
        
        {/* Quick subject selector */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-600">Quick add for:</span>
          {['Mathematics', 'English', 'History', 'Chemistry', 'TOK', 'EE'].map(subject => (
            <button
              key={subject}
              type="button"
              onClick={() => {
                if (newTask.trim()) {
                  addTask({
                    title: newTask.trim(),
                    subject,
                    type: 'assignment',
                    priority: 'medium',
                    status: 'pending',
                    due: 'Later',
                    completed: false,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                  })
                  setNewTask('')
                  toast.success(`${subject} task added!`)
                }
              }}
              disabled={!newTask.trim() || isSubmitting}
              className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {subject}
            </button>
          ))}
        </div>
      </form>
    </Card>
  )
}