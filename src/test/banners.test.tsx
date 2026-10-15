import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import i18n from "../i18n";
import api from "../api/api";
import TituleBlock from "../components/TituleBlock/TituleBlock";
import {
    ctaTarget,
    pickText,
    toSlide,
    type Banner,
} from "../components/TituleBlock/banners";

const banner = (overrides: Partial<Banner> = {}): Banner => ({
    id: 1,
    title: { en: "Spring Collection", sv: "Vårkollektionen" },
    text: { en: "Fresh bouquets", sv: "Nya buketter" },
    ctaText: { en: "Shop Season", sv: "Handla Säsong" },
    ctaUrl: "/Catalog?filter=season",
    imageSmall: "https://images.test/banners/a-480.webp",
    imageLarge: "https://images.test/banners/a-960.webp",
    imageAlt: null,
    ...overrides,
});

describe("pickText", () => {
    it("picks the UI language", () => {
        expect(pickText({ en: "Hi", sv: "Hej" }, "sv")).toBe("Hej");
        expect(pickText({ en: "Hi", sv: "Hej" }, "en")).toBe("Hi");
    });

    it("falls back to English, and to empty for null", () => {
        expect(pickText({ en: "Hi" }, "sv")).toBe("Hi");
        expect(pickText({ en: "Hi", sv: "" }, "sv")).toBe("Hi");
        expect(pickText(null, "sv")).toBe("");
    });
});

describe("ctaTarget", () => {
    it.each(["/", "/Catalog", "/Catalog?filter=season", "/WreathBuilder#top"])(
        "accepts internal path %s",
        (url) => expect(ctaTarget(url)).toEqual({ external: false, to: url }),
    );

    it("accepts https as external", () => {
        expect(ctaTarget("https://instagram.com/mimmi")).toEqual({
            external: true,
            to: "https://instagram.com/mimmi",
        });
    });

    it.each([
        null,
        "",
        "javascript:alert(1)",
        "//evil.com",
        "http://example.com",
        "Catalog",
        "/Cat alog",
        "https://",
    ])("rejects %s", (url) => expect(ctaTarget(url)).toBeNull());
});

describe("toSlide", () => {
    it("builds a slide in the requested language", () => {
        const slide = toSlide(banner(), "sv");
        expect(slide).toMatchObject({
            key: "banner-1",
            title: "Vårkollektionen",
            text: "Nya buketter",
            cta: {
                label: "Handla Säsong",
                external: false,
                to: "/Catalog?filter=season",
            },
            alt: "",
        });
    });

    it("drops the button for a missing or unsafe URL", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        expect(
            toSlide(banner({ ctaText: null, ctaUrl: null }), "en").cta,
        ).toBeNull();
        expect(
            toSlide(banner({ ctaUrl: "javascript:alert(1)" }), "en").cta,
        ).toBeNull();
        expect(warn).toHaveBeenCalledOnce();
        warn.mockRestore();
    });
});

describe("TituleBlock", () => {
    const renderHero = () =>
        render(
            <MemoryRouter>
                <TituleBlock />
            </MemoryRouter>,
        );

    beforeEach(async () => {
        await i18n.changeLanguage("en");
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("shows the database slides with controls", async () => {
        vi.spyOn(api, "get").mockResolvedValue({
            data: {
                data: [
                    banner(),
                    banner({
                        id: 2,
                        title: { en: "Free Delivery", sv: "Fri Leverans" },
                    }),
                ],
            },
        });
        renderHero();
        expect(
            await screen.findByText("Spring Collection"),
        ).toBeInTheDocument();
        expect(screen.getByText("Free Delivery")).toBeInTheDocument();
        expect(
            screen.getByRole("link", { name: /Shop Season/ }),
        ).toHaveAttribute("href", "/Catalog?filter=season");
        expect(
            screen.getAllByRole("button", { name: /Go to slide/ }),
        ).toHaveLength(2);
    });

    it("serves the phone crop by default and the desktop crop from md:", async () => {
        vi.spyOn(api, "get").mockResolvedValue({ data: { data: [banner()] } });
        const { container } = renderHero();
        await screen.findByText("Spring Collection");
        const source = container.querySelector("picture source");
        expect(source).toHaveAttribute("media", "(min-width: 768px)");
        expect(source).toHaveAttribute(
            "srcset",
            "https://images.test/banners/a-960.webp",
        );
        expect(container.querySelector("picture img")).toHaveAttribute(
            "src",
            "https://images.test/banners/a-480.webp",
        );
    });

    it("switches language without refetching", async () => {
        const get = vi
            .spyOn(api, "get")
            .mockResolvedValue({ data: { data: [banner()] } });
        renderHero();
        await screen.findByText("Spring Collection");
        await act(() => i18n.changeLanguage("sv"));
        expect(screen.getByText("Vårkollektionen")).toBeInTheDocument();
        expect(get).toHaveBeenCalledOnce();
    });

    it("opens an https button in a new tab", async () => {
        vi.spyOn(api, "get").mockResolvedValue({
            data: { data: [banner({ ctaUrl: "https://instagram.com/mimmi" })] },
        });
        renderHero();
        const link = await screen.findByRole("link", { name: /Shop Season/ });
        expect(link).toHaveAttribute("href", "https://instagram.com/mimmi");
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("hides the controls for a single slide", async () => {
        vi.spyOn(api, "get").mockResolvedValue({ data: { data: [banner()] } });
        renderHero();
        await screen.findByText("Spring Collection");
        expect(
            screen.queryByRole("button", { name: /Go to slide/ }),
        ).toBeNull();
        expect(
            screen.queryByRole("button", { name: "Previous slide" }),
        ).toBeNull();
    });

    it("shows the fallback slide when the request fails", async () => {
        vi.spyOn(api, "get").mockRejectedValue(new Error("network"));
        renderHero();
        expect(
            await screen.findByText("Flowers, tied by hand."),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("link", { name: /Browse Catalog/ }),
        ).toHaveAttribute("href", "/Catalog");
    });

    it("shows the fallback slide when nothing is live", async () => {
        vi.spyOn(api, "get").mockResolvedValue({ data: { data: [] } });
        renderHero();
        expect(
            await screen.findByText("Flowers, tied by hand."),
        ).toBeInTheDocument();
    });

    it("renders no slide while loading", () => {
        vi.spyOn(api, "get").mockReturnValue(new Promise(() => {}));
        renderHero();
        expect(screen.queryByText("Flowers, tied by hand.")).toBeNull();
        expect(
            screen.getByRole("region", { name: "Highlights" }),
        ).toHaveAttribute("aria-busy", "true");
    });
});
