import type { WreathOptions } from "./types";
import type { WreathDesignState } from "./wreathReducer";

export interface WreathPrice {
    base: number;
    band: number;
    decorations: number;
    total: number;
}

/** Display-only running total in SEK. The server recomputes the real price. */
export const priceDesign = (
    design: WreathDesignState,
    options: WreathOptions,
): WreathPrice => {
    const base =
        options.basePrices[design.sizeCode]?.[design.materialCode] ?? 0;
    const band = design.bandCode
        ? (options.bands.find((b) => b.code === design.bandCode)?.price ?? 0)
        : 0;
    const priceByCode = new Map(
        options.decorations.map((d) => [d.code, d.price]),
    );
    const decorations = design.placements.reduce<number>(
        (sum, code) => sum + (code ? (priceByCode.get(code) ?? 0) : 0),
        0,
    );
    return { base, band, decorations, total: base + band + decorations };
};
