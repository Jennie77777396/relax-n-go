import type { CollectionConfig } from 'payload'

export const Tasks: CollectionConfig = {
  slug: 'tasks',
  timestamps: true,
  access: {
    read: () => true,
    update: () => true,
    create: () => true,
    delete: () => true,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'emoji', type: 'text', defaultValue: '🌟', required: true },

    { name: 'importance', type: 'number', min: 0, max: 5 },
    { name: 'rating', type: 'number', min: 0, max: 5 },
    { name: 'content', type: 'textarea' },
    { name: 'feedback', type: 'textarea' },
    { name: 'tags', type: 'relationship', relationTo: 'tags', hasMany: true },
    { name: 'fields', type: 'relationship', relationTo: 'fields', hasMany: true },
    { name: 'status', type: 'number', min: 0, max: 1, defaultValue: 0, required: true },
    { name: 'startTime', type: 'date' },
    { name: 'timer', type: 'number', defaultValue: 0, required: true },
    { name: 'is_running', type: 'checkbox', defaultValue: false },
    { name: 'success_attempts', type: 'number', min: 0, required: true, defaultValue: 0 },
    { name: 'total_attempts', type: 'number', min: 0, required: true, defaultValue: 0 },
    { name: 'parent_task', type: 'relationship', relationTo: 'tasks' },
    { name: 'completed_subtasks', type: 'number', defaultValue: 0 },
    { name: 'total_subtasks', type: 'number', defaultValue: 0 },
    { name: 'is_repeated', type: 'checkbox', defaultValue: false },
  ],
}
