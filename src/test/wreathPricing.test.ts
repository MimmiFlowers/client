import { describe, it, expect } from "vitest";
import { priceDesign } from "../components/WreathBuilder/wreathPricing";
import { OPTIONS } from "./wreathFixtures";

describe("priceDesign", () => {
    it("adds base, band and every placement", () => {
        const price = priceDesign(
            {
                sizeCode: "m",
                materialCode: "moss",
                bandCode: "red-velvet",
                placements: [
                    "pine-cone",
                    null,
                    "star",
                    "pine-cone",
                    null,
                    null,
                    null,
                    null,
                ],
            },
            OPTIONS,
        );
        expect(price).toEqual({
            base: 449,
            band: 49,
            decorations: 55,
            total: 553,
        });
    });

    it("charges nothing for the band when none is chosen", () => {
        const price = priceDesign(
            {
                sizeCode: "s",
                materialCode: "fir",
                bandCode: null,
                placements: ["star", null, null, null, null, null],
            },
            OPTIONS,
        );
        expect(price).toEqual({
            base: 299,
            band: 0,
            decorations: 25,
            total: 324,
        });
    });

    it("rounds the total to öre rather than leaking float noise", () => {
        const price = priceDesign(
            {
                sizeCode: "s",
                materialCode: "fir",
                bandCode: "red-velvet",
                placements: ["pine-cone", "pine-cone", "pine-cone"],
            },
            {
                ...OPTIONS,
                basePrices: { s: { fir: 299.5 } },
                bands: [{ ...OPTIONS.bands[0]!, price: 49.9 }],
                decorations: [{ ...OPTIONS.decorations[0]!, price: 15.1 }],
            },
        );
        expect(price.total).toBe(394.7);
    });

    it("treats unknown codes as 0 rather than NaN", () => {
        const price = priceDesign(
            {
                sizeCode: "xl",
                materialCode: "fir",
                bandCode: "nope",
                placements: ["ghost"],
            },
            OPTIONS,
        );
        expect(price.total).toBe(0);
    });
});
