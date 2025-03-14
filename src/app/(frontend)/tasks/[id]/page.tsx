import { Task as TaskType } from '@/payload-types'
import { getTaskById } from '@/actions/tasks'
import { TaskEditPage } from './page.client'

export default async function TaskPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const task = await getTaskById(resolvedParams.id) // Use the resolved object
  console.log(`task ${resolvedParams.id} `, JSON.stringify(task, null, 2))
  if (!task) {
    return <div>Task not found</div>
  }
  return <TaskEditPage task={task as TaskType} />
}
