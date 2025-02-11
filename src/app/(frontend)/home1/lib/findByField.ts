import { Task } from '@/payload-types'
import type { TaskDocs } from '@/actions/home/tasks-find'
import payload from 'payload'
export interface paginationType {
  [key: number]: {
    limit: number
    page: number
  }
}
export const defaultPaginationType = {
  limit: 10,
  page: 1,
}
export interface SearchType extends Partial<Task> {
  title: string
}
export interface SearchParamType {
  pages: paginationType
  search: SearchType
}

export const findTasks = async (): Promise<TaskDocs[]> => {
  const resFields = payload.find({
    collection: 'fields',
  })

  return []
}
