import type { CollectionConfig } from "payload";

export const Tasks: CollectionConfig = {
    slug: 'tasks',
    fields: [
      { name: 'taskName', type: 'text', required: true },
      { name: 'taskDescription', type: 'textarea' },
      { name: 'taskAnswer', type: 'textarea' },
      { name: 'taskEmoji', type: 'text' },
      { name: 'status', type: 'select', options: ['Not Started', 'In Progress', 'Completed'], required: true, defaultValue: 'Not Started' },
      { name: 'feedback', type: 'textarea' },
      { name: 'tags', type: 'relationship', relationTo: 'tags', hasMany: true },
      { name: 'rating', type: 'relationship', relationTo: 'ratings', hasMany: true },
      { name: 'totalMinutesSpent', type: 'number', defaultValue: 0 },
      { name: 'field', type: 'relationship', relationTo: 'fields', hasMany: true },
      { name: 'successAttempts', type: 'number', defaultValue: 0 },
      { name: 'totalAttempts', type: 'number', defaultValue: 0 },
      { name: 'importance', type: 'relationship', relationTo: 'importance', hasMany: true },
      { name: 'startTime', type: 'number', defaultValue: undefined }, 
      { name: 'isCounting', type: 'checkbox', defaultValue: false }, 
    ],
  };
  

