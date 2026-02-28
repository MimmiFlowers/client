import { useState, useEffect } from "react";
import { Link } from "react-router";
import ProductCard from "../ProductCard/ProductCard";
import { useTranslation } from "react-i18next";
import api from "../../api/api";
import type { SpecialProps, ProductMini } from "../../types/types";

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
        <div className="m-2 flex w-[80%] flex-col items-center justify-center">
            <div className="mt-4 flex w-full items-center justify-between">
                <h2 className="text-left text-4xl uppercase">
                    {t(`specials.${setting.toLowerCase()}`)}
                </h2>
                <Link
                    to={`/Catalog?filter=${setting.toLowerCase()}`}
                    className="transform cursor-pointer p-1 underline transition duration-500 hover:scale-110"
                >
                    {t("specials.show_all")}
                </Link>
            </div>
            <div className="my-4 flex w-full flex-row flex-wrap items-center justify-between gap-2">
                {loading && (
                    <p className="w-full py-8 text-center text-gray-400">
                        {t("loading")}
                    </p>
                )}
                {error && (
                    <p className="w-full py-8 text-center text-red-500">
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
        </div>
    );
};

export default Specials;
