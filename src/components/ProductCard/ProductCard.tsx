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
            {/* Image — no rounding, editorial portrait */}
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-[var(--color-cream)]">
                <img
                    className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-[1100ms] ease-out group-hover:scale-[1.04]"
                    src={productMini.picture}
                    alt={productMini.name}
                    loading="lazy"
                />
                {/* Subtle vignette on hover */}
                <div
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--color-ink)]/25 to-transparent transition-opacity duration-700 ${
                        hovered ? "opacity-100" : "opacity-0"
                    }`}
                />
                {/* Gold quick-view ribbon */}
                <div
                    className={`absolute inset-x-0 bottom-0 flex items-center justify-center bg-[var(--color-cream)]/90 px-4 py-3 text-[0.65rem] tracking-[0.32em] uppercase text-[var(--color-ink)] backdrop-blur-md transition-all duration-500 ${
                        hovered
                            ? "translate-y-0 opacity-100"
                            : "translate-y-full opacity-0"
                    }`}
                >
                    <span className="mr-2 h-px w-4 bg-[var(--color-accent)]" />
                    View piece
                    <span className="ml-2 h-px w-4 bg-[var(--color-accent)]" />
                </div>
            </div>

            {/* Info */}
            <div className="mt-4 flex items-start justify-between gap-3">
                <div>
                    <p className="font-display text-base leading-tight text-[var(--color-ink)] sm:text-lg">
                        {productMini.name}
                    </p>
                    <p className="mt-1 text-[0.65rem] tracking-[0.3em] uppercase text-[var(--color-muted)]">
                        Limited composition
                    </p>
                </div>
                <p className="shrink-0 font-display text-base text-[var(--color-accent-deep)] sm:text-lg">
                    {productMini.price.toLocaleString()}{" "}
                    <span className="text-xs tracking-widest text-[var(--color-muted)]">
                        kr
                    </span>
                </p>
            </div>
        </div>
    );
};

export default ProductCard;
