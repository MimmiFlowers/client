import { useState, useEffect } from "react";
import { Link } from "react-router";
import ProductCard from "../ProductCard/ProductCard";
import { useTranslation } from "react-i18next";
import api from "../../api/api";
import type { SpecialProps, ProductMini } from "../../types/types";

const SkeletonCard = () => (
    <div className="animate-pulse">
        <div className="aspect-[3/4] w-full bg-[var(--color-line)]/40" />
        <div className="mt-4 flex justify-between gap-3">
            <div>
                <div className="h-4 w-32 bg-[var(--color-line)]/50" />
                <div className="mt-2 h-2.5 w-20 bg-[var(--color-line)]/40" />
            </div>
            <div className="h-4 w-12 bg-[var(--color-line)]/40" />
        </div>
    </div>
);

const Specials = ({ setting }: SpecialProps) => {
    const [productsMini, setProductsMini] = useState<ProductMini[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { t } = useTranslation();

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            setError("");
            try {
                const response = await api.get(
                    `/data/category/${setting.toLowerCase()}`,
                );
                setProductsMini(response.data.data);
            } catch {
                setError(t("errors.load_products"));
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [setting, t]);

    const isFavorite = setting.toLowerCase() === "favorite";

    return (
        <section className="mx-auto mt-24 w-[92%] md:w-[88%]">
            {/* Editorial section header */}
            <div className="mb-10 flex items-end justify-between gap-6 md:mb-14">
                <div>
                    <p className="eyebrow text-[var(--color-accent-deep)]">
                        {isFavorite ? "Chapter One" : "Chapter Three"}
                    </p>
                    <h2 className="mt-3 font-display text-4xl leading-[1.02] tracking-[-0.02em] text-[var(--color-ink)] sm:text-5xl md:text-[3.75rem]">
                        {t(`specials.${setting.toLowerCase()}`)}
                    </h2>
                </div>
                <Link
                    to={`/Catalog?filter=${setting.toLowerCase()}`}
                    className="group hidden shrink-0 items-center gap-2 text-[0.7rem] tracking-[0.32em] uppercase text-[var(--color-ink)] sm:flex"
                >
                    <span className="border-b border-[var(--color-ink)] pb-0.5 transition-colors duration-500 group-hover:border-[var(--color-accent)] group-hover:text-[var(--color-accent-deep)]">
                        {t("specials.show_all")}
                    </span>
                    <span className="transition-transform duration-500 group-hover:translate-x-1">
                        ›
                    </span>
                </Link>
            </div>

            <div className="hairline mb-10" />

            {/* Product grid */}
            <div className="grid w-full grid-cols-2 gap-6 md:grid-cols-4 md:gap-10">
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
                    productsMini.map((p) => (
                        <ProductCard key={p.productID} productMini={p} />
                    ))}
            </div>

            {/* Mobile show-all */}
            <div className="mt-8 flex justify-center sm:hidden">
                <Link
                    to={`/Catalog?filter=${setting.toLowerCase()}`}
                    className="text-[0.7rem] tracking-[0.32em] uppercase text-[var(--color-ink)] border-b border-[var(--color-ink)] pb-0.5"
                >
                    {t("specials.show_all")} ›
                </Link>
            </div>
        </section>
    );
};

export default Specials;
