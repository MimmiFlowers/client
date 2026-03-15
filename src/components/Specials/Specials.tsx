import { useState, useEffect } from "react";
import { Link } from "react-router";
import ProductCard from "../ProductCard/ProductCard";
import { useTranslation } from "react-i18next";
import api from "../../api/api";
import type { SpecialProps, ProductMini } from "../../types/types";

const SkeletonCard = () => (
    <div className="animate-pulse">
        <div className="aspect-[3/4] w-full rounded-xl bg-gray-200" />
        <div className="mt-3 px-0.5">
            <div className="h-4 w-3/4 rounded bg-gray-200" />
            <div className="mt-2 h-3.5 w-1/3 rounded bg-gray-200" />
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
            {/* Section title with hairline dividers */}
            <div className="mt-10 mb-8 flex items-center gap-4">
                <div className="h-px flex-1 bg-gray-200" />
                <div className="flex items-center gap-3">
                    <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500 sm:text-sm">
                        {t(`specials.${setting.toLowerCase()}`)}
                    </h2>
                    <span className="text-gray-300">&middot;</span>
                    <Link
                        to={`/Catalog?filter=${setting.toLowerCase()}`}
                        className="text-xs font-light text-gray-400 uppercase tracking-wider transition-colors duration-300 hover:text-gray-700"
                    >
                        {t("specials.show_all")}
                    </Link>
                </div>
                <div className="h-px flex-1 bg-gray-200" />
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
