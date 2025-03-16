import type { CollectionConfig } from 'payload'

export const TaskTimeLogs: CollectionConfig = {
  slug: 'taskTimeLogs',
  timestamps: true,
  access: {
    read: () => true,
    update: () => true,
    create: () => true,
    delete: () => true,
  },
  admin: {
    useAsTitle: 'date',
  },
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        try {
          // Extract the single task ID
          let taskId = doc?.task

          // Validate taskId
          if (taskId && typeof taskId === 'object' && 'id' in taskId) {
            console.log(`[afterChange] Task is an object, extracting id: ${taskId.id}`)
            taskId = taskId.id
          }
          if (!taskId || typeof taskId !== 'number') {
            console.error(`[afterChange] Invalid taskId: ${taskId} (expected a number)`)
            return
          }

          // Fetch all logs for this task
          console.log(`[afterChange] Querying taskTimeLogs for task ID: ${taskId}`)
          const allLogs = await req.payload.find({
            collection: 'taskTimeLogs',
            where: { task: { equals: taskId } },
          })
          console.log(
            `[afterChange] Found ${allLogs.docs.length} logs for task ${taskId}:`,
            allLogs.docs.map((log) => ({
              id: log.id,
              seconds: log.seconds,
            })),
          )

          // Calculate total seconds
          const totalSeconds = allLogs.docs.reduce((sum, log) => sum + (log.seconds || 0), 0)
          console.log(`[afterChange] Calculated totalSeconds for task ${taskId}: ${totalSeconds}`)

          // Update the related task
          console.log(
            `[afterChange] Updating tasks collection with ID: ${taskId}, totalTimeSpent: ${totalSeconds}`,
          )
          await req.payload.update({
            collection: 'tasks',
            id: taskId.toString(),
            data: { total_spent: totalSeconds },
          })
          console.log(
            `[afterChange] Successfully updated task ${taskId} with totalTimeSpent: ${totalSeconds}`,
          )
        } catch (error) {
          console.error('[afterChange] Error updating totalTimeSpent:', error)
        }
      },
    ],
  },
  fields: [
    {
      name: 'task',
      type: 'relationship',
      relationTo: 'tasks',
      hasMany: false,
      required: true,
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: { date: { pickerAppearance: 'dayOnly' } },
    },
    {
      name: 'seconds',
      type: 'number',
      defaultValue: 0,
      required: true,
    },
    {
      name: 'title',
      type: 'text',
      admin: { hidden: true },
      access: { create: () => false, update: () => false },
      hooks: {
        beforeChange: [
          ({ data }) => {
            const taskValue = data?.task ? data.task.toString() : 'No Task'
            const dateValue = data?.date
              ? new Date(data.date).toISOString().split('T')[0]
              : 'No Dates'
            const generatedTitle = `${taskValue}-${dateValue}`.trim()
            return generatedTitle
          },
        ],
      },
    },
  ],
}
