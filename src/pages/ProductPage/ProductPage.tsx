import { useParams, useNavigate } from "react-router";
import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useCart } from "../../contexts/CartContext";
import BasketShopping3 from "../../icons/basketIcon";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import api, { registerReloadOnLanguageChange } from "../../api/api";
import type { Product } from "../../types/types";

const ProductPage = () => {
    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [subgroup, setSubgroup] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [addedFeedback, setAddedFeedback] = useState(false);
    const { id } = useParams<string>();
    const { t } = useTranslation();
    const { addItem } = useCart();
    const navigate = useNavigate();

    const fetchProduct = useCallback(
        async (productId: string) => {
            setLoading(true);
            setError("");

            try {
                const response = await api.get(`/data/products/${productId}`);
                setProduct(response.data);
            } catch {
                setError(t("errors.load_product"));
            } finally {
                setLoading(false);
            }
        },
        [t],
    );

    const fetchRelated = useCallback(async () => {
        try {
            const response = await api.get("/data/products");
            setRelatedProducts(response.data.products || []);
        } catch {
            // Silently fail — related products are non-critical
        }
    }, []);

    const subgroupSetter = (p: Product) => {
        if (p.category) {
            setSubgroup(p.category.toLowerCase());
        } else if (p.collection) {
            setSubgroup(p.collection.toLowerCase());
        } else {
            setSubgroup("subgroup");
        }
    };

    useEffect(() => {
        if (id) {
            fetchProduct(id);
            fetchRelated();
            const unregister = registerReloadOnLanguageChange(() =>
                fetchProduct(id),
            );
            window.scrollTo(0, 0);
            setQuantity(1);
            setAddedFeedback(false);
            return () => unregister();
        }
    }, [id, fetchProduct, fetchRelated]);

    useEffect(() => {
        if (product) {
            subgroupSetter(product);
        }
    }, [product]);

    const handleAddToCart = () => {
        if (!product) return;
        addItem({
            id: product.productID,
            name: product.name,
            picture: product.picture,
            price: product.price,
            quantity,
        });
        setAddedFeedback(true);
        setTimeout(() => setAddedFeedback(false), 2000);
    };

    const related = relatedProducts
        .filter((p) => {
            if (!product) return false;
            if (String(p.productID) === String(product.productID)) return false;
            return (
                p.collection === product.collection ||
                p.category === product.category
            );
        })
        .slice(0, 4);

    // Loading skeleton
    if (loading) {
        return (
            <div className="mx-auto w-[95%] animate-pulse sm:w-[90%] md:w-[75%]">
                {/* Breadcrumb skeleton */}
                <div className="mt-6 flex gap-2 md:mt-8">
                    <div className="h-4 w-12 rounded bg-gray-200" />
                    <div className="h-4 w-16 rounded bg-gray-200" />
                    <div className="h-4 w-24 rounded bg-gray-200" />
                </div>
                <div className="mt-6 flex flex-col gap-8 md:mt-8 md:flex-row">
                    {/* Image skeleton */}
                    <div className="aspect-[3/4] w-full rounded-2xl bg-gray-200 md:w-[55%]" />
                    {/* Info skeleton */}
                    <div className="flex w-full flex-col gap-4 md:w-[45%]">
                        <div className="h-5 w-24 rounded bg-gray-200" />
                        <div className="h-10 w-3/4 rounded bg-gray-200" />
                        <div className="h-8 w-28 rounded bg-gray-200" />
                        <div className="h-px w-full bg-gray-200" />
                        <div className="h-4 w-full rounded bg-gray-200" />
                        <div className="h-4 w-5/6 rounded bg-gray-200" />
                        <div className="h-4 w-2/3 rounded bg-gray-200" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="flex min-h-[60vh] w-full items-center justify-center">
                <p className="text-red-500">
                    {error || t("errors.load_product")}
                </p>
            </div>
        );
    }

    return (
        <div className="relative flex w-full flex-col items-center pb-12 md:pb-16">
            <title>
                {product.name
                    ? `${product.name} — Mimmi Flowers`
                    : "Mimmi Flowers"}
            </title>

            {/* Breadcrumb */}
            {product.name && (
                <Breadcrumb
                    items={[
                        { label: t("breadcrumbs.home"), to: "/" },
                        { label: t("breadcrumbs.catalog"), to: "/Catalog" },
                        {
                            label: t(`breadcrumbs.subgroup.${subgroup}`),
                            to: `/Catalog?filter=${subgroup}`,
                        },
                        { label: product.name },
                    ]}
                />
            )}

            {/* Main product section */}
            <div className="mx-auto mt-6 flex w-[95%] flex-col gap-8 sm:w-[90%] md:mt-8 md:w-[75%] md:flex-row md:gap-12 lg:gap-16">
                {/* Product image */}
                <div className="group w-full overflow-hidden rounded-2xl md:w-[55%]">
                    <img
                        className="aspect-[3/4] w-full rounded-2xl object-cover object-center shadow-xl transition-transform duration-700 ease-out group-hover:scale-105"
                        src={product.picture}
                        alt={product.name}
                    />
                </div>

                {/* Product info */}
                <div className="flex w-full flex-col md:w-[45%] md:py-4">
                    {/* Collection & category badges */}
                    <div className="mb-3 flex flex-wrap gap-2">
                        {product.collection && (
                            <span className="rounded-full border border-gray-300 px-3 py-1 text-xs uppercase tracking-wider text-gray-600">
                                {product.collection}
                            </span>
                        )}
                        {product.category && (
                            <span className="rounded-full bg-[#edc7f5]/40 px-3 py-1 text-xs uppercase tracking-wider text-gray-700">
                                {product.category}
                            </span>
                        )}
                    </div>

                    {/* Product name */}
                    <h1 className="text-3xl leading-tight font-semibold tracking-tight text-gray-900 sm:text-4xl md:text-[2.75rem]">
                        {product.name}
                    </h1>

                    {/* SKU */}
                    <p className="mt-1.5 text-xs tracking-wide text-gray-400 uppercase">
                        {t("product_page.sku_label")}: {product.sku}
                    </p>

                    {/* Price */}
                    <p className="mt-4 text-3xl font-light tracking-tight text-gray-900 sm:text-4xl">
                        {product.price.toLocaleString()}{" "}
                        <span className="text-2xl">kr</span>
                    </p>

                    {/* Divider */}
                    <div className="my-5 h-px w-full bg-gray-200" />

                    {/* Description */}
                    <div>
                        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
                            {t("product_page.description")}
                        </h2>
                        <p className="leading-relaxed text-gray-700 sm:text-lg">
                            {product.description}
                        </p>
                    </div>

                    {/* Flower contents */}
                    {product.contents && product.contents.length > 0 && (
                        <div className="mt-5">
                            <h2 className="mb-2.5 text-sm font-semibold uppercase tracking-wider text-gray-500">
                                {t("product_page.contents")}
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {product.contents.map((item) => (
                                    <span
                                        key={item}
                                        className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-sm capitalize text-gray-700 shadow-sm ring-1 ring-gray-200"
                                    >
                                        <span className="h-1.5 w-1.5 rounded-full bg-[#edc7f5]" />
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Divider */}
                    <div className="my-5 h-px w-full bg-gray-200" />

                    {/* Quantity selector + Add to cart */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        {/* Quantity */}
                        <div className="flex h-12 w-fit items-center rounded-xl border border-gray-300 bg-white">
                            <button
                                onClick={() =>
                                    setQuantity((q) => Math.max(1, q - 1))
                                }
                                disabled={quantity <= 1}
                                className="flex h-full w-11 cursor-pointer items-center justify-center text-lg text-gray-600 transition-colors hover:text-black disabled:cursor-not-allowed disabled:opacity-30"
                                aria-label="Decrease quantity"
                            >
                                &minus;
                            </button>
                            <span className="flex h-full w-10 items-center justify-center border-x border-gray-300 text-center font-medium">
                                {quantity}
                            </span>
                            <button
                                onClick={() =>
                                    setQuantity((q) => Math.min(99, q + 1))
                                }
                                disabled={quantity >= 99}
                                className="flex h-full w-11 cursor-pointer items-center justify-center text-lg text-gray-600 transition-colors hover:text-black disabled:cursor-not-allowed disabled:opacity-30"
                                aria-label="Increase quantity"
                            >
                                +
                            </button>
                        </div>

                        {/* Add to cart button */}
                        <button
                            onClick={handleAddToCart}
                            className={`flex h-12 flex-1 cursor-pointer items-center justify-center gap-2.5 rounded-xl text-base font-semibold uppercase tracking-wide shadow-lg transition-all duration-300 sm:text-lg ${
                                addedFeedback
                                    ? "bg-emerald-500 text-white shadow-emerald-200"
                                    : "bg-[#edc7f5] text-gray-900 hover:scale-[1.02] hover:bg-[#e4b4f0] hover:shadow-xl"
                            }`}
                        >
                            {addedFeedback ? (
                                <>
                                    <svg
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2.5}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                    {t("product_page.added_to_cart")}
                                </>
                            ) : (
                                <>
                                    <BasketShopping3 className="h-5 w-5" />
                                    {t("buttons.add_to_cart")}
                                </>
                            )}
                        </button>
                    </div>

                    {/* Delivery info */}
                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                        <svg
                            className="h-4 w-4 flex-shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0H21M3.375 14.25V3.375c0-.621.504-1.125 1.125-1.125h9.75c.621 0 1.125.504 1.125 1.125v7.875m-12 3h12m3.75 0v-3.375c0-.621-.504-1.125-1.125-1.125H18M3.75 14.25h14.25"
                            />
                        </svg>
                        <span>{t("product_page.free_delivery")}</span>
                    </div>
                </div>
            </div>

            {/* Related products — "You May Also Like" */}
            {related.length > 0 && (
                <section className="mx-auto mt-16 w-[95%] sm:w-[90%] md:mt-20 md:w-[75%]">
                    <div className="mb-8 flex items-center gap-4">
                        <div className="h-px flex-1 bg-gray-200" />
                        <h2 className="text-center text-xl font-semibold uppercase tracking-wider text-gray-800 sm:text-2xl">
                            {t("product_page.you_may_also_like")}
                        </h2>
                        <div className="h-px flex-1 bg-gray-200" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
                        {related.map((rp) => (
                            <div
                                key={rp.productID}
                                className="group cursor-pointer"
                                onClick={() =>
                                    navigate(`/Catalog/${rp.productID}`)
                                }
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        navigate(`/Catalog/${rp.productID}`);
                                    }
                                }}
                                role="button"
                                tabIndex={0}
                                aria-label={`${rp.name}, ${rp.price} kr`}
                            >
                                <div className="overflow-hidden rounded-xl">
                                    <img
                                        src={rp.picture}
                                        alt={rp.name}
                                        className="aspect-[3/4] w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                                <p className="mt-2.5 text-center text-sm font-semibold uppercase sm:text-base">
                                    {rp.name}
                                </p>
                                <p className="text-center text-sm text-gray-600 sm:text-base">
                                    {rp.price.toLocaleString()} kr
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default ProductPage;
