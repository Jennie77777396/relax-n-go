import { getTaskTimeLogs } from '@/actions/task-time-log-rest'
import { getTaskById } from '@/actions/tasks'
import { Stopwatch } from '../../../../components/Stopwatch/stopwatch'

export default async function TaskPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const task = await getTaskById(id) // Fetch task data (includes total_spent)
  const timeLogs = await getTaskTimeLogs({ task: { equals: id } }) // Fetch logs for range queries

  // Calculate today's initial seconds (optional, if you want to resume today's time)
  const today = new Date().toISOString().split('T')[0]
  const todayLog = timeLogs.taskTimeLogs.find((log) => log.date === today)
  const initialSeconds = todayLog?.seconds || 0

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{task?.title || 'No Task Found'}</h1>
      <Stopwatch taskId={id} initialSeconds={initialSeconds} />
    </div>
  )
}

export const revalidate = 0
