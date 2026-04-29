import { useState, useEffect } from "react";
import { Link } from "react-router";
import ProductCard from "../ProductCard/ProductCard";
import { useTranslation } from "react-i18next";
import api from "../../api/api";
import type { SpecialProps, ProductMini } from "../../types/types";

const SkeletonCard = () => (
    <div className="animate-pulse">
        <div className="ribbon-frame aspect-[3/4] w-full" />
        <div className="mt-5 space-y-2 mx-auto">
            <div className="h-4 w-2/3 mx-auto bg-[var(--color-line)]" />
            <div className="h-3 w-1/3 mx-auto bg-[var(--color-line)]" />
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
        <section className="w-full px-5 sm:px-8 lg:px-12 py-20 sm:py-24">
            {/* Centered header with ornament */}
            <div className="mb-14 text-center">
                <span className="ornament block text-xs text-[var(--color-gold)] mb-4 flicker">
                    ✦
                </span>
                <h2 className="font-display italic text-[var(--color-burgundy)] text-3xl sm:text-4xl lg:text-5xl">
                    {t(`specials.${setting.toLowerCase()}`)}
                </h2>
                <div className="mt-5 mx-auto max-w-xs gold-rule" />
                <Link
                    to={`/Catalog?filter=${setting.toLowerCase()}`}
                    className="mt-6 inline-flex items-center gap-3 eyebrow text-[var(--color-burgundy)] transition-all duration-500 hover:tracking-[0.5em] hover:text-[var(--color-gold-deep)]"
                >
                    {t("specials.show_all")}
                    <span aria-hidden="true">→</span>
                </Link>
            </div>

            <div className="grid w-full grid-cols-2 gap-x-5 gap-y-14 sm:gap-x-8 md:grid-cols-4 lg:gap-x-10 max-w-6xl mx-auto">
                {loading &&
                    Array.from({ length: 4 }).map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                {error && (
                    <p className="col-span-full py-8 text-center text-sm text-[var(--color-burgundy)]">
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
