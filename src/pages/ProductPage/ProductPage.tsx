import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useCart } from "../../contexts/CartContext";
import BasketShopping3 from "../../icons/basketIcon";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import api, { registerReloadOnLanguageChange } from "../../instances/api";
import type { Product } from "../../types/types";

const ProductPage = () => {
    const [product, setProduct] = useState<Product>({} as Product);
    const [subgroup, setSubgroup] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { id } = useParams<string>();
    const { t } = useTranslation();
    const { addItem } = useCart();

    const fetchProduct = async (productId: string) => {
        setLoading(true);
        setError("");

        try {
            const response = await api.get(`/data/products/${productId}`);
            setProduct(response.data);
        } catch {
            setError("Failed to load product. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const subgroupSetter = () => {
        if (product.category) {
            setSubgroup(product.category.toLowerCase());
        } else if (product.collection) {
            setSubgroup(product.collection.toLowerCase());
        } else {
            setSubgroup("subgroup");
        }
    };

    useEffect(() => {
        if (id) {
            fetchProduct(id);
            const unregister = registerReloadOnLanguageChange(() =>
                fetchProduct(id),
            );
            window.scrollTo(0, 0);
            return () => unregister();
        }
    }, [id]);

    useEffect(() => {
        product && subgroupSetter();
    }, [product]);

    if (loading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center">
                <p className="text-gray-400">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen w-screen items-center justify-center">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="relative flex h-screen w-screen flex-col items-center">
            {product.name && (
                <Breadcrumb
                    items={[
                        { label: `${t("breadcrumbs.home")}`, to: "/" },
                        {
                            label: `${t("breadcrumbs.catalog")}`,
                            to: "/Catalog",
                        },
                        {
                            label: `${t(`breadcrumbs.subgroup.${subgroup}`)}`,
                            to: `/Catalog?filter=${subgroup}`,
                        },
                        { label: product.name },
                    ]}
                />
            )}
            <div className="m-4 flex w-[75%] flex-row">
                <img
                    className="mr-8 aspect-[3/4] w-[45%] rounded object-cover object-center shadow-lg"
                    src={product.picture}
                    alt={product.name}
                />

                <div className="ml-8 flex w-[55%] flex-col">
                    <p className="text-4xl uppercase">{product.name}</p>
                    <p className="text-l mb-2 text-zinc-500">
                        sku: {product.sku}
                    </p>
                    <p className="my-2 text-3xl">{product.price} kr</p>
                    <div className="my-2 flex w-full flex-row items-center">
                        <button
                            className="flex w-[50%] cursor-pointer flex-row items-center justify-center rounded bg-[#edc7f5] px-4 py-2 text-xl shadow-lg transition-transform duration-300 hover:scale-105"
                            onClick={() =>
                                addItem({
                                    id: product.productID,
                                    name: product.name,
                                    picture: product.picture,
                                    price: product.price,
                                    quantity: 1,
                                })
                            }
                        >
                            <BasketShopping3 className="mr-2" />
                            {t("buttons.add_to_cart")}
                        </button>
                    </div>
                    <p className="mt-4 text-xl uppercase">
                        {t("product_page.description")}
                    </p>
                    <p className="mt-2 text-lg">{product.description}</p>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
