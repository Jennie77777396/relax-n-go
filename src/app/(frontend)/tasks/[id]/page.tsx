import { Task as TaskType } from '@/payload-types'
import { getTaskById } from '@/actions/tasks'
import { TaskEditPage } from './page.client'
import { getTaskTimeLogs } from '@/actions/task-time-log-rest'
import { Stopwatch } from '../../../../components/Stopwatch/stopwatch'

export default async function TaskPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const task = await getTaskById(id) // Use the resolved object
  const timeLogs = await getTaskTimeLogs({ task: { equals: id } }) // Fetch logs for range queries

  // Calculate today's initial seconds (optional, if you want to resume today's time)
  const today = new Date().toISOString().split('T')[0]
  const todayLog = timeLogs.taskTimeLogs.find((log) => log.date === today)
  const initialSeconds = todayLog?.seconds || 0
  console.log(`task ${id} `, JSON.stringify(task, null, 2))
  if (!task) {
    return <div>Task not found</div>
  }
  return (
    <>
      <Stopwatch taskId={id} initialSeconds={initialSeconds} />
      <TaskEditPage task={task as TaskType} />
    </>
  )
}
