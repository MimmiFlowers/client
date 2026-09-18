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
        <div
            className="group cursor-pointer"
            onClick={handleRedirect}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-label={`${productMini.name}, ${productMini.price} kr`}
        >
            {/* Image container */}
            <div className="relative overflow-hidden rounded-lg bg-[var(--color-cream)]">
                <img
                    className="aspect-[3/4] w-full object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                    src={productMini.picture}
                    alt={productMini.name}
                    loading="lazy"
                />
                {/* hover veil + view cue */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(20,26,21,0.28)] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="ui-label pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 translate-y-2 rounded-full bg-[var(--color-bg)]/90 px-4 py-1.5 text-[0.6rem] text-[var(--color-ink)] opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    View
                </span>
            </div>

            {/* Info */}
            <div className="mt-3.5 flex items-baseline justify-between gap-3 px-0.5">
                <p className="font-[var(--font-display)] text-[0.98rem] leading-tight tracking-[0.01em] text-[var(--color-ink)] sm:text-[1.05rem]">
                    {productMini.name}
                </p>
                <p className="shrink-0 font-[var(--font-sans)] text-sm font-medium tracking-wide text-[var(--color-fg-mid)]">
                    {productMini.price.toLocaleString()}&nbsp;kr
                </p>
            </div>
        </div>
    );
};

export default ProductCard;
