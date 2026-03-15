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
            className="relative h-[45vh] w-full overflow-hidden sm:h-[55vh] md:h-[70vh]"
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
                className="flex h-full transition-transform duration-700 ease-in-out"
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
                        {/* Background image */}
                        <img
                            className="absolute h-full w-full object-cover blur-xs brightness-75"
                            src={bannerMock}
                            alt=""
                            aria-hidden="true"
                            draggable={false}
                        />

                        {/* Content overlay */}
                        <div className="relative z-10 flex flex-col items-center px-6 text-center">
                            <h2 className="text-3xl font-semibold text-white uppercase drop-shadow-lg sm:text-5xl md:text-7xl">
                                {t(slide.titleKey)}
                            </h2>
                            <p className="mt-2 max-w-xl text-base font-light text-white/90 drop-shadow-md sm:mt-3 sm:text-lg md:mt-4 md:text-xl">
                                {t(slide.subtitleKey)}
                            </p>
                            {slide.ctaKey && slide.ctaLink && (
                                <Link
                                    to={slide.ctaLink}
                                    className="mt-4 inline-block rounded-full bg-white/90 px-6 py-2 text-sm font-semibold text-black uppercase tracking-wide shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white sm:mt-5 sm:px-8 sm:py-2.5 sm:text-base md:mt-6"
                                >
                                    {t(slide.ctaKey)}
                                </Link>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Dot indicators */}
            <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2.5 sm:bottom-6">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goTo(index)}
                        className={`h-2.5 rounded-full transition-all duration-300 ${
                            index === current
                                ? "w-7 bg-white"
                                : "w-2.5 bg-white/50 hover:bg-white/80"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                        aria-current={index === current ? "true" : undefined}
                    />
                ))}
            </div>

            {/* Arrow buttons — desktop only */}
            <button
                onClick={prev}
                className="absolute top-1/2 left-3 z-10 hidden -translate-y-1/2 cursor-pointer rounded-full bg-black/20 p-2 text-white backdrop-blur-sm transition-all duration-300 hover:bg-black/40 sm:left-4 md:block"
                aria-label="Previous slide"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <button
                onClick={next}
                className="absolute top-1/2 right-3 z-10 hidden -translate-y-1/2 cursor-pointer rounded-full bg-black/20 p-2 text-white backdrop-blur-sm transition-all duration-300 hover:bg-black/40 sm:right-4 md:block"
                aria-label="Next slide"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    );
};

export default TituleBlock;
