import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import api from "../../api/api";
import banner480 from "../../assets/images/banner-480.webp";
import banner960 from "../../assets/images/banner-960.webp";
import { ArrowLeftIcon, ArrowRightIcon } from "../Icons/Icons";
import { toSlide, type Banner, type Slide } from "./banners";

const INTERVAL_MS = 7000;
const SWIPE_THRESHOLD = 50;
// The hero waits on this request, so give up sooner than the API default (15 s).
const BANNERS_TIMEOUT_MS = 5000;

/** Shown when /data/banners fails or has no live slide. Slides themselves live in
 *  the banners table (db/init/07-banners.sql), edited with SQL. */
const fallbackSlide = (t: (key: string) => string): Slide => ({
    key: "fallback",
    title: t("home.hero_title"),
    text: t("banner.fallback_subtitle"),
    cta: { label: t("banner.fallback_cta"), external: false, to: "/Catalog" },
    image: { small: banner480, large: banner960 },
    alt: "",
});

const TituleBlock = () => {
    const { t, i18n } = useTranslation();
    // null while loading; [] when the request failed or nothing is live.
    const [banners, setBanners] = useState<Banner[] | null>(null);
    const [current, setCurrent] = useState(0);
    const [paused, setPaused] = useState(false);
    const touchStartX = useRef(0);
    const touchDeltaX = useRef(0);

    useEffect(() => {
        let cancelled = false;
        api.get("/data/banners", { timeout: BANNERS_TIMEOUT_MS })
            .then((response) => {
                const data = response.data?.data;
                if (!cancelled) setBanners(Array.isArray(data) ? data : []);
            })
            .catch(() => {
                if (!cancelled) setBanners([]);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    // Both languages arrive in one response, so a language switch only re-renders.
    const lang = (i18n.language || "en").slice(0, 2);
    const slides = useMemo<Slide[]>(() => {
        if (banners === null) return [];
        if (banners.length === 0) return [fallbackSlide(t)];
        return banners.map((banner) => toSlide(banner, lang));
    }, [banners, lang, t]);
    const count = slides.length;

    const go = useCallback(
        (step: number) => {
            if (count < 2) return;
            setCurrent((prev) => (prev + step + count) % count);
        },
        [count],
    );

    // Auto-advance, unless there is one slide, hovered/focused, or the visitor prefers less motion.
    useEffect(() => {
        if (paused || count < 2) return;
        if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches)
            return;
        const timer = window.setInterval(() => go(1), INTERVAL_MS);
        return () => window.clearInterval(timer);
    }, [paused, count, go]);

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0]?.clientX ?? 0;
        touchDeltaX.current = 0;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchDeltaX.current =
            (e.touches[0]?.clientX ?? 0) - touchStartX.current;
    };

    const handleTouchEnd = () => {
        if (Math.abs(touchDeltaX.current) > SWIPE_THRESHOLD) {
            go(touchDeltaX.current < 0 ? 1 : -1);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
    };

    const ctaClass = (active: boolean) =>
        `group bg-blush text-button text-ink ease-luxe mt-8 inline-flex h-14 items-center gap-5 rounded-full pr-2 pl-7 font-medium tracking-[0.18em] uppercase transition-all duration-1000 active:scale-[0.98] ${
            active
                ? "translate-y-0 opacity-100 delay-[400ms]"
                : "translate-y-5 opacity-0"
        }`;

    const ctaArrow = (
        <span className="bg-primary text-ink ease-luxe flex h-10 w-10 items-center justify-center rounded-full transition-transform duration-500 group-hover:translate-x-1">
            <ArrowRightIcon className="h-4 w-4" />
        </span>
    );

    return (
        <section
            aria-roledescription="carousel"
            aria-label={t("banner.aria_label")}
            aria-busy={banners === null}
            className="bg-ink relative isolate h-[72dvh] max-h-[46rem] min-h-[27rem] w-full overflow-hidden sm:h-[76dvh] lg:h-[80dvh]"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onKeyDown={handleKeyDown}
        >
            {/* One page heading; each slide's own title is decorative copy. */}
            <h1 className="sr-only">{t("seo.home_title")}</h1>

            {slides.map((slide, i) => {
                const active = i === current;
                return (
                    <div
                        key={slide.key}
                        role="group"
                        aria-roledescription="slide"
                        aria-label={`${i + 1} / ${count}`}
                        aria-hidden={!active}
                        inert={!active}
                        className={`ease-luxe absolute inset-0 transition-opacity duration-1000 ${
                            active ? "opacity-100" : "opacity-0"
                        }`}
                    >
                        <img
                            src={slide.image.large}
                            srcSet={`${slide.image.small} 480w, ${slide.image.large} 960w`}
                            sizes="100vw"
                            alt={slide.alt}
                            aria-hidden={slide.alt ? undefined : "true"}
                            draggable={false}
                            loading={i === 0 ? "eager" : "lazy"}
                            fetchPriority={i === 0 ? "high" : "auto"}
                            className={`h-full w-full object-cover object-center transition-transform ease-out ${
                                active
                                    ? "scale-105 duration-[9000ms]"
                                    : "scale-100 duration-0"
                            }`}
                        />
                        {/* Scrim: keeps the copy readable over any photo. */}
                        <div className="from-ink/85 via-ink/55 to-ink/25 absolute inset-0 bg-gradient-to-t" />
                        <div className="from-ink/45 absolute inset-0 bg-gradient-to-r via-transparent to-transparent" />

                        <div className="container-luxe absolute inset-0 flex flex-col justify-end pb-20 sm:pb-24 lg:pb-28">
                            <div className="max-w-2xl">
                                <p
                                    className={`font-display text-hero text-blush ease-luxe leading-[0.95] font-medium tracking-[-0.03em] transition-all duration-1000 ${
                                        active
                                            ? "translate-y-0 opacity-100 delay-200"
                                            : "translate-y-5 opacity-0"
                                    }`}
                                >
                                    {slide.title}
                                </p>
                                {slide.text && (
                                    <p
                                        className={`text-lead text-blush/85 ease-luxe mt-5 max-w-lg leading-relaxed transition-all duration-1000 ${
                                            active
                                                ? "translate-y-0 opacity-100 delay-300"
                                                : "translate-y-5 opacity-0"
                                        }`}
                                    >
                                        {slide.text}
                                    </p>
                                )}
                                {slide.cta &&
                                    (slide.cta.external ? (
                                        <a
                                            href={slide.cta.to}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={ctaClass(active)}
                                        >
                                            {slide.cta.label}
                                            {ctaArrow}
                                        </a>
                                    ) : (
                                        <Link
                                            to={slide.cta.to}
                                            className={ctaClass(active)}
                                        >
                                            {slide.cta.label}
                                            {ctaArrow}
                                        </Link>
                                    ))}
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Controls: only when there is something to switch between. */}
            {count > 1 && (
                <div className="container-luxe absolute inset-x-0 bottom-7 flex items-center justify-between gap-6 sm:bottom-9">
                    <div className="flex items-center gap-2.5">
                        {slides.map((slide, i) => (
                            <button
                                key={slide.key}
                                type="button"
                                onClick={() => setCurrent(i)}
                                aria-label={t("banner.go_to_slide", {
                                    n: i + 1,
                                })}
                                aria-current={i === current}
                                className="group cursor-pointer py-3"
                            >
                                <span
                                    className={`ease-luxe block h-[2px] transition-all duration-700 ${
                                        i === current
                                            ? "bg-blush w-12"
                                            : "bg-blush/40 group-hover:bg-blush/70 w-6"
                                    }`}
                                />
                            </button>
                        ))}
                    </div>

                    <div className="hidden items-center gap-2 lg:flex">
                        <button
                            type="button"
                            onClick={() => go(-1)}
                            aria-label={t("banner.previous")}
                            className="border-blush/40 text-blush hover:bg-blush hover:text-ink flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border transition-colors duration-300"
                        >
                            <ArrowLeftIcon className="h-4 w-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => go(1)}
                            aria-label={t("banner.next")}
                            className="border-blush/40 text-blush hover:bg-blush hover:text-ink flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border transition-colors duration-300"
                        >
                            <ArrowRightIcon className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default TituleBlock;
