'use server'

import { Where } from 'payload'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Task } from '@/payload-types'
import { Status } from '@/types/status'

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

export async function getFields() {
  const response = await payload.find({ collection: 'fields' })
  return response.docs
}

export async function getTasks(
  filters: Where = {},
  sort: string = '-createdAt',
  page: number = 0,
  limit: number = 5,
): Promise<{
  tasks: Task[]
  totalPages: number
  totalDocs: number
  hasPrevPage: boolean
  hasNextPage: boolean
}> {
  console.log('filters: ', JSON.stringify(filters, null, 2))
  const response = await payload.find({
    collection: 'tasks',
    where: filters,
    sort,
    limit,
    page,
  })
  console.log('local api find all tasks:', response)
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
    const response = await payload.create({ collection: 'tasks', data: data as Task })
    if (data.tags) {
      await Promise.all(
        data.tags.map(async (tagId) => {
          if (!tagId) return
          const tag = await payload.findByID({ collection: 'tags', id: tagId.toString() })

          if (tag) {
            await payload.update({
              collection: 'tags',
              id: tagId.toString(),
              data: { tasks: [...(tag.tasks || []), response.id] },
            })
          }
        }),
      )
    }

    if (data.fields) {
      await Promise.all(
        data.fields.map(async (fieldId) => {
          if (!fieldId) return
          const field = await payload.findByID({ collection: 'fields', id: fieldId.toString() })

          if (field) {
            await payload.update({
              collection: 'fields',
              id: fieldId.toString(),
              data: { tasks: [...(field.tasks || []), response.id] },
            })
          }
        }),
      )
    }
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
