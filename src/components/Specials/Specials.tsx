import { useState, useEffect } from "react";
import { Link } from "react-router";
import ProductCard from "../ProductCard/ProductCard";
import { useTranslation } from "react-i18next";
import api from "../../api/api";
import type { SpecialProps, ProductMini } from "../../types/types";

const SkeletonCard = () => (
    <div className="animate-pulse">
        <div className="aspect-[3/4] w-full rounded-tl-[35%] rounded-tr-2xl rounded-br-[35%] rounded-bl-2xl bg-[var(--color-line)]/50" />
        <div className="mt-4 flex justify-between gap-3">
            <div className="h-4 w-32 rounded bg-[var(--color-line)]/50" />
            <div className="h-4 w-12 rounded bg-[var(--color-line)]/50" />
        </div>
    </div>
);

const Sprig = () => (
    <svg viewBox="0 0 24 12" fill="currentColor" className="h-3 w-6 text-[var(--color-leaf)]" aria-hidden="true">
        <ellipse cx="6" cy="6" rx="4" ry="2" transform="rotate(-25 6 6)" />
        <ellipse cx="18" cy="6" rx="4" ry="2" transform="rotate(25 18 6)" />
        <circle cx="12" cy="6" r="1.2" />
    </svg>
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
                const response = await api.get(`/data/category/${setting.toLowerCase()}`);
                setProductsMini(response.data.data);
            } catch {
                setError(t("errors.load_products"));
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [setting, t]);

    return (
        <section className="mx-auto mt-24 w-[92%] md:w-[88%]">
            {/* Section header — centered with sprigs */}
            <div className="mb-12 flex flex-col items-center text-center">
                <div className="flex items-center gap-3">
                    <Sprig />
                    <p className="eyebrow">Hand-picked</p>
                    <Sprig />
                </div>
                <h2 className="mt-3 font-display text-4xl italic leading-[1.05] tracking-[-0.02em] text-[var(--color-ink)] sm:text-5xl md:text-[3.5rem]">
                    {t(`specials.${setting.toLowerCase()}`)}
                </h2>
                <Link
                    to={`/Catalog?filter=${setting.toLowerCase()}`}
                    className="group mt-5 inline-flex items-center gap-2 text-[0.72rem] tracking-[0.28em] uppercase text-[var(--color-accent-deep)]"
                >
                    <span className="wavy-underline pb-1.5">
                        {t("specials.show_all")}
                    </span>
                    <span className="transition-transform duration-500 group-hover:translate-x-1">›</span>
                </Link>
            </div>

            <div className="grid w-full grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
                {loading && Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
                {error && (
                    <p className="col-span-full py-8 text-center text-sm text-[var(--color-accent-deep)]">{error}</p>
                )}
                {!loading && !error &&
                    productsMini.map((p) => (
                        <ProductCard key={p.productID} productMini={p} />
                    ))}
            </div>
        </section>
    );
};

export default Specials;
