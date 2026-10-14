import type { WreathOptions } from "./types";
import {
    initialDesign,
    wreathReducer,
    type WreathDesignState,
} from "./wreathReducer";

/*
 * The design in progress survives a page reload: the customer's choices are kept
 * in localStorage, like the cart (CartContext), and expire after the same 7 days
 * of inactivity (every visit saves again). Listed on the privacy page as "Wreath design".
 */
export const DESIGN_STORAGE_KEY = "wreathDesign";
const DESIGN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

interface StoredDesign {
    sizeCode: string;
    materialCode: string;
    bandCode: string | null;
    placements: (string | null)[];
    updatedAt: number;
}

/** Save the customer's choices (nothing transient: no notices, preview or undo). */
export const saveDesign = (design: WreathDesignState): void => {
    const stored: StoredDesign = {
        sizeCode: design.sizeCode,
        materialCode: design.materialCode,
        bandCode: design.bandCode,
        placements: design.placements,
        updatedAt: Date.now(),
    };
    try {
        localStorage.setItem(DESIGN_STORAGE_KEY, JSON.stringify(stored));
    } catch {
        // Storage full or blocked: the builder still works, it just won't remember.
    }
};

/**
 * The saved design rebuilt against today's options, or null when there is none,
 * it has expired or it can't be read. It is replayed through the reducer, so
 * retired options are skipped and slot rules (count, band) apply as if the
 * customer had made the choices again.
 */
export const loadDesign = (
    options: WreathOptions,
): WreathDesignState | null => {
    let stored: StoredDesign;
    try {
        const raw = localStorage.getItem(DESIGN_STORAGE_KEY);
        if (!raw) return null;
        stored = JSON.parse(raw) as StoredDesign;
    } catch {
        return null;
    }
    if (
        typeof stored?.updatedAt !== "number" ||
        Date.now() - stored.updatedAt > DESIGN_TTL_MS
    ) {
        try {
            localStorage.removeItem(DESIGN_STORAGE_KEY);
        } catch {
            // ignore
        }
        return null;
    }

    let design = initialDesign(options);
    const size = options.sizes.find((s) => s.code === stored.sizeCode);
    if (size)
        design = wreathReducer(design, {
            type: "setSize",
            code: size.code,
            slotCount: size.slotCount,
            bandStep: size.bandStep,
        });
    if (options.materials.some((m) => m.code === stored.materialCode))
        design = wreathReducer(design, {
            type: "setMaterial",
            code: stored.materialCode,
        });
    if (options.bands.some((b) => b.code === stored.bandCode))
        design = wreathReducer(design, {
            type: "setBand",
            code: stored.bandCode,
        });
    if (Array.isArray(stored.placements))
        stored.placements.forEach((code, slot) => {
            if (
                typeof code === "string" &&
                options.decorations.some((d) => d.code === code)
            )
                design = wreathReducer(design, { type: "place", slot, code });
        });
    return { ...design, dropped: 0 };
};
