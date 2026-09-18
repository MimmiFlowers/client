import { describe, it, expect } from "vitest";
import { summaryLines } from "../components/WreathBuilder/wreathSummary";
import type { WreathSummary } from "../components/WreathBuilder/types";

const SUMMARY: WreathSummary = {
    size: { en: "Small 25 cm", sv: "Liten 25 cm", slotCount: 6 },
    material: { en: "Fir", sv: "Gran" },
    band: null,
    decorations: [
        { slot: 1, en: "Pine cone", sv: "Kotte" },
        { slot: 3, en: "Star", sv: "Stjärna" },
        { slot: 5, en: "Pine cone", sv: "Kotte" },
    ],
};

describe("summaryLines", () => {
    it("builds compact cart lines in the given language, grouping decorations", () => {
        expect(summaryLines(SUMMARY, "sv", "Inget band")).toEqual([
            "Liten 25 cm · Gran",
            "Inget band",
            "Kotte ×2, Stjärna ×1",
        ]);
    });

    it("shows the band when present and omits the decoration line when empty", () => {
        expect(
            summaryLines(
                {
                    ...SUMMARY,
                    band: { en: "Gold", sv: "Guld" },
                    decorations: [],
                },
                "en-GB",
                "No band",
            ),
        ).toEqual(["Small 25 cm · Fir", "Gold"]);
    });
});
