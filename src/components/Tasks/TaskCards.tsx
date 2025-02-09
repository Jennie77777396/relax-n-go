import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { useStopwatch } from '@/hooks/useStopwatch'
import { Task } from '@/payload-types'

interface TaskCardProps {
  task: Task
  onToggle: (taskId: number, isRunning: boolean) => void
}

export const TaskCard = ({ task, onToggle }: TaskCardProps) => {
  const { formattedTime } = useStopwatch(task.id, task.timer || 0, task.is_running || false)

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
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">Importance: {task.importance || 'N/A'}</p>
          <p className="font-mono text-lg">{formattedTime}</p>
        </div>
      </CardContent>
    </Card>
  )
}
