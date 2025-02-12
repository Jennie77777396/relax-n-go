'use server'

import { Task } from '@/payload-types'
import { PaginatedDocs } from 'payload'
import { SearchParamType } from './types'
import { getPayload } from 'payload'
import config from '@/payload.config'

const payload = await getPayload({ config })

export const findTasks = async function (
  searchParam: SearchParamType,
): Promise<PaginatedDocs<Task>> {
  console.log('searchParam', searchParam)
  try {
    const result = await payload.find({
      collection: 'tasks',
      limit: 3,
      page: searchParam.pages.page,
    })
    console.log('result ', result)
    return result
  } catch (e) {
    console.log(e)
    return {
      docs: [],
      totalDocs: 0,
      limit: 10,
      totalPages: 0,
      page: 1,
      pagingCounter: 1,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null,
    }
  }
}
