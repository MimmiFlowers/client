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
            {/* Asymmetric organic frame */}
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-tl-[35%] rounded-tr-2xl rounded-br-[35%] rounded-bl-2xl bg-[var(--color-surface)]">
                <img
                    className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-[1100ms] ease-out group-hover:scale-[1.06]"
                    src={productMini.picture}
                    alt={productMini.name}
                    loading="lazy"
                />
                {/* Warm overlay on hover */}
                <div
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--color-ink)]/30 to-transparent transition-opacity duration-700 ${
                        hovered ? "opacity-100" : "opacity-0"
                    }`}
                />

                {/* Sage badge */}
                <div className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full bg-[var(--color-cream)]/95 px-3 py-1 backdrop-blur-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-leaf)]" />
                    <span className="text-[0.6rem] tracking-[0.24em] uppercase text-[var(--color-leaf-deep)]">
                        Fresh
                    </span>
                </div>

                {/* Quick view */}
                <div
                    className={`absolute inset-x-4 bottom-4 flex items-center justify-center rounded-full bg-[var(--color-cream)]/95 px-4 py-2.5 text-[0.7rem] tracking-[0.26em] uppercase text-[var(--color-accent-deep)] backdrop-blur-md transition-all duration-500 ${
                        hovered ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                    }`}
                >
                    Discover ›
                </div>
            </div>

            {/* Info */}
            <div className="mt-4 flex items-baseline justify-between gap-3 px-1">
                <p className="font-display text-base leading-tight text-[var(--color-ink)] wavy-underline sm:text-lg">
                    {productMini.name}
                </p>
                <p className="shrink-0 text-base text-[var(--color-accent-deep)] font-display sm:text-lg">
                    {productMini.price.toLocaleString()}
                    <span className="ml-1 text-xs tracking-widest text-[var(--color-muted)]">kr</span>
                </p>
            </div>
        </div>
    );
};

export default ProductCard;
