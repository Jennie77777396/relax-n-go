import TaskList from '@/components/Tasks/ListTasks'
import { getFields } from '@/actions/tasks'
import { Button } from '@/components/ui/button'
import { Calendar } from 'lucide-react'

export default async function TasksPage() {
  const fields = await getFields()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Today
        </Button>
      </div>
      <div className="grid auto-rows-min gap-4 md:grid-cols-2">
        {fields.map((field) => (
          <div key={field.title} className="aspect-video rounded-xl border-1 p-2">
            <TaskList fieldTitle={field.title} fromDate={today} />
          </div>
        ))}
      </div>
    </div>
  )
}
