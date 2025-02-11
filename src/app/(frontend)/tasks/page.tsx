import CreateTaskButton from '@/components/Tasks/CreateTaskButton'
import TaskList from '@/components/Tasks/ListTasks'
import { getTasks, getFields } from '@/actions/tasks'
import { Field, Task } from '@/payload-types'

export default async function tasksPage() {
  const fields = await getFields()
  const fieldTasks: Record<string, Task[]> = {}
  fields.forEach((field) => {
    fieldTasks[field.title] = []
  })

  const tasksArray = await Promise.all(
    fields.map((field) => getTasks({ 'fields.title': { equals: field.title } }, 'createdAt')),
  )

  fields.forEach((field, index) => {
    fieldTasks[field.title] = tasksArray[index]?.tasks ?? []
  })

  console.log('fieldTasks', fieldTasks)

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-2">
          {Object.entries(fieldTasks).map(([field, tasks]) => (
            <div key={field} className="aspect-video rounded-xl bg-muted/50 p-2">
              <TaskList tasks={tasks} />
            </div>
          ))}
        </div>
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
      </div>
    </>
  )
}
