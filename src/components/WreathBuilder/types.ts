/** Shapes returned by GET /data/wreath/options (names already in the UI language, prices in SEK). */
export interface WreathSize {
    code: string;
    name: string;
    diameterCm: number;
    /** Slots without a band. */
    slotCount: number;
    /** With a band on, every bandStep-th slot is under a wrap (see isCovered). */
    bandStep: number;
}

export interface WreathMaterial {
    code: string;
    name: string;
    image: string;
}

export interface WreathBand {
    code: string;
    name: string;
    /** One ribbon wrap (a 1:4 strip), drawn rotated on every covered slot. */
    image: string;
    /**
     * Optional whole-band picture per size code: transparent, framed like that
     * size's base photo, drawn once over it instead of the strips.
     */
    sizeImages: Record<string, string>;
    price: number;
}

export interface WreathDecoration {
    code: string;
    name: string;
    image: string;
    price: number;
}

export interface WreathOptions {
    sizes: WreathSize[];
    materials: WreathMaterial[];
    /** basePrices[sizeCode][materialCode] in SEK */
    basePrices: Record<string, Record<string, number>>;
    /**
     * baseImages[sizeCode][materialCode]: the wreath picture for that combination
     * (absolute R2 URL). Only combinations that have one; use baseImage() to read.
     */
    baseImages: Record<string, Record<string, string>>;
    bands: WreathBand[];
    decorations: WreathDecoration[];
}

/** Body of POST /data/wreath/designs. Slots are 0-based, clockwise from the bow. */
export interface WreathSpec {
    sizeCode: string;
    materialCode: string;
    bandCode: string | null;
    decorations: { slot: number; code: string }[];
}

/** A name the server returns in both UI languages. */
export interface Named {
    en: string;
    sv: string;
}

/** Bilingual summary the server returns (and later stores in the order). Slots are 1-based here. */
export interface WreathSummary {
    size: Named & { slotCount: number };
    material: Named;
    band: Named | null;
    decorations: (Named & { slot: number })[];
}

export interface WreathDesignResponse {
    designID: string;
    price: number;
    /** Public R2 URL of the stored PNG; null if the export or the upload failed. */
    imageUrl: string | null;
    summary: WreathSummary;
}
