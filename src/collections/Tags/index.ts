import type { CollectionConfig } from 'payload'
import { colorOptions } from '@/types/color'

export const Tags: CollectionConfig = {
  slug: 'tags',
  admin: {
    useAsTitle: 'title',
  },

  fields: [
    { name: 'title', type: 'text', required: true, unique: true },
    { name: 'color', type: 'select', options: colorOptions, required: true, defaultValue: 'slate' },
  ],
}
