import type { CollectionConfig } from 'payload'

export const Permissions: CollectionConfig = {
  slug: 'permissions',
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'value',
      type: 'select',
      options: [
        {
          label: 'read',
          value: 'read',
        },
        {
          label: 'admin',
          value: 'admin',
        },

        {
          label: 'edit',
          value: 'edit',
        },
        {
          label: 'super admin',
          value: 'super',
        },
      ],
    },
    {
      name: 'description',
      type: 'text',
    },
  ],
  timestamps: true,
}
