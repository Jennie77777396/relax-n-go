import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { useStopwatch } from '@/hooks/useStopwatch'
import { Field, Task } from '@/payload-types'
import { Progress } from '@/components/ui/progress'
import { useState } from 'react'

interface TaskCardProps {
  task: Task
  onToggle: (taskId: number, isRunning: boolean) => void
}

export const TaskCard = ({ task, onToggle }: TaskCardProps) => {
  console.log('in task card ', task)
  const { formattedTime } = useStopwatch(task.id, task.timer || 0, task.is_running || false)
  const [status, setStatus] = useState(task.status)

  const handleToggle = (checked: boolean) => {
    console.log('Toggling task:', task.id, 'to:', checked)
    onToggle(task.id, task.is_running || false)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            {task.emoji} {task.title}
          </CardTitle>
          <Switch checked={task.is_running || false} onCheckedChange={handleToggle} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 items-center gap-4">
          <div className="flex items-center gap-2">
            {task.fields
              ? task.fields.map((field: Field | number) => (
                  <div
                    className={`rounded-full text-xs px-2 py-1 bg-${(field as Field).color}-500`}
                    key={(field as Field).id}
                  >
                    {(field as Field).title}
                  </div>
                ))
              : 'No field'}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Progress className="w-2/3 text-sky-500" value={status * 100} />
          {task.status * 100} /100
        </div>
        <div className="flex justify-between items-center">
          <p className="font-mono text-lg">{formattedTime}</p>
        </div>
      </CardContent>
    </Card>
  )
}
