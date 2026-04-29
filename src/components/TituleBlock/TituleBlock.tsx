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

const BotanicalBranch = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 200 400" fill="none" className={className} aria-hidden="true">
        <path d="M100 0 C 95 100, 105 200, 100 400" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        {[...Array(8)].map((_, i) => {
            const y = 50 + i * 45;
            const side = i % 2 === 0 ? 1 : -1;
            return (
                <g key={i}>
                    <path
                        d={`M100 ${y} C ${100 + side * 30} ${y - 10}, ${100 + side * 50} ${y + 5}, ${100 + side * 60} ${y + 20}`}
                        stroke="currentColor"
                        strokeWidth="0.8"
                        fill="none"
                    />
                    <ellipse
                        cx={100 + side * 55}
                        cy={y + 15}
                        rx="14"
                        ry="6"
                        fill="currentColor"
                        opacity="0.85"
                        transform={`rotate(${side * 35} ${100 + side * 55} ${y + 15})`}
                    />
                </g>
            );
        })}
    </svg>
);

const TituleBlock = () => {
    const { t } = useTranslation();
    const [current, setCurrent] = useState(0);
    const [paused, setPaused] = useState(false);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const goTo = useCallback((i: number) => setCurrent(i), []);
    const next = useCallback(() => setCurrent((p) => (p + 1) % slides.length), []);
    const prev = useCallback(() => setCurrent((p) => (p - 1 + slides.length) % slides.length), []);

    useEffect(() => {
        if (paused) return;
        const t = setInterval(next, INTERVAL_MS);
        return () => clearInterval(t);
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
        >
            {/* Decorative botanical branches */}
            <BotanicalBranch className="pointer-events-none absolute -top-10 -left-12 h-[110%] w-40 text-[var(--color-leaf)]/30 sway hidden md:block" />
            <BotanicalBranch className="pointer-events-none absolute -right-12 -bottom-10 h-[110%] w-40 rotate-180 text-[var(--color-leaf)]/25 hidden md:block" />

            <div className="mx-auto grid w-[92%] gap-10 py-12 md:w-[88%] md:grid-cols-12 md:gap-12 md:py-20">
                {/* Image — organic asymmetric frame */}
                <div className="relative md:col-span-7 md:order-2">
                    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-tl-[40%] rounded-tr-2xl rounded-br-[40%] rounded-bl-2xl md:aspect-[5/6] md:rounded-tl-[55%] md:rounded-br-[55%]">
                        {slides.map((_, i) => (
                            <img
                                key={i}
                                src={bannerMock}
                                alt=""
                                aria-hidden="true"
                                draggable={false}
                                className={`absolute inset-0 h-full w-full object-cover transition-all duration-[1500ms] ease-out ${
                                    i === current ? "scale-100 opacity-100" : "scale-105 opacity-0"
                                }`}
                            />
                        ))}
                        {/* Soft warm overlay */}
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[var(--color-accent)]/15 via-transparent to-[var(--color-leaf)]/10" />
                    </div>

                    {/* Hand-stamped "from the atelier" badge */}
                    <div className="absolute -top-4 -left-3 flex h-24 w-24 rotate-[-8deg] items-center justify-center rounded-full border border-dashed border-[var(--color-accent)] bg-[var(--color-cream)]/95 sm:-top-6 sm:-left-6 sm:h-32 sm:w-32">
                        <div className="text-center">
                            <p className="text-[0.55rem] tracking-[0.34em] uppercase text-[var(--color-accent-deep)] sm:text-[0.6rem]">
                                From the
                            </p>
                            <p className="font-display text-base text-[var(--color-ink)] sm:text-xl">
                                Atelier
                            </p>
                            <p className="text-[0.55rem] tracking-[0.34em] uppercase text-[var(--color-leaf-deep)] sm:text-[0.6rem]">
                                — est. 2019
                            </p>
                        </div>
                    </div>
                </div>

                {/* Text */}
                <div className="relative z-10 flex flex-col justify-center md:col-span-5 md:order-1">
                    <span className="eyebrow mb-5 flex items-center gap-3">
                        <span className="h-px w-8 bg-[var(--color-accent)]" />
                        Maison Mimmi · No. {String(current + 1).padStart(2, "0")}
                    </span>

                    <h1
                        key={current}
                        className="grow-in font-display text-[2.5rem] leading-[1.0] tracking-[-0.02em] text-[var(--color-ink)] sm:text-[3.5rem] md:text-[4.25rem] lg:text-[5rem]"
                    >
                        {t(slide.titleKey)}
                    </h1>

                    <p
                        key={`s-${current}`}
                        className="grow-in mt-6 max-w-md text-base leading-relaxed text-[var(--color-fg-soft)] sm:text-lg italic"
                        style={{ animationDelay: "150ms" }}
                    >
                        {t(slide.subtitleKey)}
                    </p>

                    <div className="mt-8 flex items-center gap-6 sm:mt-10">
                        <Link
                            to={slide.ctaLink ?? "/Catalog"}
                            className="group inline-flex items-center gap-3 rounded-full bg-[var(--color-leaf-deep)] px-7 py-3.5 text-[0.72rem] tracking-[0.26em] uppercase text-[var(--color-cream)] shadow-md transition-all duration-500 hover:bg-[var(--color-accent-deep)] hover:shadow-lg sm:px-9 sm:py-4"
                        >
                            {slide.ctaKey ? t(slide.ctaKey) : t("buttons.discover")}
                            <span className="inline-block transition-transform duration-500 group-hover:translate-x-1">
                                ›
                            </span>
                        </Link>

                        <div className="flex items-center gap-2">
                            {slides.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => goTo(i)}
                                    className={`h-2 rounded-full transition-all duration-500 ${
                                        i === current
                                            ? "w-7 bg-[var(--color-accent-deep)]"
                                            : "w-2 bg-[var(--color-line)] hover:bg-[var(--color-accent)]/60"
                                    }`}
                                    aria-label={`Slide ${i + 1}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Hand-written caption */}
                    <p className="mt-10 max-w-xs text-sm italic text-[var(--color-leaf-deep)] sm:mt-14">
                        “Composed slowly, by hand, in soft morning light.”
                    </p>
                </div>
            </div>
        </section>
    );
};

export default TituleBlock;
