// components/tasks/TaskCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tag, Task } from '@/payload-types'
import { useEffect, useState } from 'react'
import { updateTask } from '@/actions/tasks-rest'
import { TagsLine } from '@/components/TagsLine'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { FeedbackDialog } from './FeedbackDialog'
import Link from 'next/link'
import { EllipsisVertical } from 'lucide-react'

interface TaskCardProps {
  task: Task
  onTaskUpdate?: (updatedTask: Task) => void
}

export const TaskCard = ({ task, onTaskUpdate }: TaskCardProps) => {
  const [feedbackPopUp, setFeedbackPopUp] = useState(false)

  useEffect(() => {}, [feedbackPopUp])

  const handleReDoTask = async (id: number) => {
    try {
      const response = await updateTask(id, { status: 0 })
      console.log('re do task update: ', response.task)
      if (!response.success) {
        console.error('re do task failed: ', response.error)
      }
    } catch (error) {
      console.error('Error when updating a completed task: ', (error as Error).message)
    }
  }

  return (
    <>
      <Card
        className={`
          w-full rounded-lg shadow-sm transition-all
          ${
            task.status === 1 &&
            task.fields &&
            task.fields.length > 0 &&
            typeof task.fields[0] === 'object' &&
            'color' in task.fields[0]
              ? 'bg-transparent'
              : 'bg-white'
          }
        `}
        style={{
          background:
            task.status === 1 &&
            task.fields &&
            task.fields.length > 0 &&
            typeof task.fields[0] === 'object' &&
            'color' in task.fields[0]
              ? task.fields[0].color
              : 'white',
        }}
      >
        <CardHeader className="p-2 sm:p-3 space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <CardTitle className="text-sm sm:text-base font-medium flex items-center justify-between w-full">
              <Link href={`/tasks/${task.id}`} className="truncate">
                {task.status < 1 ? task.emoji : '💅🏻'} {task.title}
              </Link>
              {task.status === 1 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="ml-auto cursor-pointer">
                      <EllipsisVertical />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-36 sm:w-40">
                    <DropdownMenuItem onClick={() => handleReDoTask(task.id)}>
                      Redo task now
                    </DropdownMenuItem>
                    <DropdownMenuItem>Review Tomorrow</DropdownMenuItem>
                    <DropdownMenuItem>Review followed Ebbinghouse</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </CardTitle>
            {task.status < 1 && (
              <div className="text-xs sm:text-sm text-gray-600 text-right truncate">
                Need some new design
              </div>
            )}
          </div>
        </CardHeader>
        {task.tags && task.tags.length > 0 && (
          <CardContent className="p-2 sm:p-3 space-y-2">
            <TagsLine tags={task.tags as Tag[]} />
          </CardContent>
        )}
      </Card>

      <FeedbackDialog task={task} isOpen={feedbackPopUp} onClose={() => setFeedbackPopUp(false)} />
    </>
  )
}
