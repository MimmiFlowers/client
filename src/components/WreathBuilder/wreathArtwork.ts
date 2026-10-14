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

export interface BandPicture {
    href: string;
    /** Made for this exact size + material (aligned by hand), not shared by all materials. */
    perMaterial: boolean;
}

/**
 * The whole-band picture for a band on a size + material: the one made for that
 * material, else the size's shared one, else null (the stage then draws the
 * band's strip on every covered slot).
 */
export const bandOverlay = (
    options: WreathOptions,
    bandCode: string | null,
    sizeCode: string,
    materialCode: string,
): BandPicture | null => {
    if (!bandCode) return null;
    const entry = options.bands.find((b) => b.code === bandCode)?.sizeImages?.[
        sizeCode
    ];
    if (typeof entry === "string" && entry)
        return { href: entry, perMaterial: false };
    if (entry && typeof entry === "object" && entry[materialCode])
        return { href: entry[materialCode], perMaterial: true };
    return null;
};

/** Material chip thumbnail: the smallest size (first in catalogue order) of that material. */
export const chipImage = (
    options: WreathOptions,
    materialCode: string,
): string => baseImage(options, options.sizes[0]?.code ?? "", materialCode);
