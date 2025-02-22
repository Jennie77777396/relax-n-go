import type { CollectionConfig } from "payload";

export const Ratings: CollectionConfig = {
    slug: 'ratings',
    admin: {
        useAsTitle: 'ratingValue',
    },
    fields: [
        { name: 'ratingValue', type: 'number', required: true, min: 0, max: 100 },
        { name: 'task', type: 'relationship', relationTo: 'tasks' },
        { name: 'comments', type: 'richText' },
      ],
}


