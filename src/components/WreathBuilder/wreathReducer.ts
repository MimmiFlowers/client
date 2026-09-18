import type { WreathOptions, WreathSpec } from "./types";

export interface WreathDesignState {
    sizeCode: string;
    materialCode: string;
    bandCode: string | null;
    /** One entry per slot, clockwise from the bow: a decoration code or null. */
    placements: (string | null)[];
    /** Decorations discarded by the last size change, for a one-off notice. */
    dropped: number;
}

export type WreathAction =
    | { type: "setSize"; code: string; slotCount: number }
    | { type: "setMaterial"; code: string }
    | { type: "setBand"; code: string | null }
    | { type: "place"; slot: number; code: string }
    | { type: "clearSlot"; slot: number }
    | { type: "clearNotice" };

export const initialDesign = (options: WreathOptions): WreathDesignState => {
    const size = options.sizes[0];
    return {
        sizeCode: size?.code ?? "",
        materialCode: options.materials[0]?.code ?? "",
        bandCode: null,
        placements: Array.from({ length: size?.slotCount ?? 0 }, () => null),
        dropped: 0,
    };
};

export const wreathReducer = (
    state: WreathDesignState,
    action: WreathAction,
): WreathDesignState => {
    switch (action.type) {
        case "setSize": {
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
            };
        }
        case "setMaterial":
            return { ...state, materialCode: action.code };
        case "setBand":
            return { ...state, bandCode: action.code };
        case "place": {
            if (action.slot < 0 || action.slot >= state.placements.length)
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
            return { ...state, placements };
        }
        case "clearNotice":
            return state.dropped === 0 ? state : { ...state, dropped: 0 };
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
