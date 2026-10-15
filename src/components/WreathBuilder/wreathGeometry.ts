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
 *    (25 cm → 900 px, 35 cm → 1260 px, 50 cm → 1800 px), wreath filling the canvas,
 *    except where ARTWORK_CANVAS gives a size a bigger canvas with an empty margin.
 * Served files may be scaled down: sizes are computed from centimetres, not file pixels.
 */
export const DECORATION_PX = 350;
export const BASE_PX_PER_CM = 36;
/** Slot circle radius as a share of the base width: the ring's middle line (280 of 900 px). */
export const SLOT_RADIUS = 0.311;
/** Share of a decoration's canvas the decoration itself covers (the gift: ~173 of 350 px). */
export const DECORATION_CONTENT = 0.5;
/**
 * Canvas size relative to the wreath, per size code, for base photos and band
 * pictures exported with an empty margin around the wreath. Small: 1000 px canvas
 * around a 900 px wreath. Sizes not listed fill their canvas (1).
 */
export const ARTWORK_CANVAS: Record<string, number> = { s: 1000 / 900 };

/** Drawn size of a base or band picture for a wreath drawn `ring` units wide. */
export const artworkSize = (ring: number, sizeCode: string): number =>
    ring * (ARTWORK_CANVAS[sizeCode] ?? 1);

/**
 * Inner ribbon ends of a whole-band picture (BandOverlay). Lengths are shares of
 * the drawn picture's width, so they scale with the size.
 *  - smooth / solid: how much the base photo's outline is blurred, and the
 *    alpha (0–1) at which it counts as wreath again: more blur, smoother end;
 *  - shadowDepth / shadowSoft / shadowStrength: the darkening before the end —
 *    how far in it starts, how soft it is, how dark (0–1) it gets at the edge;
 *  - tipsWidth / tipsSoft: the strip of needles laid back over the ribbon end.
 */
export const BAND_END = {
    smooth: 0.014,
    solid: 0.59,
    shadowDepth: 0.009,
    shadowSoft: 0.01,
    shadowStrength: 0.55,
    tipsWidth: 0.011,
    tipsSoft: 0.004,
};

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

/**
 * Empty-slot marker radius: the visible part of a decoration plus a small margin,
 * shrunk when needed so neighbouring markers `gap` apart keep 4 units between them.
 */
export const markerRadius = (decoration: number, gap = Infinity): number =>
    Math.min((decoration * DECORATION_CONTENT) / 2 + 4, gap / 2 - 2);

/** Distance between neighbouring slot centres on a circle of `radius`. */
export const slotGap = (count: number, radius: number): number =>
    count < 2 ? Infinity : 2 * radius * Math.sin(Math.PI / count);

/**
 * Slot centres, clockwise, slot 0 at 12 o'clock: slot i sits at i · 360 / count
 * from the top. Must match services/wreath.py's description "i * 360 / n from the top".
 */
export const slotPositions = (count: number, radius: number): Point[] =>
    Array.from({ length: count }, (_, i) => {
        const angle = ((-90 + (i * 360) / count) * Math.PI) / 180;
        return {
            x: CENTER + radius * Math.cos(angle),
            y: CENTER + radius * Math.sin(angle),
        };
    });

/** Angle of slot `slot` of `count`, degrees clockwise from the top. */
export const slotAngle = (slot: number, count: number): number =>
    (slot * 360) / count;

/**
 * The 0-based slots a band covers on a size: its `bandSpots` (1-based, as
 * customers see them) when set, else every `bandStep`-th slot from slot 1
 * (step 2: 1, 3, 5…; step 3: 1, 4, 7…), so slot 0 at the top stays free.
 * Must match services/wreath.py's band_slots().
 */
export const bandSlots = (size: {
    slotCount: number;
    bandStep: number;
    bandSpots?: number[] | null;
}): number[] =>
    size.bandSpots?.length
        ? size.bandSpots
              .map((spot) => spot - 1)
              .filter((slot) => slot >= 0 && slot < size.slotCount)
        : Array.from({ length: size.slotCount }, (_, i) => i).filter(
              (i) => i % size.bandStep === 1,
          );

/** Whether a slot is under the band; `covered` is bandSlots(size), or null without a band. */
export const isCovered = (slot: number, covered: number[] | null): boolean =>
    covered !== null && covered.includes(slot);

/** How many slots take a decoration: all of them, or all but the covered ones. */
export const openSlotCount = (
    count: number,
    covered: number[] | null,
): number =>
    covered === null
        ? count
        : count - covered.filter((slot) => slot < count).length;

/*
 * Drawn ribbon wrap, as shares of the ring size, and its tilt (degrees, clockwise)
 * away from straight across the ring. The band picture is one wrap, a 1 : 4 strip.
 */
export const BAND_WRAP_WIDTH = 0.075;
export const BAND_WRAP_LENGTH = 0.3;
export const BAND_WRAP_TILT = 15;

/**
 * Index of the closest slot within `maxDistance` that `skip` lets through, or null.
 * A point exactly at `maxDistance` counts; ties go to the higher index.
 */
export const nearestSlot = (
    points: Point[],
    p: Point,
    maxDistance: number,
    skip: (slot: number) => boolean = () => false,
): number | null => {
    let best: number | null = null;
    let bestDistance = maxDistance;
    points.forEach((q, i) => {
        if (skip(i)) return;
        const d = Math.hypot(q.x - p.x, q.y - p.y);
        if (d <= bestDistance) {
            best = i;
            bestDistance = d;
        }
    });
    return best;
};
