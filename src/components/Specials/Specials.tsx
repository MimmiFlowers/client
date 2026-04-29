import { useState, useEffect } from "react";
import { Link } from "react-router";
import ProductCard from "../ProductCard/ProductCard";
import { useTranslation } from "react-i18next";
import api from "../../api/api";
import type { SpecialProps, ProductMini } from "../../types/types";

const SkeletonCard = () => (
    <div className="animate-pulse">
        <div className="tile-frame aspect-[3/4] w-full" />
        <div className="mt-5 space-y-2">
            <div className="h-4 w-2/3 bg-[var(--color-line)]" />
            <div className="h-3 w-1/3 bg-[var(--color-line)]" />
        </div>
    </div>
);

const Specials = ({ setting }: SpecialProps) => {
    const [productsMini, setProductsMini] = useState<ProductMini[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { t } = useTranslation();

    const fetchProductsMini = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await api.get(
                `/data/category/${setting.toLowerCase()}`
            );
            setProductsMini(response.data.data);
        } catch {
            setError(t("errors.load_products"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProductsMini();
    }, []);

    return (
        <section className="w-full px-5 sm:px-8 lg:px-12 py-16 sm:py-20 border-t border-[var(--color-line)]">
            {/* Header — wing label */}
            <div className="mb-10 sm:mb-14 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                    <span className="eyebrow-muted">— Selection</span>
                    <h2 className="mt-3 font-display text-[var(--color-obsidian)] text-3xl sm:text-4xl lg:text-5xl leading-tight">
                        {t(`specials.${setting.toLowerCase()}`)}
                    </h2>
                </div>
                <Link
                    to={`/Catalog?filter=${setting.toLowerCase()}`}
                    className="eyebrow text-[var(--color-fg)] inline-flex items-center gap-3 self-start sm:self-end transition-opacity duration-500 hover:opacity-60"
                >
                    {t("specials.show_all")}
                    <span aria-hidden="true">→</span>
                </Link>
            </div>

            {/* Product grid */}
            <div className="grid w-full grid-cols-2 gap-x-5 gap-y-12 sm:gap-x-8 md:grid-cols-4 lg:gap-x-10">
                {loading &&
                    Array.from({ length: 4 }).map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                {error && (
                    <p className="col-span-full py-8 text-center text-sm text-[var(--color-accent-deep)]">
                        {error}
                    </p>
                )}
                {!loading &&
                    !error &&
                    productsMini.map((productMini) => (
                        <ProductCard
                            key={productMini.productID}
                            productMini={productMini}
                        />
                    ))}
            </div>
        </section>
    );
};

export default Specials;
