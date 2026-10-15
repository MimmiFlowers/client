/** Hero carousel slides from GET /data/banners (db/init/07-banners.sql). */

export type LocalizedText = { en: string; sv?: string };

export interface Banner {
    id: number;
    title: LocalizedText;
    text: LocalizedText | null;
    ctaText: LocalizedText | null;
    ctaUrl: string | null;
    imageSmall: string;
    imageLarge: string;
    imageAlt: LocalizedText | null;
}

export type Cta = { label: string; external: boolean; to: string };

/** What TituleBlock renders: a DB banner in one language, or the built-in fallback. */
export interface Slide {
    key: string;
    title: string;
    text: string;
    cta: Cta | null;
    image: { small: string; large: string };
    alt: string;
}

/** The text in the UI language, else English. The DB requires both, this is belt and braces. */
export const pickText = (text: LocalizedText | null, lang: string): string => {
    if (!text) return "";
    return (lang === "sv" ? text.sv : text.en) || text.en || "";
};

// Same rule as the banners_cta_url CHECK: "/" or "/x…" (not "//host"), or https://host…
const CTA_URL = /^(\/($|[^/\s])|https:\/\/[^/\s])\S*$/;

/** null when the URL isn't one we are willing to link to. */
export const ctaTarget = (
    url: string | null,
): { external: boolean; to: string } | null => {
    if (!url || !CTA_URL.test(url)) return null;
    return { external: url.startsWith("https://"), to: url };
};

export const toSlide = (banner: Banner, lang: string): Slide => {
    const target = ctaTarget(banner.ctaUrl);
    const label = pickText(banner.ctaText, lang);
    if (banner.ctaUrl && !target) {
        console.warn(`Banner ${banner.id}: ignoring unsafe ctaUrl`, banner.ctaUrl);
    }
    return {
        key: `banner-${banner.id}`,
        title: pickText(banner.title, lang),
        text: pickText(banner.text, lang),
        cta: target && label ? { label, ...target } : null,
        image: { small: banner.imageSmall, large: banner.imageLarge },
        alt: pickText(banner.imageAlt, lang),
    };
};
