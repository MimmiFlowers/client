import { useNavigate } from "react-router";
import type { ProductMini } from "../../types/types";

const ProductCard = ({ productMini }: { productMini: ProductMini }) => {
    const navigate = useNavigate();

    const handleRedirect = () => {
        navigate(`/Catalog/${productMini.productID}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleRedirect();
        }
    };

    return (
        <article
            className="group cursor-pointer"
            onClick={handleRedirect}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-label={`${productMini.name}, ${productMini.price} kr`}
        >
            {/* Image plate — gallery framed, no border-radius */}
            <div className="tile-frame aspect-[3/4] w-full">
                <img
                    src={productMini.picture}
                    alt={productMini.name}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                />
                {/* Hover veil with quick-look label */}
                <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-[var(--color-obsidian)]/35 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <span className="eyebrow text-[var(--color-bg)] mb-5 tracking-[0.42em]">
                        Discover
                    </span>
                </div>
            </div>

            {/* Info — gallery label */}
            <div className="mt-5 flex items-start justify-between gap-4">
                <div>
                    <p className="font-display text-[var(--color-obsidian)] text-lg leading-tight">
                        {productMini.name}
                    </p>
                    <p className="eyebrow-muted mt-2">
                        Édition · Atelier
                    </p>
                </div>
                <p className="font-sans text-sm text-[var(--color-fg)] tabular-nums whitespace-nowrap">
                    {productMini.price.toLocaleString()}&nbsp;kr
                </p>
            </div>
        </article>
    );
};

export default ProductCard;
