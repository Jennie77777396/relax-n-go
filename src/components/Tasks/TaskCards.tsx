import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { useStopwatch } from '@/hooks/useStopwatch'
import { Tag, Task } from '@/payload-types'
import { useState } from 'react'
import { updateTask } from '@/actions/tasks'
import { TagsLine } from '@/components/TagsLine'

interface TaskCardProps {
  task: Task
  onTaskUpdate?: (updatedTask: Task) => void
}

export const TaskCard = ({ task, onTaskUpdate }: TaskCardProps) => {
  const [isRunning, setIsRunning] = useState(task.is_running || false)
  const { formattedTime } = useStopwatch(task.id, task.timer || 0, isRunning)

  const handleToggle = async (checked: boolean) => {
    try {
      if (!checked) {
        // Stopping the timer
        if (!task.startTime) return

        const endTime = Date.now()
        const startTime = new Date(task.startTime).getTime()
        const elapsed = Math.floor((endTime - startTime) / 1000)
        const newTimer = (task.timer || 0) + elapsed

        const result = await updateTask(task.id.toString(), {
          timer: newTimer,
          startTime: null,
          is_running: false,
        })

        if (result.success && result.task) {
          setIsRunning(false)
          onTaskUpdate?.(result.task)
        }
      } else {
        const startTime = new Date().toISOString()
        const result = await updateTask(task.id.toString(), {
          startTime,
          is_running: true,
        })

        if (result.success && result.task) {
          setIsRunning(true)
          onTaskUpdate?.(result.task)
        }
      }
    } catch (error) {
      console.error('Error toggling timer:', error)
      // Revert UI state if there's an error
      setIsRunning(!checked)
    }
  }

  return (
    <Card className="p-1 rounded-lg shadow-sm bg-white">
      <CardHeader className="p-2 space-y-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">
            {task.emoji} {task.title}
          </CardTitle>
          <div className="flex items-center justify-end gap-1">
            <p className="font-mono text-sm">{formattedTime}</p>
            <Switch checked={isRunning} onCheckedChange={handleToggle} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-2 space-y-2">
        {/* 🔹 Tags Section */}
        <TagsLine tags={task.tags as Tag[]} />
      </CardContent>
    </Card>
  )
}
