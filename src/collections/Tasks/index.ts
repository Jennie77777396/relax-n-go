import type { CollectionConfig } from "payload";

export const Tasks: CollectionConfig = {
    slug: 'tasks',
    fields: [
      { name: 'taskName', type: 'text', required: true },
      { name: 'taskEmoji', type: 'text' },
      { name: 'status', type: 'select', options: ['Not Started', 'In Progress', 'Completed'], required: true },
      { name: 'feedback', type: 'text' },
      { name: 'tags', type: 'relationship', relationTo: 'tags', hasMany: true },
      { name: 'rating', type: 'relationship', relationTo: 'ratings', hasMany: true },
      { name: 'totalMinutesSpent', type: 'number', defaultValue: 0 },
      { name: 'field', type: 'relationship', relationTo: 'fields', hasMany: true },
      { name: 'successTimes', type: 'number', defaultValue: 0 },
      { name: 'totalTimes', type: 'number', defaultValue: 0 },
    ],
  };
  

