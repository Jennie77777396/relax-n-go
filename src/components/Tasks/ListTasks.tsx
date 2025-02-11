'use client'

import { useTaskStore } from '@/stores/useTaskStore'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { TaskCard } from './TaskCards'
import { useEffect } from 'react'
import { Task } from '@/payload-types'

interface TaskListProps {
  tasks: Task[]
}

export default function TaskList({ tasks }: TaskListProps) {
  const {
    currentPage,
    totalPages,
    loading,
    toggleTimer,
    hasNextPage,
    hasPrevPage,
    setCurrentPage,
    fetchTasks,
  } = useTaskStore()
  console.log('in taskslist, ', tasks)
  console.log('task length', tasks.length)

  return (
    <div className="mx-auto space-y-4">
      {loading && tasks.length === 0 ? (
        [...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-md" />)
      ) : tasks.length > 0 ? (
        <div className="space-y-4">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onToggle={toggleTimer} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No tasks found.</p>
      )}

      <div className="flex justify-between items-center mt-4">
        <Button onClick={() => setCurrentPage(currentPage - 1)} disabled={!hasPrevPage}>
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button onClick={() => setCurrentPage(currentPage + 1)} disabled={!hasNextPage}>
          Next
        </Button>
      </div>
    </div>
  )
}
