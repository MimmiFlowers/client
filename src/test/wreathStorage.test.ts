import { afterEach, describe, expect, it, vi } from "vitest";
import {
    DESIGN_STORAGE_KEY,
    loadDesign,
    saveDesign,
} from "../components/WreathBuilder/wreathStorage";
import {
    initialDesign,
    wreathReducer,
} from "../components/WreathBuilder/wreathReducer";
import { OPTIONS } from "./wreathFixtures";

const DAY = 24 * 60 * 60 * 1000;

const store = (value: object) =>
    localStorage.setItem(DESIGN_STORAGE_KEY, JSON.stringify(value));

describe("wreathStorage", () => {
    afterEach(() => {
        localStorage.clear();
        vi.useRealTimers();
    });

    it("returns null when nothing is saved", () => {
        expect(loadDesign(OPTIONS)).toBeNull();
    });

    it("round-trips size, material, band and placements", () => {
        let d = initialDesign(OPTIONS);
        d = wreathReducer(d, {
            type: "setSize",
            code: "m",
            slotCount: 8,
            bandStep: 2,
        });
        d = wreathReducer(d, { type: "setMaterial", code: "moss" });
        d = wreathReducer(d, { type: "setBand", code: "red-velvet" });
        d = wreathReducer(d, { type: "place", slot: 2, code: "star" });
        saveDesign(d);
        const loaded = loadDesign(OPTIONS)!;
        expect(loaded.sizeCode).toBe("m");
        expect(loaded.materialCode).toBe("moss");
        expect(loaded.bandCode).toBe("red-velvet");
        expect(loaded.placements).toEqual(d.placements);
        expect(loaded.dropped).toBe(0);
    });

    it("forgets a design after 7 days without changes", () => {
        vi.useFakeTimers();
        saveDesign(initialDesign(OPTIONS));
        vi.setSystemTime(Date.now() + 8 * DAY);
        expect(loadDesign(OPTIONS)).toBeNull();
        expect(localStorage.getItem(DESIGN_STORAGE_KEY)).toBeNull();
    });

    it("skips retired options and keeps decorations off the band", () => {
        store({
            sizeCode: "xl",
            materialCode: "gold",
            bandCode: "red-velvet",
            placements: ["star", "star", "unicorn", null, null, null],
            updatedAt: Date.now(),
        });
        const loaded = loadDesign(OPTIONS)!;
        expect(loaded.sizeCode).toBe("s");
        expect(loaded.materialCode).toBe("fir");
        expect(loaded.bandCode).toBe("red-velvet");
        // slot 1 is under the band, "unicorn" no longer exists
        expect(loaded.placements).toEqual([
            "star",
            null,
            null,
            null,
            null,
            null,
        ]);
    });

    it("returns null for unreadable data", () => {
        localStorage.setItem(DESIGN_STORAGE_KEY, "{not json");
        expect(loadDesign(OPTIONS)).toBeNull();
    });
});
