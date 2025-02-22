import type { CollectionConfig } from 'payload'
import { colorOptions } from '@/types/color'

export const Tags: CollectionConfig = {
  slug: 'tags',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    { name: 'title', type: 'text', required: true, unique: true },
    { name: 'color', type: 'select', options: colorOptions, required: true, defaultValue: 'slate' },
  ],
}
