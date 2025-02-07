'use client'

import { useState, useEffect } from 'react'
import { TasksGrid } from '@/blocks/Tasks/TasksGrid'
import { TasksCarousel } from '@/blocks/Tasks/TasksCarousel'
import { getTasks } from "../actions"
import { Squares2X2Icon, Bars4Icon } from '@heroicons/react/24/outline'

export default function TasksPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'carousel'>('grid')
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const loadTasks = async () => {
      const data = await getTasks()
      setTasks(data?.docs || [])
    }
    loadTasks()
  }, [])

  return (
    <main className='min-h-screen'>
      <div className="flex justify-end p-4">
        <div className="bg-white rounded-lg shadow-sm p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'
            }`}
          >
            <Squares2X2Icon className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('carousel')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'carousel' ? 'bg-gray-100' : 'hover:bg-gray-50'
            }`}
          >
            <Bars4Icon className="w-5 h-5" />
          </button>
        </div>
      </div>


      <div className="flex items-center justify-center">
        {viewMode === 'grid' ? (
          <TasksGrid tasks={tasks} />
        ) : (
          <TasksCarousel tasks={tasks} />
        )}
      </div>
    </main>
  )
}
