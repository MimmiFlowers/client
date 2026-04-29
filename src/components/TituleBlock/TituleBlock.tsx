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
    { titleKey: "banner.slide1_title", subtitleKey: "banner.slide1_subtitle" },
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

const INTERVAL_MS = 7500;

const TituleBlock = () => {
    const { t } = useTranslation();
    const [current, setCurrent] = useState(0);
    const [paused, setPaused] = useState(false);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const goTo = useCallback((i: number) => setCurrent(i), []);
    const next = useCallback(
        () => setCurrent((p) => (p + 1) % slides.length),
        [],
    );
    const prev = useCallback(
        () => setCurrent((p) => (p - 1 + slides.length) % slides.length),
        [],
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
        if (diff > 50) next();
        else if (diff < -50) prev();
    };

    const slide = slides[current]!;

    return (
        <section
            className="relative w-full overflow-hidden bg-[var(--color-bg)]"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            aria-roledescription="carousel"
            aria-label="Editorial banner"
        >
            {/* Top eyebrow ribbon */}
            <div className="mx-auto flex w-[92%] items-center justify-between pt-8 pb-2 text-[var(--color-muted)] md:w-[88%] md:pt-10">
                <span className="eyebrow">Volume I — {new Date().getFullYear()}</span>
                <span className="hidden eyebrow md:inline">Stockholm · Atelier</span>
            </div>
            <div className="mx-auto w-[92%] gold-rule md:w-[88%]" />

            {/* Editorial split */}
            <div className="mx-auto grid w-[92%] gap-8 py-10 md:w-[88%] md:grid-cols-12 md:gap-12 md:py-16">
                {/* Left text column */}
                <div className="relative z-10 flex flex-col justify-center md:col-span-6 lg:col-span-5">
                    <span className="eyebrow mb-4 sm:mb-6">
                        № {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")} · {t("banner.slide" + (current + 1) + "_title").split(" ")[0]}
                    </span>

                    <h1
                        key={current}
                        className="reveal font-display text-[2.75rem] leading-[0.95] tracking-[-0.03em] text-[var(--color-ink)] sm:text-[3.75rem] md:text-[4.5rem] lg:text-[5.75rem]"
                    >
                        {t(slide.titleKey)}
                    </h1>

                    <p
                        key={`s-${current}`}
                        className="reveal mt-6 max-w-md text-base leading-relaxed text-[var(--color-fg-soft)] sm:text-lg md:text-xl"
                        style={{ animationDelay: "120ms" }}
                    >
                        — {t(slide.subtitleKey)}
                    </p>

                    <div className="mt-8 flex items-center gap-5 sm:mt-10">
                        <Link
                            to={slide.ctaLink ?? "/Catalog"}
                            className="group inline-flex items-center gap-3 text-[0.75rem] tracking-[0.3em] uppercase text-[var(--color-ink)]"
                        >
                            <span className="border-b border-[var(--color-ink)] pb-1 transition-colors duration-500 group-hover:border-[var(--color-accent)] group-hover:text-[var(--color-accent)]">
                                {slide.ctaKey ? t(slide.ctaKey) : t("buttons.discover")}
                            </span>
                            <span className="inline-block transition-transform duration-500 group-hover:translate-x-1">
                                ›
                            </span>
                        </Link>

                        {/* Slide selector */}
                        <div className="ml-auto flex items-center gap-2 md:ml-6">
                            {slides.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => goTo(i)}
                                    className={`h-px transition-all duration-500 ${
                                        i === current
                                            ? "w-10 bg-[var(--color-ink)]"
                                            : "w-5 bg-[var(--color-line)] hover:bg-[var(--color-muted)]"
                                    }`}
                                    aria-label={`Slide ${i + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right image — full bleed, framed */}
                <div className="relative md:col-span-6 lg:col-span-7">
                    <div className="relative aspect-[4/5] w-full overflow-hidden md:aspect-[5/6]">
                        {slides.map((_, i) => (
                            <img
                                key={i}
                                src={bannerMock}
                                alt=""
                                aria-hidden="true"
                                draggable={false}
                                className={`absolute inset-0 h-full w-full object-cover transition-all duration-[1400ms] ease-out ${
                                    i === current
                                        ? "scale-100 opacity-100"
                                        : "scale-105 opacity-0"
                                }`}
                            />
                        ))}
                        {/* Gold corner ticks */}
                        <span className="absolute top-3 left-3 h-6 w-px bg-[var(--color-cream)]/70" />
                        <span className="absolute top-3 left-3 h-px w-6 bg-[var(--color-cream)]/70" />
                        <span className="absolute right-3 bottom-3 h-6 w-px bg-[var(--color-cream)]/70" />
                        <span className="absolute right-3 bottom-3 h-px w-6 bg-[var(--color-cream)]/70" />

                        {/* Floating overlay caption */}
                        <div className="absolute bottom-5 left-5 max-w-[60%] rounded-none bg-[var(--color-cream)]/90 px-4 py-3 backdrop-blur-md sm:bottom-8 sm:left-8 sm:px-6 sm:py-4">
                            <p className="eyebrow !tracking-[0.42em] text-[var(--color-accent-deep)]">
                                Atelier
                            </p>
                            <p className="mt-1 font-display text-base leading-tight text-[var(--color-ink)] sm:text-lg">
                                {t("banner.signature_caption", "Composed by hand · Delivered with intent")}
                            </p>
                        </div>
                    </div>

                    {/* Floating index badge */}
                    <div className="absolute -top-4 -right-1 flex h-20 w-20 items-center justify-center rounded-full border border-[var(--color-accent)] bg-[var(--color-bg)] font-display text-2xl text-[var(--color-accent-deep)] sm:h-28 sm:w-28 sm:text-3xl">
                        {String(current + 1).padStart(2, "0")}
                    </div>
                </div>
            </div>

            <div className="mx-auto w-[92%] hairline md:w-[88%]" />
        </section>
    );
};

export default TituleBlock;
