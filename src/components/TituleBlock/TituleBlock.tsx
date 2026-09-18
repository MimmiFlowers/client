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
        ctaKey: "banner.slide3_cta",
        ctaLink: "/Catalog",
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

const INTERVAL_MS = 6000;

const TituleBlock = () => {
    const { t } = useTranslation();
    const [current, setCurrent] = useState(0);
    const [paused, setPaused] = useState(false);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const goTo = useCallback((index: number) => {
        setCurrent(index);
    }, []);

    const next = useCallback(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
    }, []);

    const prev = useCallback(() => {
        setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    }, []);

    // Auto-rotate
    useEffect(() => {
        if (paused) return;
        const timer = setInterval(next, INTERVAL_MS);
        return () => clearInterval(timer);
    }, [paused, next]);

    // Swipe handlers
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

    return (
        <div
            className="relative h-[62vh] max-h-[760px] min-h-[460px] w-full overflow-hidden sm:h-[70vh] md:h-[82vh]"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            aria-roledescription="carousel"
            aria-label="Promotional banners"
        >
            {/* Slides track */}
            <div
                className="flex h-full transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ transform: `translateX(-${current * 100}%)` }}
            >
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className="relative flex h-full w-full flex-shrink-0 items-center justify-center"
                        role="group"
                        aria-roledescription="slide"
                        aria-label={`Slide ${index + 1} of ${slides.length}`}
                        aria-hidden={index !== current}
                    >
                        {/* Background image — slow Ken-Burns drift */}
                        <img
                            className="absolute h-full w-full scale-105 object-cover"
                            src={bannerMock}
                            alt=""
                            aria-hidden="true"
                            draggable={false}
                        />

                        {/* Editorial scrim: bottom gradient + soft center vignette for legibility */}
                        <div
                            className="pointer-events-none absolute inset-0"
                            style={{
                                background:
                                    "linear-gradient(180deg, rgba(20,26,21,0.42) 0%, rgba(20,26,21,0.20) 40%, rgba(20,26,21,0.58) 100%)",
                            }}
                        />
                        <div
                            className="pointer-events-none absolute inset-0"
                            style={{
                                background:
                                    "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(20,26,21,0.40) 0%, transparent 70%)",
                            }}
                        />
                        {/* thin brass frame */}
                        <div className="pointer-events-none absolute inset-4 border border-[rgba(204,176,132,0.45)] sm:inset-6 md:inset-8" />

                        {/* Content overlay */}
                        <div
                            className={`relative z-10 flex max-w-3xl flex-col items-center px-6 text-center ${
                                index === current ? "fade-up" : "opacity-0"
                            }`}
                        >
                            <span className="mb-4 text-[0.7rem] font-semibold tracking-[0.42em] text-[#e8d9bd] uppercase sm:text-xs">
                                Stockholm · Florist
                            </span>
                            <h2 className="font-[var(--font-display)] text-4xl leading-[1.05] font-medium tracking-[0.01em] text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.35)] sm:text-6xl md:text-[5.25rem]">
                                {t(slide.titleKey)}
                            </h2>
                            <p className="mt-5 max-w-xl text-base font-light text-white/90 drop-shadow-md sm:text-lg md:text-xl">
                                {t(slide.subtitleKey)}
                            </p>
                            {slide.ctaKey && slide.ctaLink && (
                                <Link
                                    to={slide.ctaLink}
                                    className="ui-label mt-8 inline-flex items-center gap-2 rounded-full border border-white/70 px-8 py-3 text-xs text-white backdrop-blur-[2px] transition-all duration-500 hover:border-white hover:bg-white hover:text-[var(--color-ink)] sm:text-sm"
                                >
                                    {t(slide.ctaKey)}
                                    <span aria-hidden="true">&rarr;</span>
                                </Link>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Dot indicators */}
            <div className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 gap-2.5 sm:bottom-10">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goTo(index)}
                        className={`h-[3px] rounded-full transition-all duration-500 ${
                            index === current
                                ? "w-10 bg-[#e8d9bd]"
                                : "w-5 bg-white/40 hover:bg-white/70"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                        aria-current={index === current ? "true" : undefined}
                    />
                ))}
            </div>

            {/* Arrow buttons — desktop only */}
            <button
                onClick={prev}
                className="absolute top-1/2 left-5 z-10 hidden -translate-y-1/2 cursor-pointer text-white/70 transition-all duration-300 hover:text-white md:block"
                aria-label="Previous slide"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.25}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <button
                onClick={next}
                className="absolute top-1/2 right-5 z-10 hidden -translate-y-1/2 cursor-pointer text-white/70 transition-all duration-300 hover:text-white md:block"
                aria-label="Next slide"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.25}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    );
};

export default TituleBlock;
