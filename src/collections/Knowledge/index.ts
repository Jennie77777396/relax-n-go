import type { CollectionConfig } from 'payload'
import { colorOptions } from '@/blocks/Color/config'

export const Knowledge: CollectionConfig = {
  slug: 'knowledge',
  timestamps: true,
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'emoji', type: 'text', defaultValue: '🌟' },
    { name: 'importance', type: 'number', min: 0, max: 5 },
    { name: 'rating', type: 'number', min: 0, max: 5 },
    { name: 'feedback', type: 'textarea' },
    {
      name: 'tags',
      type: 'array',
      fields: [
        { name: 'tag', type: 'text' },
        { name: 'color', type: 'select', options: colorOptions },
      ],
    },
    { name: 'startTime', type: 'date' },
    { name: 'timer', type: 'number', defaultValue: 0 },
    { name: 'answer', type: 'textarea', required: true },
    { name: 'view_count', type: 'number', defaultValue: 0 },
    { name: 'success_count', type: 'number', defaultValue: 0 },
  ],
}
