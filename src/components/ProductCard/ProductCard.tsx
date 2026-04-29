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
            className="group cursor-pointer flex flex-col"
            onClick={handleRedirect}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-label={`${productMini.name}, ${productMini.price} kr`}
        >
            {/* Image plate — gold framed locket */}
            <div className="ribbon-frame aspect-[3/4] w-full">
                <img
                    src={productMini.picture}
                    alt={productMini.name}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-[1100ms] ease-out group-hover:scale-[1.06]"
                />
                {/* Burgundy veil on hover */}
                <div className="absolute inset-0 bg-[var(--color-burgundy)]/0 transition-colors duration-700 group-hover:bg-[var(--color-burgundy)]/22" />

                {/* Gold corner ornaments */}
                <span className="ornament absolute top-2 left-3 text-[10px] text-[var(--color-gold)]/70 transition-opacity duration-500 group-hover:text-[var(--color-gold-light)]">✦</span>
                <span className="ornament absolute top-2 right-3 text-[10px] text-[var(--color-gold)]/70 transition-opacity duration-500 group-hover:text-[var(--color-gold-light)]">✦</span>
                <span className="ornament absolute bottom-2 left-3 text-[10px] text-[var(--color-gold)]/70 transition-opacity duration-500 group-hover:text-[var(--color-gold-light)]">✦</span>
                <span className="ornament absolute bottom-2 right-3 text-[10px] text-[var(--color-gold)]/70 transition-opacity duration-500 group-hover:text-[var(--color-gold-light)]">✦</span>

                {/* Hover quick-look pill */}
                <div className="absolute inset-x-0 bottom-0 flex justify-center pb-5 opacity-0 translate-y-3 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                    <span className="eyebrow bg-[var(--color-burgundy)] text-[var(--color-bg)] px-4 py-2 shadow-[inset_0_0_0_1px_var(--color-gold)]">
                        Discover
                    </span>
                </div>
            </div>

            {/* Caption — calling card */}
            <div className="mt-5 text-center px-2">
                <p className="font-display italic text-[var(--color-burgundy)] text-xl leading-tight">
                    {productMini.name}
                </p>
                <div className="mt-2 mx-auto w-12 gold-hairline opacity-60" />
                <p className="mt-3 eyebrow tabular-nums">
                    {productMini.price.toLocaleString()}&nbsp;kr
                </p>
            </div>
        </article>
    );
};

export default ProductCard;
