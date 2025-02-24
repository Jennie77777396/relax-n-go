'use client'

import { Where } from 'payload'
import { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { TaskCard } from './TaskCards'
import { Task } from '@/payload-types'
import { getTasksREST } from '@/actions/tasks'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { CreateTaskButton } from './CreateTaskButton'

interface TaskListProps {
  fieldTitle: string
  filter?: Where | undefined | null
}

export default function TaskList({ fieldTitle, filter }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [hasPrevPage, setHasPrevPage] = useState<boolean>(false)
  const [hasNextPage, setHasNextPage] = useState<boolean>(false)

  useEffect(() => {
    async function fetchTasks() {
      setLoading(true)
      const toFilter = { ...filter, 'fields.title': { equals: fieldTitle } }
      console.log('filtering: ', JSON.stringify(toFilter, null, 2))
      const result = await getTasksREST(toFilter, '-updatedAt', currentPage)
      setTasks(result.tasks)
      setTotalPages(result.totalPages)
      setHasPrevPage(result.hasPrevPage)
      setHasNextPage(result.hasNextPage)
      setLoading(false)
    }

    fetchTasks()
  }, [fieldTitle, currentPage])

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
    )
  }

  return (
    <div className="mx-auto space-y-4">
      <div className="flex items-center gap-2">
        <div className="tracking-[.25em] uppercase font-semibold text-sm"> ⁕ {fieldTitle} ⁕ </div>
        <div className="text-sm text-muted-foreground">{tasks.length} to do</div>
        <Separator orientation="vertical" className="h-4 bg-muted-foreground/20" />
        <div className="text-sm text-muted-foreground">
          {(() => {
            const totalSeconds = tasks.reduce((acc, task) => acc + (task.timer || 0), 0)
            const totalMinutes = Math.floor(totalSeconds / 60)
            const hours = Math.floor(totalMinutes / 60)
            const minutes = totalMinutes % 60
            return totalMinutes ? `${hours}h ${minutes}m` : null
          })()}
        </div>
        <CreateTaskButton fields={[fieldTitle]} />
      </div>
      {loading ? (
        [...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-md" />)
      ) : tasks.length > 0 ? (
        <div className="space-y-4">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onTaskUpdate={handleTaskUpdate} />
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
