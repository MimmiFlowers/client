import { describe, it, expect } from "vitest";
import {
    initialDesign,
    toSpec,
    wreathReducer,
} from "../components/WreathBuilder/wreathReducer";
import { OPTIONS } from "./wreathFixtures";

describe("wreathReducer", () => {
    it("starts with the first size and material, no band, empty slots", () => {
        const d = initialDesign(OPTIONS);
        expect(d.sizeCode).toBe("s");
        expect(d.materialCode).toBe("fir");
        expect(d.bandCode).toBeNull();
        expect(d.placements).toEqual([null, null, null, null, null, null]);
    });

    it("places, replaces and clears a slot", () => {
        let d = initialDesign(OPTIONS);
        d = wreathReducer(d, { type: "place", slot: 2, code: "pine-cone" });
        expect(d.placements[2]).toBe("pine-cone");
        d = wreathReducer(d, { type: "place", slot: 2, code: "star" });
        expect(d.placements[2]).toBe("star");
        d = wreathReducer(d, { type: "clearSlot", slot: 2 });
        expect(d.placements[2]).toBeNull();
    });

    it("ignores placements outside the slot range", () => {
        const d = initialDesign(OPTIONS);
        expect(wreathReducer(d, { type: "place", slot: 6, code: "star" })).toBe(
            d,
        );
        expect(
            wreathReducer(d, { type: "place", slot: -1, code: "star" }),
        ).toBe(d);
    });

    it("grows the slot list on a larger size and keeps placements", () => {
        let d = wreathReducer(initialDesign(OPTIONS), {
            type: "place",
            slot: 5,
            code: "star",
        });
        d = wreathReducer(d, { type: "setSize", code: "m", slotCount: 8 });
        expect(d.sizeCode).toBe("m");
        expect(d.placements).toHaveLength(8);
        expect(d.placements[5]).toBe("star");
        expect(d.dropped).toBe(0);
    });

    it("drops placements that no longer fit on a smaller size and counts them", () => {
        let d = initialDesign(OPTIONS);
        d = wreathReducer(d, { type: "setSize", code: "m", slotCount: 8 });
        d = wreathReducer(d, { type: "place", slot: 1, code: "star" });
        d = wreathReducer(d, { type: "place", slot: 6, code: "pine-cone" });
        d = wreathReducer(d, { type: "place", slot: 7, code: "pine-cone" });
        d = wreathReducer(d, { type: "setSize", code: "s", slotCount: 6 });
        expect(d.placements).toEqual([null, "star", null, null, null, null]);
        expect(d.dropped).toBe(2);
    });

    it("is a no-op when the same size is chosen again", () => {
        const d = wreathReducer(initialDesign(OPTIONS), {
            type: "place",
            slot: 0,
            code: "star",
        });
        expect(
            wreathReducer(d, { type: "setSize", code: "s", slotCount: 6 }),
        ).toBe(d);
    });

    it("ignores clearSlot outside the slot range", () => {
        const d = initialDesign(OPTIONS);
        expect(wreathReducer(d, { type: "clearSlot", slot: 6 })).toBe(d);
        expect(wreathReducer(d, { type: "clearSlot", slot: -1 })).toBe(d);
    });

    it("sets and unsets the band and material", () => {
        let d = wreathReducer(initialDesign(OPTIONS), {
            type: "setBand",
            code: "red-velvet",
        });
        expect(d.bandCode).toBe("red-velvet");
        d = wreathReducer(d, { type: "setBand", code: null });
        expect(d.bandCode).toBeNull();
        d = wreathReducer(d, { type: "setMaterial", code: "moss" });
        expect(d.materialCode).toBe("moss");
    });

    it("serialises to the API spec with 0-based slots, skipping empty ones", () => {
        let d = wreathReducer(initialDesign(OPTIONS), {
            type: "setBand",
            code: "red-velvet",
        });
        d = wreathReducer(d, { type: "place", slot: 0, code: "pine-cone" });
        d = wreathReducer(d, { type: "place", slot: 4, code: "star" });
        expect(toSpec(d)).toEqual({
            sizeCode: "s",
            materialCode: "fir",
            bandCode: "red-velvet",
            decorations: [
                { slot: 0, code: "pine-cone" },
                { slot: 4, code: "star" },
            ],
        });
    });
});
