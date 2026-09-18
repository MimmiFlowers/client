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
                dropped: 0,
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

    it("treats unknown codes as 0 rather than NaN", () => {
        const price = priceDesign(
            {
                sizeCode: "xl",
                materialCode: "fir",
                bandCode: "nope",
                placements: ["ghost"],
                dropped: 0,
            },
            OPTIONS,
        );
        expect(price.total).toBe(0);
    });
});
