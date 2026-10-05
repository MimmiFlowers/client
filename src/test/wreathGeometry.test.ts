import { describe, it, expect } from "vitest";
import {
    CENTER,
    decorationSize,
    markerRadius,
    nearestSlot,
    ringForSize,
    ringSize,
    slotPositions,
    slotRadius,
} from "../components/WreathBuilder/wreathGeometry";
import { OPTIONS } from "./wreathFixtures";

describe("wreathGeometry", () => {
    it("spreads slots evenly on the ring, none exactly at the top (under the bow)", () => {
        const points = slotPositions(4, 100);
        expect(points).toHaveLength(4);
        for (const p of points) {
            expect(Math.hypot(p.x - CENTER, p.y - CENTER)).toBeCloseTo(100, 5);
        }
        // first slot is 45° clockwise from the top: upper-right
        expect(points[0]!.x).toBeGreaterThan(CENTER);
        expect(points[0]!.y).toBeLessThan(CENTER);
        expect(points[0]!.x).toBeCloseTo(CENTER + 100 * Math.SQRT1_2, 5);
    });

    it("returns the nearest slot within the radius, else null", () => {
        const points = slotPositions(4, 100);
        expect(
            nearestSlot(
                points,
                { x: points[2]!.x + 5, y: points[2]!.y - 5 },
                40,
            ),
        ).toBe(2);
        expect(nearestSlot(points, { x: CENTER, y: CENTER }, 40)).toBeNull();
    });

    it("counts a point exactly at maxDistance but not one past it", () => {
        const points = slotPositions(4, 100);
        expect(
            nearestSlot(points, { x: points[1]!.x + 40, y: points[1]!.y }, 40),
        ).toBe(1);
        expect(
            nearestSlot(points, { x: points[1]!.x + 41, y: points[1]!.y }, 40),
        ).toBeNull();
    });

    it("returns null when there are no slots", () => {
        expect(nearestSlot([], { x: 0, y: 0 }, 40)).toBeNull();
    });

    it("scales the ring from 84% to 100% across sizes", () => {
        expect(ringSize(0, 3)).toBeCloseTo(360 * 0.84);
        expect(ringSize(2, 3)).toBe(360);
        expect(ringSize(0, 1)).toBe(360);
    });

    it("maps a size code to its ring, falling back to the first size", () => {
        expect(ringForSize(OPTIONS.sizes, "m")).toBe(ringSize(1, 2));
        expect(ringForSize(OPTIONS.sizes, "nope")).toBe(ringSize(0, 2));
    });

    it("draws decorations at their true size against the base photo", () => {
        // 350 px decoration on a 36 px/cm base: 900 / 1260 / 1800 px for 25 / 35 / 50 cm.
        expect(decorationSize(360 * 0.84, 25)).toBeCloseTo((302.4 * 350) / 900);
        expect(decorationSize(360 * 0.92, 35)).toBeCloseTo((331.2 * 350) / 1260);
        expect(decorationSize(360, 50)).toBeCloseTo(70);
    });

    it("puts the slot circle on the middle line of the ring", () => {
        // Measured on the real small fir base: 280 of 900 px from the centre.
        expect(slotRadius(900)).toBeCloseTo(280, 0);
    });

    it("sizes empty-slot markers to the visible decoration, not its whole canvas", () => {
        expect(markerRadius(100)).toBe(29); // half of the canvas is visible, + 4 margin
        // Large (12 slots): neighbouring markers must not touch.
        const ring = 360;
        const points = slotPositions(12, slotRadius(ring));
        const gap = Math.hypot(
            points[1]!.x - points[0]!.x,
            points[1]!.y - points[0]!.y,
        );
        expect(2 * markerRadius(decorationSize(ring, 50))).toBeLessThan(gap);
    });
});
