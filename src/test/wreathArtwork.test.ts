import { describe, it, expect } from "vitest";
import {
    bandOverlay,
    baseImage,
    chipImage,
} from "../components/WreathBuilder/wreathArtwork";
import { OPTIONS } from "./wreathFixtures";

const R2_SMALL_FIR = "https://images-stg.mimmiflowers.se/wreath/base-s-fir.png";

describe("baseImage", () => {
    it("uses the picture for the exact size and material", () => {
        expect(baseImage(OPTIONS, "s", "fir")).toBe(R2_SMALL_FIR);
    });

    it("falls back to the material image when that combination has none", () => {
        expect(baseImage(OPTIONS, "m", "fir")).toBe("/wreath/base-fir.svg");
        expect(baseImage(OPTIONS, "s", "moss")).toBe("/wreath/base-moss.svg");
    });

    it("returns an empty string for an unknown material", () => {
        expect(baseImage(OPTIONS, "s", "oak")).toBe("");
    });

    it("copes with a response that has no baseImages yet", () => {
        const older = { ...OPTIONS } as Partial<typeof OPTIONS>;
        delete older.baseImages;
        expect(baseImage(older as typeof OPTIONS, "s", "fir")).toBe(
            "/wreath/base-fir.svg",
        );
    });
});

describe("chipImage", () => {
    it("shows the smallest size (first in catalogue order) of each material", () => {
        expect(chipImage(OPTIONS, "fir")).toBe(R2_SMALL_FIR);
        expect(chipImage(OPTIONS, "moss")).toBe("/wreath/base-moss.svg");
    });
});

describe("bandOverlay", () => {
    it("returns the band's picture for that size", () => {
        expect(bandOverlay(OPTIONS, "red-velvet", "s")).toBe(
            "https://images-stg.mimmiflowers.se/wreaths/bands/s/redbands.webp",
        );
    });

    it("is null without a band, for a size with no picture or an unknown band", () => {
        expect(bandOverlay(OPTIONS, null, "s")).toBeNull();
        expect(bandOverlay(OPTIONS, "red-velvet", "m")).toBeNull();
        expect(bandOverlay(OPTIONS, "nope", "s")).toBeNull();
    });
});
