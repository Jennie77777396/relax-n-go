import { Task } from '@/payload-types'

export async function updateTask(
  taskId: number,
  data: Partial<Task>,
): Promise<{ success: boolean; task?: Task; error?: string }> {
  try {
    //const response = await payload.update({ collection: 'tasks', id: taskId, data })
    const url = process.env.NEXT_PUBLIC_SERVER_URL
    const req = await fetch(`${url}/api/tasks/${taskId}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!req.ok) {
      throw new Error(`HTTP error! status: ${req.status}`)
    }

    const response = await req.json()
    console.log('update response: ', response)
    return { success: true, task: response }
  } catch (err) {
    console.error('Fetch error:', err)
    return { success: false, error: (err as Error).message }
  }
}
