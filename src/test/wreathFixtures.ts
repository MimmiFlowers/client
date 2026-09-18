import type { WreathOptions } from "../components/WreathBuilder/types";

export const OPTIONS: WreathOptions = {
    sizes: [
        { code: "s", name: "Small", diameterCm: 25, slotCount: 6 },
        { code: "m", name: "Medium", diameterCm: 35, slotCount: 8 },
    ],
    materials: [
        { code: "fir", name: "Fir", image: "/wreath/base-fir.svg" },
        { code: "moss", name: "Moss", image: "/wreath/base-moss.svg" },
    ],
    basePrices: { s: { fir: 299, moss: 349 }, m: { fir: 399, moss: 449 } },
    bands: [
        {
            code: "red-velvet",
            name: "Red velvet",
            image: "/wreath/band-red-velvet.svg",
            price: 49,
        },
    ],
    decorations: [
        {
            code: "pine-cone",
            name: "Pine cone",
            image: "/wreath/deco-pine-cone.svg",
            price: 15,
        },
        {
            code: "star",
            name: "Star",
            image: "/wreath/deco-star.svg",
            price: 25,
        },
    ],
};
