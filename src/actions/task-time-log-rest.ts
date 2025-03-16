// task-time-log-rest.ts
import { Where } from 'payload'
import { stringify } from 'qs-esm'
import { TaskTimeLog } from '@/payload-types'

const url = process.env.NEXT_PUBLIC_SERVER_URL

// Create a new task time log
export async function createTaskTimeLog(data: Partial<TaskTimeLog>): Promise<{
  success: boolean
  taskTimeLog?: TaskTimeLog
  error?: string
}> {
  try {
    const req = await fetch(`${url}/api/taskTimeLogs`, {
      method: 'POST',
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
    console.log('create response: ', response)
    return { success: true, taskTimeLog: response.doc }
  } catch (err) {
    console.error('Fetch error:', err)
    return { success: false, error: (err as Error).message }
  }
}

// Update an existing task time log
export async function updateTaskTimeLog(
  logId: string,
  data: Partial<TaskTimeLog>,
): Promise<{ success: boolean; taskTimeLog?: TaskTimeLog; error?: string }> {
  try {
    const req = await fetch(`${url}/api/taskTimeLogs/${logId}`, {
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
    return { success: true, taskTimeLog: response.doc }
  } catch (err) {
    console.error('Fetch error:', err)
    return { success: false, error: (err as Error).message }
  }
}

// Get task time logs with filters
export async function getTaskTimeLogs(
  filters: Where = {},
  sort: string = '-updatedAt',
  page: number = 1,
  limit: number = 10,
): Promise<{
  taskTimeLogs: TaskTimeLog[]
  totalPages: number
  totalDocs: number
  hasPrevPage: boolean
  hasNextPage: boolean
}> {
  const query = {
    depth: 1,
    locale: 'en',
    where: filters,
    sort,
    page,
    limit,
  }

  const searchParams = stringify(query, {
    addQueryPrefix: true,
    encodeValuesOnly: true,
  })

  const wholeUrl = `${url}/api/taskTimeLogs${searchParams}`

  const response = await fetch(wholeUrl, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Accept-Language': 'en',
    },
  })

  if (!response.ok) {
    let errorData
    try {
      errorData = await response.json()
    } catch (jsonError) {
      console.error('Error parsing JSON:', jsonError)
      errorData = { message: 'An error occurred while fetching task time logs.' }
    }
    console.error('Error fetching task time logs:', errorData)
    throw new Error(`Failed to fetch task time logs: ${errorData.message || response.statusText}`)
  }

  const data = await response.json()
  return {
    taskTimeLogs: data.docs as TaskTimeLog[],
    totalPages: data.totalPages,
    totalDocs: data.totalDocs,
    hasPrevPage: data.hasPrevPage,
    hasNextPage: data.hasNextPage,
  }
}

// Delete a task time log
export async function deleteTaskTimeLog(logId: string): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const req = await fetch(`${url}/api/taskTimeLogs/${logId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!req.ok) {
      throw new Error(`HTTP error! status: ${req.status}`)
    }

    console.log('delete response: ', await req.json())
    return { success: true }
  } catch (err) {
    console.error('Fetch error:', err)
    return { success: false, error: (err as Error).message }
  }
}

// Upsert a task time log (update if exists, create if not)
export async function upsertTaskTimeLog(data: Partial<TaskTimeLog>): Promise<{
  success: boolean
  taskTimeLog?: TaskTimeLog
  error?: string
}> {
  try {
    const taskId = data.task
    const date = data.date ? new Date(data.date).toISOString().split('T')[0] : null
    const seconds = data.seconds || 0

    if (!taskId || !date) {
      throw new Error('task and date are required for upsert')
    }

    // Check if a log exists for this task and date
    const existingLogs = await getTaskTimeLogs({
      task: { equals: taskId },
      date: { equals: date },
    })

    if (existingLogs.taskTimeLogs.length > 0 && existingLogs?.taskTimeLogs[0]?.id) {
      // Update existing log
      const logId = existingLogs.taskTimeLogs[0].id
      const existingSeconds = existingLogs.taskTimeLogs[0].seconds || 0
      const updatedData = {
        seconds: existingSeconds + seconds,
      }

      const req = await fetch(`${url}/api/taskTimeLogs/${logId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      })

      if (!req.ok) {
        throw new Error(`HTTP error! status: ${req.status}`)
      }

      const response = await req.json()
      console.log('upsert update response: ', response)
      return { success: true, taskTimeLog: response.doc }
    } else {
      // Create new log
      const req = await fetch(`${url}/api/taskTimeLogs`, {
        method: 'POST',
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
      console.log('upsert create response: ', response)
      return { success: true, taskTimeLog: response.doc }
    }
  } catch (err) {
    console.error('Upsert error:', err)
    return { success: false, error: (err as Error).message }
  }
}
