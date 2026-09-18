import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import type { Product } from "../../types/types";

const ProductList = ({ products }: { products: Product[] }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <svg
                    className="mb-4 h-14 w-14 text-[var(--color-line)]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                    />
                </svg>
                <p className="font-[var(--font-display)] text-xl text-[var(--color-ink)]">
                    {t("catalog.no_products")}
                </p>
                <p className="mt-1 text-sm text-[var(--color-muted)]">
                    {t("catalog.no_products_hint")}
                </p>
            </div>
        );
    }

    return (
        <div className="grid w-full grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
            {products.map((product) => (
                <div
                    key={product.productID}
                    className="group cursor-pointer"
                    onClick={() => navigate(`/Catalog/${product.productID}`)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            navigate(`/Catalog/${product.productID}`);
                        }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`${product.name}, ${product.price} kr`}
                >
                    {/* Image with collection badge */}
                    <div className="relative overflow-hidden rounded-lg bg-[var(--color-cream)]">
                        <img
                            src={product.picture}
                            alt={product.name}
                            className="aspect-[3/4] w-full object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                            loading="lazy"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(20,26,21,0.28)] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                        {/* Collection badge overlay */}
                        {product.collection && (
                            <span className="ui-label absolute top-3 left-3 rounded-full bg-[var(--color-bg)]/85 px-2.5 py-1 text-[0.6rem] text-[var(--color-fg-mid)] shadow-sm backdrop-blur-sm">
                                {product.collection}
                            </span>
                        )}
                    </div>

                    {/* Info */}
                    <div className="mt-3.5 flex items-baseline justify-between gap-3 px-0.5">
                        <p className="font-[var(--font-display)] text-[0.98rem] leading-tight tracking-[0.01em] text-[var(--color-ink)] sm:text-[1.05rem]">
                            {product.name}
                        </p>
                        <p className="shrink-0 font-[var(--font-sans)] text-sm font-medium tracking-wide text-[var(--color-fg-mid)]">
                            {product.price.toLocaleString()}&nbsp;kr
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductList;
