import type { Block } from "payload";

export const Timer: Block = {
    slug: "timer",
    interfaceName: "Timer",
    fields: [
        {name: 'startTime', type: 'date'},
        {name: 'timer', type: 'number', defaultValue: 0}
    ]
};

