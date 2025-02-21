import { getPayload } from 'payload'
import config from '@/payload.config'

const payload = await getPayload({ config })

export const Actions = {
  /** ================== 📝 TASK CRUD ================== **/

  async getTasks(filters = {}, sort = 'createdAt', order = 'desc', limit = 10) {
    return await payload.find({
      collection: 'tasks',
      where: filters,
      sort: order === 'desc' ? `-${sort}` : sort,
      limit,
    })
  },

  async getTaskById(taskId: string) {
    return await payload.findByID({
      collection: 'tasks',
      id: taskId,
    })
  },

  async createTask(data: any) {
    return await payload.create({
      collection: 'tasks',
      data,
    })
  },

  async updateTask(taskId: string, data: any) {
    return await payload.update({
      collection: 'tasks',
      id: taskId,
      data,
    })
  },

  async deleteTask(taskId: string) {
    return await payload.delete({
      collection: 'tasks',
      id: taskId,
    })
  },

  /** ================== 🔍 TASK FILTERS ================== **/
  async filterTasks({
    createdAt,
    updatedAt,
    importance,
    rating,
    tag,
    timer,
    completed_subtasks,
    total_subtasks,
    sort = 'createdAt',
    order = 'desc',
    limit = 10,
  }) {
    const filters: any = {}
    if (createdAt) filters.createdAt = { greater_than: createdAt }
    if (updatedAt) filters.updatedAt = { greater_than: updatedAt }
    if (importance) filters.importance = { equals: importance }
    if (rating) filters.rating = { equals: rating }
    if (tag) filters['tags.tag'] = { contains: tag } // Search inside tags array
    if (timer) filters.timer = { greater_than: timer }
    if (completed_subtasks) filters.completed_subtasks = { greater_than: completed_subtasks }
    if (total_subtasks) filters.total_subtasks = { greater_than: total_subtasks }

    return await this.getTasks(filters, sort, order, limit)
  },

  /** ================== 📚 KNOWLEDGE CRUD ================== **/

  async getKnowledge(filters = {}, sort = 'createdAt', order = 'desc', limit = 10) {
    return await payload.find({
      collection: 'knowledge',
      where: filters,
      sort: { [sort]: order },
      limit,
    })
  },

  async getKnowledgeById(knowledgeId: string) {
    return await payload.findByID({
      collection: 'knowledge',
      id: knowledgeId,
    })
  },

  async createKnowledge(data: any) {
    return await payload.create({
      collection: 'knowledge',
      data,
    })
  },

  async updateKnowledge(knowledgeId: string, data: any) {
    return await payload.update({
      collection: 'knowledge',
      id: knowledgeId,
      data,
    })
  },

  async deleteKnowledge(knowledgeId: string) {
    return await payload.delete({
      collection: 'knowledge',
      id: knowledgeId,
    })
  },

  /** ================== 🔍 KNOWLEDGE FILTERS ================== **/
  async filterKnowledge({
    createdAt,
    updatedAt,
    importance,
    rating,
    tag,
    timer,
    sort = 'createdAt',
    order = 'desc',
    limit = 10,
  }) {
    const filters: any = {}
    if (createdAt) filters.createdAt = { greater_than: createdAt }
    if (updatedAt) filters.updatedAt = { greater_than: updatedAt }
    if (importance) filters.importance = { equals: importance }
    if (rating) filters.rating = { equals: rating }
    if (tag) filters['tags.tag'] = { contains: tag }
    if (timer) filters.timer = { greater_than: timer }

    return await this.getKnowledge(filters, sort, order, limit)
  },
}
