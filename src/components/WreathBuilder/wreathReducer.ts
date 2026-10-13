import type { WreathOptions, WreathSpec } from "./types";
import { isCovered } from "./wreathGeometry";

export interface WreathDesignState {
    sizeCode: string;
    materialCode: string;
    bandCode: string | null;
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
    | { type: "setSize"; code: string; slotCount: number }
    | { type: "setMaterial"; code: string }
    | { type: "setBand"; code: string | null }
    | { type: "place"; slot: number; code: string }
    | { type: "clearSlot"; slot: number }
    | { type: "clearAll" }
    /** Undo for clearAll: put earlier placements back, fitted to the current slot count. */
    | { type: "restore"; placements: (string | null)[] };

export const initialDesign = (options: WreathOptions): WreathDesignState => {
    const size = options.sizes[0];
    return {
        sizeCode: size?.code ?? "",
        materialCode: options.materials[0]?.code ?? "",
        bandCode: null,
        placements: Array.from({ length: size?.slotCount ?? 0 }, () => null),
        dropped: 0,
        droppedBy: "size",
    };
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
            const dropped = state.placements
                .slice(action.slotCount)
                .filter((code) => code !== null).length;
            while (kept.length < action.slotCount) kept.push(null);
            return {
                ...state,
                sizeCode: action.code,
                placements: kept,
                dropped,
                droppedBy: "size",
            };
        }
        case "setMaterial":
            return { ...state, materialCode: action.code, dropped: 0 };
        case "setBand": {
            if (action.code === null)
                return { ...state, bandCode: null, dropped: 0 };
            // Decorations under the new wraps slide to a free neighbour
            // (anticlockwise first), or are dropped when both are taken.
            const placements = [...state.placements];
            const n = placements.length;
            let dropped = 0;
            placements.forEach((code, slot) => {
                if (!code || !isCovered(slot, true)) return;
                placements[slot] = null;
                const free = [(slot - 1 + n) % n, (slot + 1) % n].find(
                    (s) => !isCovered(s, true) && placements[s] === null,
                );
                if (free === undefined) dropped++;
                else placements[free] = code;
            });
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
                isCovered(action.slot, state.bandCode !== null)
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
                placements: state.placements.map(() => null),
                dropped: 0,
            };
        case "restore":
            return {
                ...state,
                placements: state.placements.map((_, slot) =>
                    isCovered(slot, state.bandCode !== null)
                        ? null
                        : (action.placements[slot] ?? null),
                ),
                dropped: 0,
            };
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
