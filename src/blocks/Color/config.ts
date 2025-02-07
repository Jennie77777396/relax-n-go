import { Block } from 'payload';

export const colorOptions = [
  'slate',
  'gray',
  'zinc',
  'neutral',
  'stone',
  'red',

  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
];

export const ColorSelectBlock: Block = {
  slug: 'color-select', // Unique slug for the block
  fields: [
    {
      name: 'color', 
      type: 'select', 
      options: colorOptions, 
      required: true, 
      defaultValue: 'slate', 
    },
  ],
};