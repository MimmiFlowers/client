import { describe, it, expect } from "vitest";
import {
    CENTER,
    nearestSlot,
    ringSize,
    slotPositions,
} from "../components/WreathBuilder/wreathGeometry";

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

    it("scales the ring from 84% to 100% across sizes", () => {
        expect(ringSize(0, 3)).toBeCloseTo(360 * 0.84);
        expect(ringSize(2, 3)).toBe(360);
        expect(ringSize(0, 1)).toBe(360);
    });
});
