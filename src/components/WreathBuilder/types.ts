/** Shapes returned by GET /data/wreath/options (names already in the UI language, prices in SEK). */
export interface WreathSize {
    code: string;
    name: string;
    diameterCm: number;
    slotCount: number;
}

export interface WreathMaterial {
    code: string;
    name: string;
    image: string;
}

export interface WreathBand {
    code: string;
    name: string;
    image: string;
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

interface Named {
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
    imagePath: string | null;
    imageUrl: string | null;
    summary: WreathSummary;
}
