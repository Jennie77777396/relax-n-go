import { colorOptions } from "@/blocks/Color/config";
import type { CollectionConfig } from "payload";

export const Fields: CollectionConfig = {
    slug: 'fields',
    admin: {
        useAsTitle: 'fieldName',
    },
    fields: [
      { name: 'fieldName', type: 'text', required: true },
      { name: 'color', type: 'select', options: colorOptions },
      { name: 'tasks', type: 'relationship', relationTo: 'tasks', hasMany: true },
      { name: 'totalMinutesSpent', type: 'number' },

    ],

  };
  


