import type { Block } from 'payload'

export const BlockMetadata: Block = {
  slug: 'block-metadata',
  interfaceName: 'Block Meta Data',
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'emoji', type: 'text', defaultValue: '🌟' },
    { name: 'importance', type: 'number', min: 0, max: 5 },
    { name: 'rating', type: 'number', min: 0, max: 5 },
    { name: 'feedback', type: 'textarea' },
  ],
}
