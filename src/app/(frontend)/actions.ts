'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { revalidatePath } from 'next/cache'
import type { Task } from '@/payload-types'

const payload = await getPayload({ config })

export async function getTasks() {
    const tasks = await payload.findByID({
        collection: 'full-stack-knowledge',
        id: '1',
    })
    console.log('Find By Id',JSON.stringify(tasks, null, 2))
    return tasks
}

export async function getTasks1() {
    const tasks = await payload.find({
        collection: 'tasks',
    })
    console.log('Find All',JSON.stringify(tasks, null, 2))
    return tasks
}

// Create a new task
export async function createTask(input: Task) {
  try {
    const task = await payload.create({
      collection: 'tasks',
      data: {
        taskName: input.taskName,
        taskEmoji: input.taskEmoji,
        status: input.status,
      },
    })

    revalidatePath('/home')
    return { success: true, data: task }
  } catch (error) {
    console.error('Error creating task:', error)
    return { success: false, error: 'Failed to create task' }
  }
}

// Update a task
export async function updateTask(id: number, data: Partial<Task>) {
  try {
    const task = await payload.update({
      collection: 'tasks',
      id,
      data,
    })
    console.log('Update Task',JSON.stringify(task, null, 2))
    revalidatePath('/home')
    return { success: true, data: task }
  } catch (error) {
    console.error('Error updating task:', error)
    return { success: false, error: 'Failed to update task' }
  }
}

// Delete a task
export async function deleteTask(id: number) {
  try {
    await payload.delete({
      collection: 'tasks',
      id,
    })

    revalidatePath('/home')
    return { success: true }
  } catch (error) {
    console.error('Error deleting task:', error)
    return { success: false, error: 'Failed to delete task' }
  }
}

