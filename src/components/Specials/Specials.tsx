import { useState, useEffect } from "react";
import { Link } from "react-router";
import ProductCard from "../ProductCard/ProductCard";
import { useTranslation } from "react-i18next";
import api from "../../api/api";
import type { SpecialProps, ProductMini } from "../../types/types";

const SkeletonCard = () => (
    <div className="animate-pulse">
        <div className="aspect-[3/4] w-full rounded-lg bg-[var(--color-cream)]" />
        <div className="mt-3 px-0.5">
            <div className="h-4 w-3/4 rounded bg-[var(--color-cream)]" />
            <div className="mt-2 h-3.5 w-1/3 rounded bg-[var(--color-cream)]" />
        </div>
    </div>
);

/* eyebrow label per section */
const eyebrowFor = (setting: string) =>
    setting.toLowerCase() === "favorite" ? "Most Loved" : "In Season";

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
                `/data/category/${setting.toLowerCase()}`,
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
        <section className="w-[95%] sm:w-[90%] md:w-[80%]">
            {/* Editorial section header */}
            <div className="mt-16 mb-9 flex flex-col items-center text-center sm:mt-20">
                <span className="eyebrow">{eyebrowFor(setting)}</span>
                <h2 className="mt-3 font-[var(--font-display)] text-3xl tracking-[0.01em] text-[var(--color-ink)] sm:text-4xl">
                    {t(`specials.${setting.toLowerCase()}`)}
                </h2>
                <div className="mt-5 flex items-center gap-3">
                    <span className="block h-px w-10 bg-[var(--color-gold-soft)]" />
                    <span className="ornament">&#10022;</span>
                    <span className="block h-px w-10 bg-[var(--color-gold-soft)]" />
                </div>
                <Link
                    to={`/Catalog?filter=${setting.toLowerCase()}`}
                    className="ui-label group mt-5 inline-flex items-center gap-1.5 text-[0.7rem] text-[var(--color-gold-deep)] transition-colors duration-300 hover:text-[var(--color-primary)]"
                >
                    {t("specials.show_all")}
                    <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
                        &rarr;
                    </span>
                </Link>
            </div>

            {/* Product grid */}
            <div className="grid w-full grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
                {loading &&
                    Array.from({ length: 4 }).map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                {error && (
                    <p className="col-span-full py-8 text-center text-sm text-red-400">
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
