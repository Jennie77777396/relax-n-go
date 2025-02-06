import type { Block } from "payload";

export const Task: Block = {
    slug: "tasks",
    interfaceName: "TasksBlock",
    fields: [
        {
            name: "name",
            type: "text",
            required: true,
        },
        {
            name: "emoji",
            type: "text",
        },
        {
            name: "minutes",
            type: "number",
        },
        {
            name: "tags",
            type: "array",
            fields: [
                {
                    name: "tag",
                    type: "text",
                },
            ],
        },
        {
            name: "result",
            type:"radio",
            options: ["success", "failure"],
        },
        {
            name: "description",
            type: "text",
        },
        {
            name: "feedback",
            type:"text"
        }

    ]


}
