import { FindArgs, PaginatedDocs, Payload, TypedLocale } from 'payload'
import { Task, TasksSelect, Config } from '@/payload-types'
import payload from 'payload'
export type TaskDocs = PaginatedDocs<Task>
export type TaskSelect = Partial<TasksSelect<true>>
export type TaskFindArgs = Partial<Omit<FindArgs, 'collection'>> & { locale: 'all' | TypedLocale }
export const findTasks = async (option: TaskFindArgs): Promise<PaginatedDocs<Task>> => {
  const res = await payload.find({
    ...option,
    collection: 'tasks',
  })

  return res as PaginatedDocs<Task>
}
