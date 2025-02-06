import type { CollectionConfig } from "payload";
import { Task } from "@/blocks/Tasks/config";
export const FullStackKnowledge: CollectionConfig = {
    slug: "full-stack-knowledge",
    fields: [
        
        {
            name: "tasks",
            type: "blocks",
            blocks: [Task],
        }
    ]
}