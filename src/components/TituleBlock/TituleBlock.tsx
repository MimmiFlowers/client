import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import banner480 from "../../assets/images/banner-480.webp";
import banner960 from "../../assets/images/banner-960.webp";
import { ArrowLeftIcon, ArrowRightIcon } from "../Icons/Icons";

type Slide = {
    titleKey: string;
    subtitleKey: string;
    ctaKey: string;
    ctaLink: string;
    /** Background picture for this slide. Swap per slide as photos arrive. */
    image: { small: string; large: string };
};

const slides: Slide[] = [
    {
        titleKey: "home.hero_title",
        subtitleKey: "banner.slide1_subtitle",
        ctaKey: "banner.slide3_cta",
        ctaLink: "/Catalog",
        image: { small: banner480, large: banner960 },
    },
    {
        titleKey: "banner.slide2_title",
        subtitleKey: "banner.slide2_subtitle",
        ctaKey: "banner.slide2_cta",
        ctaLink: "/Catalog?filter=season",
        image: { small: banner480, large: banner960 },
    },
    {
        titleKey: "banner.slide3_title",
        subtitleKey: "banner.slide3_subtitle",
        ctaKey: "banner.slide3_cta",
        ctaLink: "/Catalog",
        image: { small: banner480, large: banner960 },
    },
];

const INTERVAL_MS = 7000;
const SWIPE_THRESHOLD = 50;

const TituleBlock = () => {
    const { t } = useTranslation();
    const [current, setCurrent] = useState(0);
    const [paused, setPaused] = useState(false);
    const touchStartX = useRef(0);
    const touchDeltaX = useRef(0);

    const go = useCallback(
        (step: number) =>
            setCurrent((prev) => (prev + step + slides.length) % slides.length),
        [],
    );

    // Auto-advance, unless hovered/focused or the visitor prefers less motion.
    useEffect(() => {
        if (paused) return;
        if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches)
            return;
        const timer = window.setInterval(() => go(1), INTERVAL_MS);
        return () => window.clearInterval(timer);
    }, [paused, go]);

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0]?.clientX ?? 0;
        touchDeltaX.current = 0;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchDeltaX.current = (e.touches[0]?.clientX ?? 0) - touchStartX.current;
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

    return (
        <section
            aria-roledescription="carousel"
            aria-label={t("banner.aria_label")}
            className="relative isolate h-[72dvh] max-h-[46rem] min-h-[27rem] w-full overflow-hidden bg-ink sm:h-[76dvh] lg:h-[80dvh]"
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
                        key={slide.titleKey}
                        role="group"
                        aria-roledescription="slide"
                        aria-label={`${i + 1} / ${slides.length}`}
                        aria-hidden={!active}
                        inert={!active}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-luxe ${
                            active ? "opacity-100" : "opacity-0"
                        }`}
                    >
                        <img
                            src={slide.image.large}
                            srcSet={`${slide.image.small} 480w, ${slide.image.large} 960w`}
                            sizes="100vw"
                            alt=""
                            aria-hidden="true"
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
                        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/55 to-ink/25" />
                        <div className="absolute inset-0 bg-gradient-to-r from-ink/45 via-transparent to-transparent" />

                        <div className="container-luxe absolute inset-0 flex flex-col justify-end pb-20 sm:pb-24 lg:pb-28">
                            <div className="max-w-2xl">
                                <p
                                    className={`font-display text-hero leading-[0.95] font-medium tracking-[-0.03em] text-blush transition-all duration-1000 ease-luxe ${
                                        active
                                            ? "translate-y-0 opacity-100 delay-200"
                                            : "translate-y-5 opacity-0"
                                    }`}
                                >
                                    {t(slide.titleKey)}
                                </p>
                                <p
                                    className={`mt-5 max-w-lg text-lead leading-relaxed text-blush/85 transition-all duration-1000 ease-luxe ${
                                        active
                                            ? "translate-y-0 opacity-100 delay-300"
                                            : "translate-y-5 opacity-0"
                                    }`}
                                >
                                    {t(slide.subtitleKey)}
                                </p>
                                <Link
                                    to={slide.ctaLink}
                                    className={`group mt-8 inline-flex h-14 items-center gap-5 rounded-full bg-blush pr-2 pl-7 text-label font-medium tracking-[0.18em] text-ink uppercase transition-all duration-1000 ease-luxe active:scale-[0.98] ${
                                        active
                                            ? "translate-y-0 opacity-100 delay-[400ms]"
                                            : "translate-y-5 opacity-0"
                                    }`}
                                >
                                    {t(slide.ctaKey)}
                                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-ink transition-transform duration-500 ease-luxe group-hover:translate-x-1">
                                        <ArrowRightIcon className="h-4 w-4" />
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Controls */}
            <div className="container-luxe absolute inset-x-0 bottom-7 flex items-center justify-between gap-6 sm:bottom-9">
                <div className="flex items-center gap-2.5">
                    {slides.map((slide, i) => (
                        <button
                            key={slide.titleKey}
                            type="button"
                            onClick={() => setCurrent(i)}
                            aria-label={t("banner.go_to_slide", { n: i + 1 })}
                            aria-current={i === current}
                            className="group cursor-pointer py-3"
                        >
                            <span
                                className={`block h-[2px] transition-all duration-700 ease-luxe ${
                                    i === current
                                        ? "w-12 bg-blush"
                                        : "w-6 bg-blush/40 group-hover:bg-blush/70"
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
                        className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-blush/40 text-blush transition-colors duration-300 hover:bg-blush hover:text-ink"
                    >
                        <ArrowLeftIcon className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => go(1)}
                        aria-label={t("banner.next")}
                        className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-blush/40 text-blush transition-colors duration-300 hover:bg-blush hover:text-ink"
                    >
                        <ArrowRightIcon className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default TituleBlock;
