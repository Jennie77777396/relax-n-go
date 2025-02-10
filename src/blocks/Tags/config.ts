import type { Block } from "payload";
import { colorOptions} from "@/blocks/Color/config";


export const Tags: Block = {
    slug: "tags",
    interfaceName: "Tags",
    fields: [
        {
            name: "tags",
            type: "text",
        },
        {
            name: "color",
            type: "select",
            options: colorOptions,
        },
        {
            name: "emoji",
            type: "text",
        },
    ],
}


