'use client'

import { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { TaskCard } from './TaskCards'
import { Task } from '@/payload-types'
import { getTasks, updateTask } from '@/actions/tasks'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface TaskListProps {
  fieldTitle: string
}

export default function TaskList({ fieldTitle }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [hasPrevPage, setHasPrevPage] = useState<boolean>(false)
  const [hasNextPage, setHasNextPage] = useState<boolean>(false)

  useEffect(() => {
    async function fetchTasks() {
      setLoading(true)
      const result = await getTasks(
        { 'fields.title': { equals: fieldTitle } },
        'createdAt',
        currentPage,
      )
      setTasks(result.tasks)
      setTotalPages(result.totalPages)
      setHasPrevPage(result.hasPrevPage)
      setHasNextPage(result.hasNextPage)
      setLoading(false)
    }

    fetchTasks()
  }, [fieldTitle, currentPage])

  /** 🔥 **toggleTimer: Local State Update & Backend Update** */
  const toggleTimer = async (taskId: number, isRunning: boolean) => {
    console.log('Toggling timer for task:', taskId, 'Current State:', isRunning)

    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === taskId ? { ...task, is_running: !isRunning } : task)),
    )

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

        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === taskId
              ? { ...task, timer: newTimer, startTime: null, is_running: false }
              : task,
          ),
        )
      }
    } catch (error) {
      console.error('Failed to update timer:', error)
    }
  }

  return (
    <div className="mx-auto space-y-4">
      {loading ? (
        [...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-md" />)
      ) : tasks.length > 0 ? (
        <div className="space-y-4">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onToggle={toggleTimer} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No tasks found for {fieldTitle}.</p>
      )}

      {/* 🔹 ShadCN Pagination */}
      <Pagination className="mt-4">
        <PaginationContent className="gap-2">
          <PaginationItem>
            {hasPrevPage ? (
              <PaginationLink onClick={() => setCurrentPage((prev) => prev - 1)}>
                <ChevronLeft className="h-4 w-4" />
              </PaginationLink>
            ) : (
              <PaginationLink className="pointer-events-none opacity-50">
                <ChevronLeft className="h-4 w-4" />
              </PaginationLink>
            )}
          </PaginationItem>
          {[...Array(totalPages)].map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                onClick={() => setCurrentPage(i + 1)}
                isActive={currentPage === i + 1}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            {hasNextPage ? (
              <PaginationLink onClick={() => setCurrentPage((prev) => prev + 1)}>
                <ChevronRight className="h-4 w-4" />
              </PaginationLink>
            ) : (
              <PaginationLink className="pointer-events-none opacity-50">
                <ChevronRight className="h-4 w-4" />
              </PaginationLink>
            )}
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
