import { useState } from "react";
import { useNavigate } from "react-router";
import type { ProductMini } from "../../types/types";

const ProductCard = ({ productMini }: { productMini: ProductMini }) => {
    const navigate = useNavigate();
    const [hovered, setHovered] = useState(false);

    const handleRedirect = () => navigate(`/Catalog/${productMini.productID}`);
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleRedirect();
        }
    };

    return (
        <div
            className="group cursor-pointer"
            onClick={handleRedirect}
            onKeyDown={handleKeyDown}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            role="button"
            tabIndex={0}
            aria-label={`${productMini.name}, ${productMini.price} kr`}
        >
            {/*
                Asymmetric organic frame.
                - Border-radius slightly tamed so the "Fresh" badge in the
                  top-left isn't sliced by the curve.
                - `isolation: isolate` + `translateZ(0)` force the parent into
                  its own compositing layer, which fixes the WebKit/Safari bug
                  where `overflow: hidden` + `border-radius` + a transformed
                  child causes the rounded clip to fail (silhouette flashes
                  to a rectangle on hover).
            */}
            <div
                className="relative aspect-[3/4] w-full overflow-hidden bg-[var(--color-surface)] transition-[box-shadow] duration-700 ease-out"
                style={{
                    borderRadius: "18% 12% 18% 12% / 14% 18% 14% 18%",
                    isolation: "isolate",
                    transform: "translateZ(0)",
                    willChange: "transform",
                    boxShadow: hovered
                        ? "0 22px 50px -22px rgba(58,20,34,0.45), inset 0 0 0 1px rgba(184,137,59,0.35)"
                        : "0 10px 30px -18px rgba(58,20,34,0.25), inset 0 0 0 1px rgba(184,137,59,0.15)",
                }}
            >
                <img
                    className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-[1100ms] ease-out group-hover:scale-[1.05]"
                    src={productMini.picture}
                    alt={productMini.name}
                    loading="lazy"
                />

                {/* Warm overlay on hover */}
                <div
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--color-burgundy-deep)]/45 via-[var(--color-burgundy)]/10 to-transparent transition-opacity duration-700 ${
                        hovered ? "opacity-100" : "opacity-0"
                    }`}
                />

                {/* "Fresh" badge — INSIDE the frame, inset enough to clear the curve */}
                <div className="pointer-events-none absolute top-5 left-5 inline-flex items-center gap-1.5 rounded-full bg-[var(--color-cream)]/95 px-3.5 py-1.5 shadow-md ring-1 ring-[var(--color-gold)]/45 backdrop-blur-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-gold)]" />
                    <span className="text-[0.92rem] tracking-[0.24em] uppercase text-[var(--color-burgundy)] font-medium">
                        Fresh
                    </span>
                </div>

                {/* Quick view */}
                <div
                    className={`absolute inset-x-8 bottom-7 flex items-center justify-center rounded-full bg-[var(--color-cream)]/95 px-4 py-2.5 text-[0.95rem] tracking-[0.26em] uppercase text-[var(--color-burgundy)] backdrop-blur-md shadow-md transition-all duration-500 ${
                        hovered ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                    }`}
                >
                    Discover ›
                </div>
            </div>

            {/* Info */}
            <div className="mt-4 flex items-baseline justify-between gap-3 px-1">
                <p className="font-display text-lg leading-tight text-[var(--color-ink)] wavy-underline sm:text-xl">
                    {productMini.name}
                </p>
                <p className="shrink-0 text-lg text-[var(--color-burgundy)] font-display sm:text-xl">
                    {productMini.price.toLocaleString()}
                    <span className="ml-1 text-sm tracking-widest text-[var(--color-muted)]">kr</span>
                </p>
            </div>
        </div>
    );
};

export default ProductCard;
