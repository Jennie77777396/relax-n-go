///import { randomUUID } from 'crypto'
import type { CollectionConfig } from 'payload'

export const Roles: CollectionConfig = {
  slug: 'roles',
  access: {
    read: () => true,
    create: () => true,
    delete: () => true,
    update: () => true,
  },
  fields: [
    {
      name: 'id',
      type: 'text',
      defaultValue: () => {
        return `role-id-${Math.random().toString(36).substring(2, 9)}`
      },
    },
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'description',
      type: 'text',
      required: false,
    },
    {
      name: 'permissions',
      type: 'relationship',
      relationTo: 'permissions',
      required: false,
      hasMany: true,
    },
  ],
  timestamps: true,
}
