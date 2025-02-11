'use client'

import { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { TaskCard } from '@/components/Tasks/TaskCards'
import { Task } from '@/payload-types'
import { getTasks, updateTask } from '@/actions/tasks'

export default function TaskList({ tasks }: { tasks: Task[] }) {
  // const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  // useEffect(() => {
  //   async function fetchTasks() {
  //     setLoading(true)
  //     const result = await getTasks(
  //       { 'fields.title': { equals: fieldTitle } },
  //       'createdAt',
  //       currentPage,
  //     )
  //     setTasks(result.tasks)
  //     setTotalPages(result.totalPages)
  //     setHasPrevPage(result.hasPrevPage)
  //     setHasNextPage(result.hasNextPage)
  //     setLoading(false)
  //   }

  //   fetchTasks()
  // }, [fieldTitle, currentPage])

  /** 🔥 **toggleTimer: Local State Update & Backend Update** */
  const toggleTimer = async (taskId: number, isRunning: boolean) => {
    console.log('Toggling timer for task:', taskId, 'Current State:', isRunning)

    try {
      if (!isRunning) {
        const startTime = new Date().toISOString()
        await updateTask(taskId.toString(), { startTime, is_running: true })
      } else {
        const task = tasks.find((t) => t.id === taskId)
        if (!task || !task.startTime) return

        const endTime = Date.now()
        const elapsed = Math.floor((endTime - new Date(task.startTime).getTime()) / 1000)
        const newTimer = task.timer + elapsed

        await updateTask(taskId.toString(), { timer: newTimer, startTime: null, is_running: false })
      }
    } catch (error) {
      console.error('Failed to update timer:', error)
    }
  }

  return (
    <div className="mx-auto space-y-4">
      {/* {loading ? (
        [...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-md" />)
      ) :  */}
      {tasks.length > 0 ? (
        <div className="space-y-4">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onToggle={toggleTimer} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No tasks found .</p>
      )}
    </div>
  )
}
