import type { CollectionConfig } from "payload";

export const Time: CollectionConfig = {
    slug: 'time',
    fields: [
        { name: 'task', type: 'relationship', relationTo: 'tasks', required: true },
        { name: 'startTime', type: 'date', required: true },
        { name: 'endTime', type: 'date', required: true },
        { name: 'duration', type: 'number' }, 
      ],

}

