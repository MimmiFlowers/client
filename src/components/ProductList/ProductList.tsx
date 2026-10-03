import { useTranslation } from "react-i18next";
import type { Product } from "../../types/types";
import ProductCard from "../ProductCard/ProductCard";
import { FlowerOutline } from "../Icons/Icons";

const ProductList = ({
    products,
    onClearAll,
}: {
    products: Product[];
    onClearAll?: () => void;
}) => {
    const { t } = useTranslation();

    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center border border-dashed border-line-strong px-6 py-20 text-center">
                <FlowerOutline />
                <p className="mt-6 font-display text-subtitle">
                    {t("catalog.no_products")}
                </p>
                <p className="mt-2 max-w-xs text-caption text-muted">
                    {t("catalog.no_products_hint")}
                </p>
                {onClearAll && (
                    <button
                        type="button"
                        onClick={onClearAll}
                        className="mt-8 min-h-11 cursor-pointer border-b border-ink pb-1 text-label font-medium tracking-[0.16em] uppercase"
                    >
                        {t("catalog.clear_all")}
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-14 lg:grid-cols-3">
            {products.map((product, i) => (
                <div
                    key={product.productID}
                    className="animate-rise"
                    style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}
                >
                    <ProductCard
                        productMini={product}
                        showCollection
                        eager={i < 4}
                    />
                </div>
            ))}
        </div>
    );
};

export default ProductList;
