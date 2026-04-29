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

    return (
        <section
            className="relative w-full"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            aria-roledescription="carousel"
            aria-label="Featured collections"
        >
            {/* Image plate with ornate frame */}
            <div className="relative h-[58vh] sm:h-[70vh] md:h-[82vh] w-full overflow-hidden">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        role="group"
                        aria-roledescription="slide"
                        aria-label={`Slide ${index + 1} of ${slides.length}`}
                        aria-hidden={index !== current}
                        className={`absolute inset-0 transition-opacity duration-1000 ${
                            index === current ? "opacity-100" : "opacity-0 pointer-events-none"
                        }`}
                    >
                        <img
                            src={bannerMock}
                            alt=""
                            aria-hidden="true"
                            draggable={false}
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                        {/* Candlelit veil */}
                        <div
                            className="absolute inset-0"
                            style={{
                                background:
                                    "radial-gradient(ellipse at 50% 60%, rgba(74,20,36,0.15) 0%, rgba(74,20,36,0.55) 75%, rgba(34,12,18,0.78) 100%)",
                            }}
                        />

                        {/* Gold ornate border */}
                        <div className="pointer-events-none absolute inset-4 sm:inset-8 border border-[var(--color-gold)]/55" />
                        <div className="pointer-events-none absolute inset-5 sm:inset-9 border border-[var(--color-gold)]/25" />

                        {/* Corner ornaments */}
                        <span className="ornament absolute top-4 left-1/2 -translate-x-1/2 sm:top-8 text-base text-[var(--color-gold-light)] flicker">✦ ✦ ✦</span>
                        <span className="ornament absolute bottom-4 left-1/2 -translate-x-1/2 sm:bottom-8 text-base text-[var(--color-gold-light)] flicker">✦ ✦ ✦</span>

                        {/* Content */}
                        {index === current && (
                            <div className="ribbon-reveal relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
                                <span className="eyebrow text-[var(--color-gold-light)] mb-5">
                                    — Maison · Édition —
                                </span>

                                <h1 className="font-display italic text-[var(--color-bg)] leading-[1.02] text-[clamp(2.5rem,7vw,5.5rem)] max-w-4xl drop-shadow-[0_2px_30px_rgba(74,20,36,0.55)]">
                                    {t(slide.titleKey)}
                                </h1>

                                <div className="mt-6 flex items-center gap-3 max-w-md w-full">
                                    <span className="h-px flex-1 bg-[var(--color-gold-light)]/55" />
                                    <span className="ornament text-xs text-[var(--color-gold-light)]">✦</span>
                                    <span className="h-px flex-1 bg-[var(--color-gold-light)]/55" />
                                </div>

                                <p className="mt-6 max-w-xl text-base sm:text-lg text-[var(--color-bg)]/90 leading-relaxed font-display italic">
                                    {t(slide.subtitleKey)}
                                </p>

                                {slide.ctaKey && slide.ctaLink ? (
                                    <Link
                                        to={slide.ctaLink}
                                        className="mt-9 inline-flex items-center gap-3 wax-seal-btn eyebrow text-[var(--color-bg)] px-9 py-4 hover:[background:var(--color-burgundy-deep)] hover:tracking-[0.42em]"
                                    >
                                        {t(slide.ctaKey)}
                                        <span aria-hidden="true">→</span>
                                    </Link>
                                ) : (
                                    <Link
                                        to="/Catalog"
                                        className="mt-9 inline-flex items-center gap-3 wax-seal-btn eyebrow text-[var(--color-bg)] px-9 py-4 hover:[background:var(--color-burgundy-deep)] hover:tracking-[0.42em]"
                                    >
                                        Enter the Salon
                                        <span aria-hidden="true">→</span>
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                ))}

                {/* Dots — gold seals */}
                <div className="absolute bottom-10 sm:bottom-14 left-1/2 z-20 flex -translate-x-1/2 gap-3">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goTo(index)}
                            className={`transition-all duration-500 ${
                                index === current
                                    ? "h-2.5 w-8 bg-[var(--color-gold-light)]"
                                    : "h-2.5 w-2.5 rounded-full bg-[var(--color-gold-light)]/40 hover:bg-[var(--color-gold-light)]/70"
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                            aria-current={index === current ? "true" : undefined}
                        />
                    ))}
                </div>

                {/* Arrows */}
                <button
                    onClick={prev}
                    className="absolute top-1/2 left-3 sm:left-6 z-20 hidden -translate-y-1/2 cursor-pointer h-11 w-11 rounded-full border border-[var(--color-gold-light)]/60 text-[var(--color-gold-light)] bg-[var(--color-burgundy)]/30 backdrop-blur-sm transition-all duration-300 hover:bg-[var(--color-burgundy)]/60 hover:scale-110 md:flex md:items-center md:justify-center"
                    aria-label="Previous slide"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <button
                    onClick={next}
                    className="absolute top-1/2 right-3 sm:right-6 z-20 hidden -translate-y-1/2 cursor-pointer h-11 w-11 rounded-full border border-[var(--color-gold-light)]/60 text-[var(--color-gold-light)] bg-[var(--color-burgundy)]/30 backdrop-blur-sm transition-all duration-300 hover:bg-[var(--color-burgundy)]/60 hover:scale-110 md:flex md:items-center md:justify-center"
                    aria-label="Next slide"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            <div className="gold-rule" />
        </section>
    );
};

export default TituleBlock;
