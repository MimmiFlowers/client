import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import bannerMock from "../../assets/images/bannerMock.jpg";

interface Slide {
    titleKey: string;
    subtitleKey: string;
    ctaKey?: string;
    ctaLink?: string;
}

const slides: Slide[] = [
    {
        titleKey: "banner.slide1_title",
        subtitleKey: "banner.slide1_subtitle",
    },
    {
        titleKey: "banner.slide2_title",
        subtitleKey: "banner.slide2_subtitle",
        ctaKey: "banner.slide2_cta",
        ctaLink: "/Catalog?filter=season",
    },
    {
        titleKey: "banner.slide3_title",
        subtitleKey: "banner.slide3_subtitle",
        ctaKey: "banner.slide3_cta",
        ctaLink: "/Catalog",
    },
];

const INTERVAL_MS = 7000;

const TituleBlock = () => {
    const { t } = useTranslation();
    const [current, setCurrent] = useState(0);
    const [paused, setPaused] = useState(false);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const goTo = useCallback((index: number) => setCurrent(index), []);
    const next = useCallback(
        () => setCurrent((p) => (p + 1) % slides.length),
        []
    );
    const prev = useCallback(
        () => setCurrent((p) => (p - 1 + slides.length) % slides.length),
        []
    );

    useEffect(() => {
        if (paused) return;
        const timer = setInterval(next, INTERVAL_MS);
        return () => clearInterval(timer);
    }, [paused, next]);

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0]?.clientX ?? 0;
    };
    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.touches[0]?.clientX ?? 0;
    };
    const handleTouchEnd = () => {
        const diff = touchStartX.current - touchEndX.current;
        const threshold = 50;
        if (diff > threshold) next();
        else if (diff < -threshold) prev();
    };

    const slide = slides[current] ?? slides[0]!;

    return (
        <section
            className="relative w-full bg-[var(--color-bg)]"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            aria-roledescription="carousel"
            aria-label="Featured collections"
        >
            {/* Top eyebrow row */}
            <div className="flex items-center justify-between px-5 sm:px-8 lg:px-12 pt-6 sm:pt-10">
                <span className="eyebrow-muted">— Maison · Stockholm</span>
                <span className="eyebrow-muted hidden sm:inline">
                    Édition&nbsp;{String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
                </span>
            </div>

            {/* Two-column hero: oversized type left, image plate right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 px-5 sm:px-8 lg:px-12 pt-6 sm:pt-10 pb-8 sm:pb-14">
                {/* Type column */}
                <div
                    className="lg:col-span-5 flex flex-col justify-end"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <div key={`text-${current}`} className="fade-up">
                        <h1 className="font-display leading-[0.95] text-[var(--color-obsidian)] text-[clamp(2.75rem,8vw,6.5rem)]">
                            {t(slide.titleKey)}
                        </h1>
                        <p className="mt-6 max-w-md text-[var(--color-fg-soft)] text-base sm:text-lg leading-relaxed">
                            {t(slide.subtitleKey)}
                        </p>

                        <div className="mt-8 flex items-center gap-6">
                            {slide.ctaKey && slide.ctaLink ? (
                                <Link
                                    to={slide.ctaLink}
                                    className="press-btn inline-flex items-center gap-3 bg-[var(--color-obsidian)] text-[var(--color-bg)] eyebrow px-7 py-4 hover:bg-[var(--color-fg-soft)]"
                                >
                                    {t(slide.ctaKey)}
                                    <span aria-hidden="true">→</span>
                                </Link>
                            ) : (
                                <Link
                                    to="/Catalog"
                                    className="press-btn inline-flex items-center gap-3 bg-[var(--color-obsidian)] text-[var(--color-bg)] eyebrow px-7 py-4 hover:bg-[var(--color-fg-soft)]"
                                >
                                    Discover
                                    <span aria-hidden="true">→</span>
                                </Link>
                            )}
                            <Link
                                to="/About"
                                className="eyebrow text-[var(--color-fg)] couture-link hover:[mask-image:linear-gradient(white,white)]"
                            >
                                The House
                            </Link>
                        </div>
                    </div>

                    {/* Slide indicators */}
                    <div className="mt-12 flex items-center gap-3">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goTo(index)}
                                aria-label={`Go to slide ${index + 1}`}
                                aria-current={index === current ? "true" : undefined}
                                className="group flex flex-col items-start gap-2"
                            >
                                <span
                                    className={`block h-px transition-all duration-500 ${
                                        index === current
                                            ? "w-12 bg-[var(--color-obsidian)]"
                                            : "w-6 bg-[var(--color-hairline)] group-hover:bg-[var(--color-fg-soft)]"
                                    }`}
                                />
                                <span
                                    className={`eyebrow transition-opacity duration-300 ${
                                        index === current ? "opacity-100" : "opacity-30"
                                    }`}
                                >
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Image plate */}
                <div className="lg:col-span-7 relative">
                    <div className="tile-frame aspect-[4/5] sm:aspect-[5/6] lg:aspect-[4/5] w-full">
                        {slides.map((_, index) => (
                            <img
                                key={index}
                                src={bannerMock}
                                alt=""
                                aria-hidden="true"
                                draggable={false}
                                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
                                    index === current ? "opacity-100 scale-in" : "opacity-0"
                                }`}
                            />
                        ))}
                    </div>

                    {/* Floating caption */}
                    <div className="absolute -bottom-3 left-4 sm:left-8 bg-[var(--color-bg)] px-4 py-2">
                        <span className="eyebrow-muted">Spring · Édition</span>
                    </div>
                </div>
            </div>

            <div className="hairline" />
        </section>
    );
};

export default TituleBlock;
