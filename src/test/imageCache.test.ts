import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
    isImageReady,
    preloadImage,
    resetImageCache,
} from "../components/WreathBuilder/imageCache";

/** Stand-in for window.Image: records every instance so a test can "finish" the download. */
class FakeImage {
    static created: FakeImage[] = [];
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;
    src = "";
    constructor() {
        FakeImage.created.push(this);
    }
}

describe("imageCache", () => {
    beforeEach(() => {
        resetImageCache();
        FakeImage.created = [];
        vi.stubGlobal("Image", FakeImage);
    });
    afterEach(() => vi.unstubAllGlobals());

    it("is not ready until the browser has the image", async () => {
        const done = preloadImage("https://img.test/a.webp");
        expect(isImageReady("https://img.test/a.webp")).toBe(false);
        FakeImage.created[0]!.onload!();
        await done;
        expect(isImageReady("https://img.test/a.webp")).toBe(true);
    });

    it("downloads each URL once, however often it is asked for", () => {
        void preloadImage("https://img.test/a.webp");
        void preloadImage("https://img.test/a.webp");
        expect(FakeImage.created).toHaveLength(1);
        expect(FakeImage.created[0]!.src).toBe("https://img.test/a.webp");
    });

    it("counts a failed download as settled so a placeholder never spins forever", async () => {
        const done = preloadImage("https://img.test/missing.webp");
        FakeImage.created[0]!.onerror!();
        await done;
        expect(isImageReady("https://img.test/missing.webp")).toBe(true);
    });

    it("treats an empty URL as ready", () => {
        expect(isImageReady("")).toBe(true);
    });
});
