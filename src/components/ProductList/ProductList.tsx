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
                    className="mb-4 h-16 w-16 text-gray-300"
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
                <p className="text-lg font-medium text-gray-600">
                    {t("catalog.no_products")}
                </p>
                <p className="mt-1 text-sm text-gray-400">
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
                    <div className="relative overflow-hidden rounded-xl">
                        <img
                            src={product.picture}
                            alt={product.name}
                            className="aspect-[3/4] w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                        />
                        {/* Collection badge overlay */}
                        {product.collection && (
                            <span className="absolute top-3 left-3 rounded-full bg-white/85 px-2.5 py-1 text-xs font-medium uppercase tracking-wider text-gray-700 shadow-sm backdrop-blur-sm">
                                {product.collection}
                            </span>
                        )}
                    </div>

                    {/* Info */}
                    <div className="mt-3 px-0.5">
                        <p className="text-sm font-semibold uppercase leading-tight text-gray-900 sm:text-base">
                            {product.name}
                        </p>
                        <p className="mt-0.5 text-sm text-gray-600 sm:text-base">
                            {product.price.toLocaleString()} kr
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductList;
