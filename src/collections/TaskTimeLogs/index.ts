// collections/TaskTimeLogs.ts
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
    },
  ],
}
