import type { WreathSummary } from "./types";

/** Compact lines shown under a wreath in the cart drawer and checkout summary. */
export const summaryLines = (
    summary: WreathSummary,
    language: string,
    bandNoneLabel: string,
): string[] => {
    const lang = language.startsWith("sv") ? "sv" : "en";
    const name = (o: { en: string; sv: string }) => o[lang] || o.en;
    const counts = new Map<string, number>();
    for (const d of summary.decorations) {
        counts.set(name(d), (counts.get(name(d)) ?? 0) + 1);
    }
    const lines = [
        `${name(summary.size)} · ${name(summary.material)}`,
        summary.band ? name(summary.band) : bandNoneLabel,
    ];
    if (counts.size > 0) {
        lines.push([...counts].map(([n, c]) => `${n} ×${c}`).join(", "));
    }
    return lines;
};
