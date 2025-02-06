import type { Block } from "payload";

export const TagsBlock: Block = {
    slug: "tag",
    interfaceName: "Tag",
    fields: [
        {
            name: "name",
            type: "text",
        },
        {
            name: "color",
            type: "text",
        },
        {
            name: "emoji",
            type: "text",
        },
        {
            name: "tasks",
            type: "relationship",
            relationTo: "full-stack-knowledge",
            hasMany: true,
        }
    ],
}


