import type { WreathOptions, WreathSpec } from "./types";
import { bandSlots, isCovered } from "./wreathGeometry";

export interface WreathDesignState {
    sizeCode: string;
    materialCode: string;
    bandCode: string | null;
    /** The 0-based slots the band covers on this size, with a band on (see bandSlots). */
    bandSlots: number[];
    /** One entry per slot, clockwise from the top: a decoration code or null. */
    placements: (string | null)[];
    /**
     * Decorations discarded by the last size or band change, for a one-off notice.
     * Cleared by the next interaction of any other kind; the page just renders it
     * while > 0, worded by `droppedBy`.
     */
    dropped: number;
    droppedBy: "size" | "band";
}

export type WreathAction =
    | { type: "setSize"; code: string; slotCount: number; bandSlots: number[] }
    | { type: "setMaterial"; code: string }
    | { type: "setBand"; code: string | null }
    | { type: "place"; slot: number; code: string }
    | { type: "clearSlot"; slot: number }
    | { type: "clearAll" }
    /** Undo for clearAll: put the band and earlier placements back, fitted to the current slot count. */
    | {
          type: "restore";
          placements: (string | null)[];
          bandCode: string | null;
      };

export const initialDesign = (options: WreathOptions): WreathDesignState => {
    const size = options.sizes[0];
    return {
        sizeCode: size?.code ?? "",
        materialCode: options.materials[0]?.code ?? "",
        bandCode: null,
        bandSlots: size ? bandSlots(size) : [],
        placements: Array.from({ length: size?.slotCount ?? 0 }, () => null),
        dropped: 0,
        droppedBy: "size",
    };
};

/** The covered slots in force: the size's with a band on, null without one. */
const activeCover = (state: WreathDesignState): number[] | null =>
    state.bandCode === null ? null : state.bandSlots;

/**
 * Move decorations off slots the band covers: each slides to a free neighbour
 * (anticlockwise first), or is dropped when both are taken. Returns the new
 * placements and how many were dropped.
 */
const clearCovered = (
    placements: (string | null)[],
    covered: number[] | null,
): { placements: (string | null)[]; dropped: number } => {
    const next = [...placements];
    const n = next.length;
    let dropped = 0;
    next.forEach((code, slot) => {
        if (!code || !isCovered(slot, covered)) return;
        next[slot] = null;
        const free = [(slot - 1 + n) % n, (slot + 1) % n].find(
            (s) => !isCovered(s, covered) && next[s] === null,
        );
        if (free === undefined) dropped++;
        else next[free] = code;
    });
    return { placements: next, dropped };
};

export const wreathReducer = (
    state: WreathDesignState,
    action: WreathAction,
): WreathDesignState => {
    switch (action.type) {
        case "setSize": {
            if (
                action.code === state.sizeCode &&
                action.slotCount === state.placements.length
            )
                return state;
            const kept = state.placements.slice(0, action.slotCount);
            const lost = state.placements
                .slice(action.slotCount)
                .filter((code) => code !== null).length;
            while (kept.length < action.slotCount) kept.push(null);
            // The new size may put the band on other slots.
            const fitted = clearCovered(
                kept,
                state.bandCode === null ? null : action.bandSlots,
            );
            return {
                ...state,
                sizeCode: action.code,
                bandSlots: action.bandSlots,
                placements: fitted.placements,
                dropped: lost + fitted.dropped,
                droppedBy: lost > 0 || fitted.dropped === 0 ? "size" : "band",
            };
        }
        case "setMaterial":
            return { ...state, materialCode: action.code, dropped: 0 };
        case "setBand": {
            if (action.code === null)
                return { ...state, bandCode: null, dropped: 0 };
            const { placements, dropped } = clearCovered(
                state.placements,
                state.bandSlots,
            );
            return {
                ...state,
                bandCode: action.code,
                placements,
                dropped,
                droppedBy: "band",
            };
        }
        case "place": {
            if (
                action.slot < 0 ||
                action.slot >= state.placements.length ||
                isCovered(action.slot, activeCover(state))
            )
                return state;
            const placements = [...state.placements];
            placements[action.slot] = action.code;
            return { ...state, placements, dropped: 0 };
        }
        case "clearSlot": {
            if (action.slot < 0 || action.slot >= state.placements.length)
                return state;
            const placements = [...state.placements];
            placements[action.slot] = null;
            return { ...state, placements, dropped: 0 };
        }
        case "clearAll":
            return {
                ...state,
                bandCode: null,
                placements: state.placements.map(() => null),
                dropped: 0,
            };
        case "restore": {
            const restored = { ...state, bandCode: action.bandCode };
            return {
                ...restored,
                placements: state.placements.map((_, slot) =>
                    isCovered(slot, activeCover(restored))
                        ? null
                        : (action.placements[slot] ?? null),
                ),
                dropped: 0,
            };
        }
    }
};

/** The request body for POST /data/wreath/designs. */
export const toSpec = (state: WreathDesignState): WreathSpec => ({
    sizeCode: state.sizeCode,
    materialCode: state.materialCode,
    bandCode: state.bandCode,
    decorations: state.placements.flatMap((code, slot) =>
        code ? [{ slot, code }] : [],
    ),
});
