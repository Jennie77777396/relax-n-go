import type { CollectionConfig } from "payload";

export const Tags: CollectionConfig = {
    slug: 'tags',
    admin: {
        useAsTitle: 'tagName',
    },
    fields: [
        { name: 'tagName', type: 'text', required: true, unique: true },
        { name: 'description', type: 'text' },

        { name: 'emoji', type: 'text' },
        { name: 'color', type: 'text' },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
}