import type { CollectionConfig } from "payload";

export const Ratings: CollectionConfig = {
    slug: 'ratings',
    admin: {
        useAsTitle: 'ratingValue',
    },
    fields: [
        { name: 'ratingValue', type: 'number', required: true },
        { name: 'task', type: 'relationship', relationTo: 'tasks' },
        { name: 'comments', type: 'text' },
      ],
}


