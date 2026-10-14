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
    const SHARED =
        "https://images-stg.mimmiflowers.se/wreaths/bands/s/redbands.webp";
    const MOSS =
        "https://images-stg.mimmiflowers.se/wreaths/bands/m/red-moss.webp";
    const options = {
        ...OPTIONS,
        bands: [
            {
                ...OPTIONS.bands[0]!,
                sizeImages: { s: SHARED, m: { moss: MOSS } },
            },
        ],
    };

    it("uses a size's shared picture for every material", () => {
        expect(bandOverlay(options, "red-velvet", "s", "fir")).toEqual({
            href: SHARED,
            perMaterial: false,
        });
        expect(bandOverlay(options, "red-velvet", "s", "moss")?.href).toBe(
            SHARED,
        );
    });

    it("uses the picture made for the material when the size has one per material", () => {
        expect(bandOverlay(options, "red-velvet", "m", "moss")).toEqual({
            href: MOSS,
            perMaterial: true,
        });
    });

    it("is null without a band, a picture for that size/material, or a known band", () => {
        expect(bandOverlay(options, null, "s", "fir")).toBeNull();
        expect(bandOverlay(options, "red-velvet", "m", "fir")).toBeNull();
        expect(bandOverlay(options, "red-velvet", "l", "fir")).toBeNull();
        expect(bandOverlay(options, "nope", "s", "fir")).toBeNull();
    });
});
