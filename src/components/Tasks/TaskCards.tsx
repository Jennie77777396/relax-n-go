import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { useStopwatch } from '@/hooks/useStopwatch'
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
import { MarkdownDialog } from './MarkdownDialog'
import Link from 'next/link'
import { EllipsisVertical } from 'lucide-react'

interface TaskCardProps {
  task: Task
  onTaskUpdate?: (updatedTask: Task) => void
}

export const TaskCard = ({ task, onTaskUpdate }: TaskCardProps) => {
  const [isRunning, setIsRunning] = useState(task.is_running || false)
  const [feedbackPopUp, setFeedbackPopUp] = useState(false)
  const [isMarkdownOpen, setIsMarkdownOpen] = useState(false)
  const { formattedTime } = useStopwatch(task.id, task.timer || 0, isRunning)

  useEffect(() => {}, [feedbackPopUp])
  const handleToggle = (checked: boolean) => {
    console.log('Handle StopWatch Toggle Is Triggered!', checked)
    try {
      if (!checked) {
        console.log('if checked is false, You should see this line')
        setIsRunning(false)
        setFeedbackPopUp(true)
        if (!task.startTime) return

        const endTime = Date.now()
        const startTime = new Date(task.startTime).getTime()
        const elapsed = Math.floor((endTime - startTime) / 1000)
        const newTimer = (task.timer || 0) + elapsed

        updateTask(task.id, {
          timer: newTimer,
          startTime: null,
          is_running: false,
        }).then((result) => {
          if (result.success && result.task) {
            onTaskUpdate?.(result.task)
          }
        })
      } else {
        const startTime = new Date().toISOString()
        updateTask(task.id, {
          startTime,
          is_running: true,
        }).then((result) => {
          if (result.success && result.task) {
            setIsRunning(true)
            onTaskUpdate?.(result.task)
          }
        })
      }
    } catch (error) {
      console.error('Error toggling timer:', error)
      // Revert UI state if there's an error
      setIsRunning(!checked)
    }
  }
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
        className={`p-1 rounded-lg shadow-sm ${
          task.status === 1 &&
          task.fields &&
          task.fields.length > 0 &&
          typeof task.fields[0] === 'object' &&
          'color' in task.fields[0]
            ? 'bg-transparent' // Make the background transparent to show the gradient
            : 'bg-white'
        }`}
        style={{
          background:
            task.status === 1 &&
            task.fields &&
            task.fields.length > 0 &&
            typeof task.fields[0] === 'object' &&
            'color' in task.fields[0]
              ? `linear-gradient(135deg, ${task.fields[0].color}, rgba(248, 200, 208, 0.5), rgba(243, 229, 245, 0.5))` // Use Tailwind color and soft colors
              : 'white',
        }}
      >
        <CardHeader className="p-2 space-y-0">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center justify-between w-full">
              <Link href={`/fields/${task.id}`}>
                {task.status < 1 ? task.emoji : '💅🏻'} {task.title}
              </Link>
              {task.status === 1 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="ml-auto cursor-pointer">
                      <EllipsisVertical />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
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
              <div className="flex items-center justify-end gap-1">
                <p className="font-mono text-sm">{formattedTime}</p>
                <Switch checked={isRunning} onCheckedChange={handleToggle} />
              </div>
            )}
          </div>
        </CardHeader>
        {task.tags && task.tags.length > 0 && (
          <CardContent className="p-2 space-y-2">
            <TagsLine tags={task.tags as Tag[]} />
          </CardContent>
        )}
      </Card>

      <FeedbackDialog task={task} isOpen={feedbackPopUp} onClose={() => setFeedbackPopUp(false)} />
    </>
  )
}
