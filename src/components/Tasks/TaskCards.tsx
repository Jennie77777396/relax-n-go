import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { useStopwatch } from '@/hooks/useStopwatch'
import { Field, Task } from '@/payload-types'
import { Progress } from '@/components/ui/progress'
import { useState, useEffect } from 'react'

interface TaskCardProps {
  task: Task
  onToggle: (taskId: number, isRunning: boolean) => void
}

export const TaskCard = ({ task, onToggle }: TaskCardProps) => {
  const { formattedTime } = useStopwatch(task.id, task.timer || 0, task.is_running || false)
  const [status, setStatus] = useState(task.status)
  const [isRunning, setIsRunning] = useState(task.is_running || false)

  useEffect(() => {
    setIsRunning(task.is_running || false) // ✅ Update when props change
  }, [task.is_running])

  const handleToggle = (checked: boolean) => {
    console.log('Toggling task:', task.id, 'to:', checked)
    setIsRunning(checked) // ✅ Local update
    onToggle(task.id, checked) // ✅ Send update to parent
  }

  return (
    <Card className="p-4 rounded-lg shadow-md bg-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            {task.emoji} {task.title}
          </CardTitle>
          {/* ✅ Toggle Button */}
          <Switch checked={isRunning} onCheckedChange={handleToggle} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 🔹 Fields Section */}
        <div className="grid grid-cols-2 items-center gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {task.fields?.length ? (
              task.fields.map((field: Field | number) => (
                <div
                  key={(field as Field).id}
                  className={`rounded-full text-xs px-2 py-1 bg-${(field as Field).color}-500 text-white`}
                >
                  {(field as Field).title}
                </div>
              ))
            ) : (
              <span className="text-gray-500">No field</span>
            )}
          </div>
        </div>

        {/* 🔹 Progress Section */}
        <div className="flex items-center gap-2">
          <Progress className="w-2/3 text-sky-500" value={status * 100} />
          <span className="text-sm font-medium">{status * 100} / 100</span>
        </div>

        {/* 🔹 Timer Section */}
        <div className="flex justify-between items-center">
          <p className="font-mono text-lg">{formattedTime}</p>
        </div>
      </CardContent>
    </Card>
  )
}
