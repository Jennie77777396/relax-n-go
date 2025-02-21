'use server'

import { Where } from 'payload'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Task } from '@/payload-types'
import { Status } from '@/types/status'
import * as qs from 'qs-esm'

export interface TaskProps {
  id?: number
  title: string
  createdAt?: string
  emoji: string
  importance?: number | null
  rating?: number | null
  feedback?: string | null
  tags?: string[]
  fields?: string[]
  startTime?: string | null
  timer?: number | null
  parent_task?: number | Task | null
  completed_subtasks?: number | null
  total_subtasks?: number | null
  status?: Status | null
  is_repeated?: boolean | null
}

const payload = await getPayload({ config })
const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL

export async function getFields() {
  const response = await payload.find({ collection: 'fields' })
  return response.docs
}

export async function getTasks(
  filters: Where = {},
  sort: string = '-updatedAt',
  page: number = 0,
  limit: number = 5,
): Promise<{
  tasks: Task[]
  totalPages: number
  totalDocs: number
  hasPrevPage: boolean
  hasNextPage: boolean
}> {
  const response = await payload.find({
    collection: 'tasks',
    where: filters,
    sort,
    limit,
    page,
  })
  return {
    tasks: response.docs as Task[],
    totalPages: response.totalPages,
    totalDocs: response.totalDocs,
    hasPrevPage: response.hasPrevPage,
    hasNextPage: response.hasNextPage,
  }
}

export async function getTaskById(taskId: string): Promise<Task | null> {
  return (await payload.findByID({ collection: 'tasks', id: taskId })) as Task | null
}

export async function createTask(
  data: TaskProps,
): Promise<{ success: boolean; task?: Task; error?: string }> {
  try {
    const response = await payload.create({
      collection: 'tasks',
      data: data as unknown as Task,
    })
    return { success: true, task: response as Task }
  } catch (error) {
    console.error(error)
    return { success: false, error: error as string }
  }
}

export async function updateTask(
  taskId: string,
  data: Partial<Task>,
): Promise<{ success: boolean; task?: Task; error?: string }> {
  try {
    const response = await payload.update({ collection: 'tasks', id: taskId, data })
    return { success: true, task: response as Task }
  } catch (error) {
    console.error('Error updating task:', error)
    return { success: false, error: error as string }
  }
}

export async function deleteTask(taskId: string): Promise<void> {
  await payload.delete({ collection: 'tasks', id: taskId })
}

export async function getTasksREST(
  filters: Where = {},
  sort: string = '-updatedAt',
  page: number = 1,
  limit: number = 5,
) {
  const queryParams = {
    depth: 1,
    locale: 'en',
    where: filters,
    sort,
    page,
    limit,
  }

  const searchParams = qs.stringify(queryParams, { encode: true })
  const response = await fetch(`${process.env.NEXT_SERVER_URL}/api/tasks?${searchParams}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Accept-Language': 'en',
    },
  })

  if (!response.ok) {
    const errorData = await response.json()
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
