import CreateTaskButton from '@/components/Tasks/CreateTaskButton'
import TaskList from '@/components/Tasks/ListTasks'
import { getFields } from '@/actions/tasks'

export default async function tasksPage() {
  const fields = await getFields()

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <CreateTaskButton />
        <div className="grid auto-rows-min gap-4 md:grid-cols-2">
          {fields.map((field) => (
            <div key={field.title} className="aspect-video rounded-xl border-1 p-2">
              <TaskList fieldTitle={field.title} />
            </div>
          ))}
        </div>
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
      </div>
    </>
  )
}
