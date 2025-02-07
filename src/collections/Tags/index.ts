import type { CollectionConfig } from "payload";
import { colorOptions } from "@/blocks/Color/config";

export const Tags: CollectionConfig = {
    slug: 'tags',
    admin: {
        useAsTitle: 'tagName',
    },
    fields: [
        { name: 'tagName', type: 'text', required: true, unique: true },
        { name: 'description', type: 'text' },
            { name: 'emoji', type: 'text' },
            { name: 'color', type: 'select', options: colorOptions },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
}