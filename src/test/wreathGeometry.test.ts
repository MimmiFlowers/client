import { describe, it, expect } from "vitest";
import {
    CENTER,
    artworkSize,
    decorationSize,
    isCovered,
    markerRadius,
    nearestSlot,
    openSlotCount,
    ringForSize,
    ringSize,
    slotAngle,
    slotGap,
    slotPositions,
    slotRadius,
} from "../components/WreathBuilder/wreathGeometry";
import { OPTIONS } from "./wreathFixtures";

describe("wreathGeometry", () => {
    it("spreads slots evenly on the ring, slot 0 at 12 o'clock", () => {
        const points = slotPositions(4, 100);
        expect(points).toHaveLength(4);
        for (const p of points) {
            expect(Math.hypot(p.x - CENTER, p.y - CENTER)).toBeCloseTo(100, 5);
        }
        expect(points[0]!.x).toBeCloseTo(CENTER, 5);
        expect(points[0]!.y).toBeCloseTo(CENTER - 100, 5);
        // clockwise: slot 1 is at 3 o'clock
        expect(points[1]!.x).toBeCloseTo(CENTER + 100, 5);
        expect(slotAngle(3, 12)).toBe(90);
    });

    it("covers every bandStep-th slot with a band, keeping the top slot free", () => {
        expect([0, 1, 2, 3].map((s) => isCovered(s, 2))).toEqual([
            false,
            true,
            false,
            true,
        ]);
        // step 3: 1, 4, 7… (2, 5, 8… for humans)
        expect([0, 1, 2, 3, 4, 5, 6, 7].filter((s) => isCovered(s, 3))).toEqual(
            [1, 4, 7],
        );
        expect(isCovered(1, null)).toBe(false);
        expect(openSlotCount(12, 2)).toBe(6);
        expect(openSlotCount(15, 3)).toBe(10);
        expect(openSlotCount(12, null)).toBe(12);
    });

    it("skips slots the caller rules out when finding the nearest", () => {
        const points = slotPositions(4, 100);
        expect(
            nearestSlot(points, points[1]!, 200, (s) => isCovered(s, 2)),
        ).not.toBe(1);
        expect(
            nearestSlot(points, points[1]!, 40, (s) => isCovered(s, 2)),
        ).toBeNull();
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
        expect(decorationSize(360 * 0.92, 35)).toBeCloseTo(
            (331.2 * 350) / 1260,
        );
        expect(decorationSize(360, 50)).toBeCloseTo(70);
    });

    it("draws small pictures larger for their margin, others at ring size", () => {
        expect(artworkSize(900, "s")).toBeCloseTo(1000);
        expect(artworkSize(300, "m")).toBe(300);
    });

    it("puts the slot circle on the middle line of the ring", () => {
        // Measured on the real small fir base: 280 of 900 px from the centre.
        expect(slotRadius(900)).toBeCloseTo(280, 0);
    });

    it("sizes empty-slot markers to the visible decoration, not its whole canvas", () => {
        expect(markerRadius(100)).toBe(29); // half of the canvas is visible, + 4 margin
        // Large without a band (24 slots): markers shrink so neighbours don't touch.
        const ring = 360;
        const points = slotPositions(24, slotRadius(ring));
        const gap = Math.hypot(
            points[1]!.x - points[0]!.x,
            points[1]!.y - points[0]!.y,
        );
        expect(slotGap(24, slotRadius(ring))).toBeCloseTo(gap, 5);
        expect(2 * markerRadius(decorationSize(ring, 50), gap)).toBeLessThan(
            gap,
        );
    });
});
