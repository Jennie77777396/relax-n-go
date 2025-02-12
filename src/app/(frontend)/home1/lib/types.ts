import { Task } from '@/payload-types'

export interface PaginationType {
  limit: number
  page: number
}
export const defaultPaginationType = {
  limit: 10,
  page: 1,
}
export interface SearchType extends Partial<Task> {
  title: string
}
export interface SearchParamType {
  pages: PaginationType
  search: SearchType
}
