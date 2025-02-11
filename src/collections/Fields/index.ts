import { colorOptions } from '@/types/color'
import type { CollectionConfig } from 'payload'

export const Fields: CollectionConfig = {
  slug: 'fields',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'color', type: 'select', options: colorOptions, required: true, defaultValue: 'slate' },
  ],
}
