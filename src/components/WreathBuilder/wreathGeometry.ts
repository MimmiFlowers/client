/** Stage coordinate system: a 400×400 SVG viewBox with the ring centred. */
export const STAGE = 400;
export const CENTER = STAGE / 2;
/** Drop-target radius (stage units) for drag-and-drop. */
export const DROP_RADIUS = 44;

/*
 * Artwork rules — the proportions on the stage come from these, so keep the
 * images to them (convert-wreath-images.py in the project root checks them):
 *  - every decoration is a 350 × 350 px canvas, the decoration in its middle;
 *  - every base is square at 36 px per cm of wreath diameter
 *    (25 cm → 900 px, 35 cm → 1260 px, 50 cm → 1800 px), wreath filling the canvas.
 * Served files may be scaled down: sizes are computed from centimetres, not file pixels.
 */
export const DECORATION_PX = 350;
export const BASE_PX_PER_CM = 36;
/** Slot circle radius as a share of the base width: the ring's middle line (280 of 900 px). */
export const SLOT_RADIUS = 0.311;
/** Share of a decoration's canvas the decoration itself covers (the gift: ~173 of 350 px). */
export const DECORATION_CONTENT = 0.5;
/** Loading-ring thickness as a share of the base width (fir: 0.31 / 0.27 / 0.23 by size). */
export const PLACEHOLDER_RING_WIDTH = 0.27;

export interface Point {
    x: number;
    y: number;
}

/** Drawn ring size for size index `index` of `count`: smallest 84 %, largest 100 % of the stage. */
export const ringSize = (index: number, count: number): number =>
    count <= 1 ? 360 : 360 * (0.84 + 0.16 * (index / (count - 1)));

/** Drawn ring size for the selected size code (falls back to the first size). */
export const ringForSize = (
    sizes: { code: string }[],
    sizeCode: string,
): number =>
    ringSize(
        Math.max(
            0,
            sizes.findIndex((s) => s.code === sizeCode),
        ),
        sizes.length,
    );

/** Radius of the circle the slot centres sit on, for a base drawn `ring` units wide. */
export const slotRadius = (ring: number): number => ring * SLOT_RADIUS;

/**
 * Drawn size (stage units) of a decoration's canvas on a base drawn `ring` units
 * wide, true to the photos: 350 px against diameterCm × 36 px.
 */
export const decorationSize = (ring: number, diameterCm: number): number =>
    (ring * DECORATION_PX) / (diameterCm * BASE_PX_PER_CM);

/** Empty-slot marker radius: the visible part of a decoration plus a small margin. */
export const markerRadius = (decoration: number): number =>
    (decoration * DECORATION_CONTENT) / 2 + 4;

/**
 * Slot centres, clockwise, starting just right of the bow at the top.
 * Offsetting by half a step guarantees no slot ever sits under the band.
 * Must match services/wreath.py's description "(i + 0.5) * 360 / n from the top".
 */
export const slotPositions = (count: number, radius: number): Point[] =>
    Array.from({ length: count }, (_, i) => {
        const angle = ((-90 + ((i + 0.5) * 360) / count) * Math.PI) / 180;
        return {
            x: CENTER + radius * Math.cos(angle),
            y: CENTER + radius * Math.sin(angle),
        };
    });

/**
 * Index of the closest slot within `maxDistance`, or null.
 * A point exactly at `maxDistance` counts; ties go to the higher index.
 */
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
