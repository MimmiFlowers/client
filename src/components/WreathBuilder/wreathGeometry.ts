/** Stage coordinate system: a 400×400 SVG viewBox with the ring centred. */
export const STAGE = 400;
export const CENTER = STAGE / 2;
export const DECORATION_SIZE = 56;
/** Drop-target radius (stage units) for drag-and-drop. */
export const DROP_RADIUS = 44;

export interface Point {
    x: number;
    y: number;
}

/** Drawn ring size for size index `index` of `count`: smallest 84 %, largest 100 % of the stage. */
export const ringSize = (index: number, count: number): number =>
    count <= 1 ? 360 : 360 * (0.84 + 0.16 * (index / (count - 1)));

/** Radius of the circle the slot centres sit on (the ring's mid line in the base artwork). */
export const slotRadius = (ring: number): number => ring * 0.36;

/**
 * Slot centres, clockwise, starting just right of the bow at the top.
 * Offsetting by half a step guarantees no slot ever sits under the band.
 * Must match services/wreath.py's description "(i + 0.5) * 360 / n from the top".
 */
export const slotPositions = (
    count: number,
    radius: number,
    cx: number = CENTER,
    cy: number = CENTER,
): Point[] =>
    Array.from({ length: count }, (_, i) => {
        const angle = ((-90 + ((i + 0.5) * 360) / count) * Math.PI) / 180;
        return {
            x: cx + radius * Math.cos(angle),
            y: cy + radius * Math.sin(angle),
        };
    });

/** Index of the closest slot within `maxDistance`, or null. */
export const nearestSlot = (
    points: Point[],
    p: Point,
    maxDistance: number,
): number | null => {
    let best: number | null = null;
    let bestDistance = maxDistance;
    points.forEach((q, i) => {
        const d = Math.hypot(q.x - p.x, q.y - p.y);
        if (d <= bestDistance) {
            best = i;
            bestDistance = d;
        }
    });
    return best;
};
