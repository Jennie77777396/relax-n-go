// components/Tasks/ListTasks.tsx
'use client'

import { Where } from 'payload'
import { useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { TaskCard } from './TaskCards'
import { Task } from '@/payload-types'
import { useSearchParams } from 'next/navigation'
import { getTasks } from '@/actions/tasks-rest'
import { useRouter } from 'next/navigation'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { CreateTaskButton } from './CreateTaskButton'
import useSWR from 'swr'

interface TaskListProps {
  fieldTitle: string
  filter?: Where | undefined | null
}

const fetcher = async ([endpoint, filters, sort, page]: [string, Where, string, number]) => {
  const result = await getTasks(filters, sort, page)
  return result
}

const TaskList = ({ fieldTitle, filter }: TaskListProps) => {
  const searchParams = useSearchParams()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const router = useRouter()

  const today = searchParams.get('today') === 'true'
  const lastThreeDays = searchParams.get('lastThreeDays') === 'true'
  const reviewOnly = searchParams.get('reviewOnly') === 'true'
  const hideCompleted = searchParams.get('hideCompleted') === 'true'

  const toFilter: Where = {
    ...filter,
    'fields.title': { like: fieldTitle },
    ...(hideCompleted ? { status: { less_than: 1 } } : {}),
    ...(today
      ? {
          updatedAt: { greater_than_equal: new Date().toISOString().split('T')[0] },
        }
      : {}),
    ...(lastThreeDays && {
      updatedAt: {
        greater_than_equal: new Date(new Date().setDate(new Date().getDate() - 3))
          .toISOString()
          .split('T')[0],
      },
    }),
    ...(reviewOnly ? { reviewOnly: { equals: true } } : {}),
  }

  const swrKey = ['/api/tasks', toFilter, '-updatedAt', currentPage]
  const { data, error, isLoading } = useSWR(swrKey, fetcher)
  const tasks = data?.tasks || []
  const totalPages = data?.totalPages || 1
  const hasPrevPage = data?.hasPrevPage || false
  const hasNextPage = data?.hasNextPage || false

  const handleNavigationToFieldPage = (field: string) => {
    router.push(`/${field}`)
  }

  if (error) return <div>Error loading tasks</div>

  return (
    <div className="space-y-4">
      <TaskListHeader
        fieldTitle={fieldTitle}
        tasks={tasks}
        onNavigate={handleNavigationToFieldPage}
        swrKey={swrKey}
      />
      {isLoading ? (
        <TaskListSkeleton />
      ) : tasks.length > 0 ? (
        <TaskListContent tasks={tasks} />
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
  onNavigate,
  swrKey,
}: {
  fieldTitle: string
  tasks: Task[]
  onNavigate: (field: string) => void
  swrKey: (string | number | Where)[]
}) => (
  <div className="flex items-center gap-2">
    <div
      className="tracking-[.25em] uppercase font-semibold text-sm hover:cursor-pointer hover:bg-muted hover:text-foreground transition-colors duration-200 group relative"
      onClick={() => onNavigate(fieldTitle)}
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
        const totalSeconds = tasks.reduce((acc, task) => acc + (task.total_spent || 0), 0)
        const totalMinutes = Math.floor(totalSeconds / 60)
        const hours = Math.floor(totalMinutes / 60)
        const minutes = totalMinutes % 60
        return totalMinutes ? `${hours}h ${minutes}m` : null
      })()}
    </div>
    <CreateTaskButton fields={[fieldTitle]} swrKey={swrKey} />
  </div>
)

const TaskListSkeleton = () => (
  <>
    {[...Array(3)].map((_, i) => (
      <Skeleton key={i} className="h-24 w-full rounded-md" />
    ))}
  </>
)

const TaskListContent = ({ tasks }: { tasks: Task[] }) => (
  <div className="space-y-2">
    {tasks.map((task) => (
      <TaskCard key={task.id} task={task} />
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
