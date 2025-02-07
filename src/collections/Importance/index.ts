import type { CollectionConfig } from 'payload';

export const Importance: CollectionConfig = {
  slug: 'importance',
  admin: {
    useAsTitle: 'importanceValue', // Use the importanceValue as the title in the admin UI
  },
  fields: [
    {
      name: 'importanceValue',
      type: 'select', 
      options: [
        { label: '0', value: '0' },
        { label: '1', value: '1' },
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
        { label: '5', value: '5' },
      ],

      required: true,
    },
    {
      name: 'task',
      type: 'relationship',
      relationTo: 'tasks', // Ensure this matches the slug of your Tasks collection
    },
  ],
};