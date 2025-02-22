import type { CollectionConfig } from 'payload'
import { colorOptions } from '@/types/color'

export const Tags: CollectionConfig = {
  slug: 'tags',
  admin: {
    useAsTitle: 'title',
  },

  fields: [
    { name: 'question', type: 'text', required: true },
    { name: 'answer', type: 'richText', required: true },
    { name: 'task', type: 'relationship', relationTo: 'tasks', hasMany: false },
    { name: 'success-attempts', type: 'number', required: true, defaultValue: 0 },
    { name: 'total-attempts', type: 'number', required: true, defaultValue: 0 },
  ],
}
