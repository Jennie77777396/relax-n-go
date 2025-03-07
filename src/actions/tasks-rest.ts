import { Task } from '@/payload-types'
import { Where } from 'payload'
import * as qs from 'qs-esm'
import { stringify } from 'qs-esm'

const url = process.env.NEXT_PUBLIC_SERVER_URL
export async function updateTask(
  taskId: number,
  data: Partial<Task>,
): Promise<{ success: boolean; task?: Task; error?: string }> {
  try {
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

export async function getTasks(
  filters: Where = {},
  sort: string = '-updatedAt',
  page: number = 1,
  limit: number = 10,
) {
  // Define the full query object, wrapping filters in 'where'
  const query = {
    depth: 1,
    locale: 'en',
    where: filters, // Filters must be a Where object like { 'fields.title': { like: 'algorithm' } }
    sort,
    page,
    limit,
  }

  // Stringify the query object
  const searchParams = stringify(query, {
    addQueryPrefix: true, // Adds the '?' prefix
    encodeValuesOnly: true, // Encodes values, keeps keys readable
  })

  const wholeUrl = `${url}/api/tasks${searchParams}`
  console.log('Whole URL ', wholeUrl)
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
      errorData = { message: 'An error occurred while fetching tasks.' }
    }
    console.error('Error fetching tasks:', errorData)
    throw new Error(`Failed to fetch tasks: ${errorData.message || response.statusText}`)
  }

  const data = await response.json()
  return {
    tasks: data.docs as Task[],
    totalPages: data.totalPages,
    totalDocs: data.totalDocs,
    hasPrevPage: data.hasPrevPage,
    hasNextPage: data.hasNextPage,
  }
}
