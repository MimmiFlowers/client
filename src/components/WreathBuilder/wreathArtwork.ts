import type { WreathOptions } from "./types";

/**
 * The wreath picture for a size + material: its own photo from wreath_bases
 * when one is set, else the material's image. All base photos share one
 * framing, so the stage scales them by size exactly like the fallback.
 */
export const baseImage = (
    options: WreathOptions,
    sizeCode: string,
    materialCode: string,
): string =>
    options.baseImages?.[sizeCode]?.[materialCode] ??
    options.materials.find((m) => m.code === materialCode)?.image ??
    "";

/**
 * The whole-band picture for a band on a size, or null when that size has none
 * (the stage then draws the band's strip on every covered slot).
 */
export const bandOverlay = (
    options: WreathOptions,
    bandCode: string | null,
    sizeCode: string,
): string | null =>
    (bandCode &&
        options.bands.find((b) => b.code === bandCode)?.sizeImages?.[
            sizeCode
        ]) ||
    null;

/** Material chip thumbnail: the smallest size (first in catalogue order) of that material. */
export const chipImage = (
    options: WreathOptions,
    materialCode: string,
): string => baseImage(options, options.sizes[0]?.code ?? "", materialCode);
