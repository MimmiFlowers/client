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
        d = wreathReducer(d, {
            type: "setSize",
            code: "m",
            slotCount: 8,
            bandSlots: [1, 3, 5, 7],
        });
        expect(d.sizeCode).toBe("m");
        expect(d.placements).toHaveLength(8);
        expect(d.placements[5]).toBe("star");
        expect(d.dropped).toBe(0);
    });

    it("drops placements that no longer fit on a smaller size and counts them", () => {
        let d = initialDesign(OPTIONS);
        d = wreathReducer(d, {
            type: "setSize",
            code: "m",
            slotCount: 8,
            bandSlots: [1, 3, 5, 7],
        });
        d = wreathReducer(d, { type: "place", slot: 1, code: "star" });
        d = wreathReducer(d, { type: "place", slot: 6, code: "pine-cone" });
        d = wreathReducer(d, { type: "place", slot: 7, code: "pine-cone" });
        d = wreathReducer(d, {
            type: "setSize",
            code: "s",
            slotCount: 6,
            bandSlots: [1, 3, 5, 7],
        });
        expect(d.placements).toEqual([null, "star", null, null, null, null]);
        expect(d.dropped).toBe(2);
    });

    it("clears the dropped notice on the next non-size interaction", () => {
        let d = initialDesign(OPTIONS);
        d = wreathReducer(d, {
            type: "setSize",
            code: "m",
            slotCount: 8,
            bandSlots: [1, 3, 5, 7],
        });
        d = wreathReducer(d, { type: "place", slot: 7, code: "star" });
        d = wreathReducer(d, {
            type: "setSize",
            code: "s",
            slotCount: 6,
            bandSlots: [1, 3, 5, 7],
        });
        expect(d.dropped).toBe(1);
        d = wreathReducer(d, { type: "setBand", code: "red-satin" });
        expect(d.dropped).toBe(0);
    });

    it("is a no-op when the same size is chosen again", () => {
        const d = wreathReducer(initialDesign(OPTIONS), {
            type: "place",
            slot: 0,
            code: "star",
        });
        expect(
            wreathReducer(d, {
                type: "setSize",
                code: "s",
                slotCount: 6,
                bandSlots: [1, 3, 5, 7],
            }),
        ).toBe(d);
    });

    it("ignores clearSlot outside the slot range", () => {
        const d = initialDesign(OPTIONS);
        expect(wreathReducer(d, { type: "clearSlot", slot: 6 })).toBe(d);
        expect(wreathReducer(d, { type: "clearSlot", slot: -1 })).toBe(d);
    });

    it("clears every slot and the band, and restores both for undo", () => {
        let d = initialDesign(OPTIONS);
        d = wreathReducer(d, { type: "setBand", code: "red-satin" });
        d = wreathReducer(d, { type: "place", slot: 2, code: "star" });
        d = wreathReducer(d, { type: "place", slot: 4, code: "pine-cone" });
        const before = { placements: d.placements, bandCode: d.bandCode };
        d = wreathReducer(d, { type: "clearAll" });
        expect(d.placements).toEqual([null, null, null, null, null, null]);
        expect(d.bandCode).toBeNull();
        d = wreathReducer(d, { type: "restore", ...before });
        expect(d.placements).toEqual(before.placements);
        expect(d.bandCode).toBe("red-satin");
    });

    it("fits restored placements to the current slot count", () => {
        const d = initialDesign(OPTIONS);
        const eight = [null, "star", null, null, null, null, null, "berries"];
        expect(
            wreathReducer(d, {
                type: "restore",
                placements: eight,
                bandCode: null,
            }).placements,
        ).toEqual([null, "star", null, null, null, null]);
        expect(
            wreathReducer(d, {
                type: "restore",
                placements: ["star"],
                bandCode: null,
            }).placements,
        ).toEqual(["star", null, null, null, null, null]);
    });

    it("sets and unsets the band and material", () => {
        let d = wreathReducer(initialDesign(OPTIONS), {
            type: "setBand",
            code: "red-satin",
        });
        expect(d.bandCode).toBe("red-satin");
        d = wreathReducer(d, { type: "setBand", code: null });
        expect(d.bandCode).toBeNull();
        d = wreathReducer(d, { type: "setMaterial", code: "moss" });
        expect(d.materialCode).toBe("moss");
    });

    it("refuses a decoration on a slot under the band", () => {
        const d = wreathReducer(initialDesign(OPTIONS), {
            type: "setBand",
            code: "red-satin",
        });
        expect(wreathReducer(d, { type: "place", slot: 1, code: "star" })).toBe(
            d,
        );
    });

    it("slides decorations off the new band's wraps, dropping them when boxed in", () => {
        let d = initialDesign(OPTIONS);
        // 1 → 0 (free); 3 → 2 taken, so 4; 5 → 4 and 0 (wrapping round) both taken: dropped.
        for (const [slot, code] of [
            [1, "star"],
            [2, "pine-cone"],
            [3, "star"],
            [5, "pine-cone"],
        ] as const)
            d = wreathReducer(d, { type: "place", slot, code });
        d = wreathReducer(d, { type: "setBand", code: "red-satin" });
        expect(d.placements).toEqual([
            "star",
            null,
            "pine-cone",
            null,
            "star",
            null,
        ]);
        expect(d.dropped).toBe(1);
        expect(d.droppedBy).toBe("band");
    });

    it("moves the band to the new size's slots when the size changes", () => {
        let d = wreathReducer(initialDesign(OPTIONS), {
            type: "setBand",
            code: "red-satin",
        });
        d = wreathReducer(d, { type: "place", slot: 2, code: "star" });
        d = wreathReducer(d, { type: "place", slot: 4, code: "pine-cone" });
        // Step 3 covers 1, 4, 7: the pine cone slides to slot 3 (slot 2 is taken).
        d = wreathReducer(d, {
            type: "setSize",
            code: "m",
            slotCount: 9,
            bandSlots: [1, 4, 7],
        });
        expect(d.bandSlots).toEqual([1, 4, 7]);
        expect(d.placements).toEqual([
            null,
            null,
            "star",
            "pine-cone",
            null,
            null,
            null,
            null,
            null,
        ]);
        expect(d.dropped).toBe(0);
        expect(wreathReducer(d, { type: "place", slot: 7, code: "star" })).toBe(
            d,
        );
    });

    it("keeps covered slots empty when undoing Clear all under a band", () => {
        const d = wreathReducer(initialDesign(OPTIONS), {
            type: "restore",
            placements: ["star", "star", "star", null, null, null],
            bandCode: "red-satin",
        });
        expect(d.placements).toEqual(["star", null, "star", null, null, null]);
    });

    it("serialises to the API spec with 0-based slots, skipping empty ones", () => {
        let d = wreathReducer(initialDesign(OPTIONS), {
            type: "setBand",
            code: "red-satin",
        });
        d = wreathReducer(d, { type: "place", slot: 0, code: "pine-cone" });
        d = wreathReducer(d, { type: "place", slot: 4, code: "star" });
        expect(toSpec(d)).toEqual({
            sizeCode: "s",
            materialCode: "fir",
            bandCode: "red-satin",
            decorations: [
                { slot: 0, code: "pine-cone" },
                { slot: 4, code: "star" },
            ],
        });
    });
});
