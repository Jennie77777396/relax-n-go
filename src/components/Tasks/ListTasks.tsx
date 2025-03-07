'use client'

import { Where } from 'payload'
import { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { TaskCard } from './TaskCards'
import { Task } from '@/payload-types'
import { useSearchParams } from 'next/navigation'
import { getTasks } from '@/actions/tasks-rest' // Using this import, removed unused getTasksREST
import { useRouter } from 'next/navigation'
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

const TaskList = ({ fieldTitle, filter }: TaskListProps) => {
  const searchParams = useSearchParams()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [hasPrevPage, setHasPrevPage] = useState<boolean>(false)
  const [hasNextPage, setHasNextPage] = useState<boolean>(false)

  const router = useRouter()

  // Extracting parameters from the URL
  const today = searchParams.get('today') === 'true'
  const lastThreeDays = searchParams.get('lastThreeDays') === 'true'
  const reviewOnly = searchParams.get('reviewOnly') === 'true'
  const hideCompleted = searchParams.get('hideCompleted') === 'true'

  useEffect(() => {
    async function fetchTasks() {
      setLoading(true)
      const toFilter: any = {
        ...filter,
        'fields.title': { like: fieldTitle },
        status: hideCompleted ? { less_than: 1 } : undefined,
        updatedAt: today
          ? { greater_than_equal: new Date().toISOString().split('T')[0] }
          : undefined,
        ...(lastThreeDays && {
          updatedAt: {
            greater_than_equal: new Date(new Date().setDate(new Date().getDate() - 3))
              .toISOString()
              .split('T')[0],
          },
        }),
        ...(reviewOnly && { reviewOnly: true }),
        ...(hideCompleted && { hideCompleted: true }),
      }
      const result = await getTasks(toFilter, '-updatedAt', currentPage)
      setTasks(result.tasks)
      setTotalPages(result.totalPages)
      setHasPrevPage(result.hasPrevPage)
      setHasNextPage(result.hasNextPage)
      setLoading(false)
    }
    fetchTasks()
  }, [fieldTitle, currentPage, today, lastThreeDays, reviewOnly, hideCompleted, filter])

  const handleNavigationToFieldPage = (field: string) => {
    router.push(`/${field}`)
  }

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
    )
  }

  return (
    <div className="mx-auto space-y-4">
      <TaskListHeader
        fieldTitle={fieldTitle}
        tasks={tasks}
        onNavigate={handleNavigationToFieldPage} // Pass navigation function
      />
      {loading ? (
        <TaskListSkeleton />
      ) : tasks.length > 0 ? (
        <TaskListContent tasks={tasks} onTaskUpdate={handleTaskUpdate} />
      ) : (
        <p className="text-gray-500">No tasks found for {fieldTitle}.</p>
      )}
      <TaskListPagination
        currentPage={currentPage}
        totalPages={totalPages}
        hasPrevPage={hasPrevPage}
        hasNextPage={hasNextPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  )
}

const TaskListHeader = ({
  fieldTitle,
  tasks,
  onNavigate, // Add prop for navigation
}: {
  fieldTitle: string
  tasks: Task[]
  onNavigate: (field: string) => void
}) => (
  <div className="flex items-center gap-2">
    <div
      className="tracking-[.25em] uppercase font-semibold text-sm hover:cursor-pointer hover:bg-muted hover:text-foreground transition-colors duration-200 group relative"
      onClick={() => onNavigate(fieldTitle)} // Use the passed function
    >
      ⁕ {fieldTitle} ⁕
      <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-background text-muted-foreground text-xs px-2 py-1 rounded shadow">
        Go to {fieldTitle} field
      </span>
    </div>
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
)

const TaskListSkeleton = () => (
  <>
    {[...Array(3)].map((_, i) => (
      <Skeleton key={i} className="h-24 w-full rounded-md" />
    ))}
  </>
)

const TaskListContent = ({
  tasks,
  onTaskUpdate,
}: {
  tasks: Task[]
  onTaskUpdate: (task: Task) => void
}) => (
  <div className="space-y-1">
    {tasks.map((task) => (
      <TaskCard key={task.id} task={task} onTaskUpdate={onTaskUpdate} />
    ))}
  </div>
)

const TaskListPagination = ({
  currentPage,
  totalPages,
  hasPrevPage,
  hasNextPage,
  setCurrentPage,
}: {
  currentPage: number
  totalPages: number
  hasPrevPage: boolean
  hasNextPage: boolean
  setCurrentPage: (page: number) => void
}) => (
  <Pagination className="mt-4">
    <PaginationContent className="gap-2">
      <PaginationItem>
        {hasPrevPage ? (
          <PaginationLink onClick={() => setCurrentPage(currentPage - 1)}>
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
          <PaginationLink onClick={() => setCurrentPage(i + 1)} isActive={currentPage === i + 1}>
            {i + 1}
          </PaginationLink>
        </PaginationItem>
      ))}
      <PaginationItem>
        {hasNextPage ? (
          <PaginationLink onClick={() => setCurrentPage(currentPage + 1)}>
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
)

export default TaskList
