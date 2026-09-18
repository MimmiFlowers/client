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
                    <div className="h-4 w-12 rounded bg-[var(--color-cream)]" />
                    <div className="h-4 w-16 rounded bg-[var(--color-cream)]" />
                    <div className="h-4 w-24 rounded bg-[var(--color-cream)]" />
                </div>
                <div className="mt-6 flex flex-col gap-8 md:mt-8 md:flex-row">
                    {/* Image skeleton */}
                    <div className="aspect-[3/4] w-full rounded-2xl bg-[var(--color-cream)] md:w-[55%]" />
                    {/* Info skeleton */}
                    <div className="flex w-full flex-col gap-4 md:w-[45%]">
                        <div className="h-5 w-24 rounded bg-[var(--color-cream)]" />
                        <div className="h-10 w-3/4 rounded bg-[var(--color-cream)]" />
                        <div className="h-8 w-28 rounded bg-[var(--color-cream)]" />
                        <div className="h-px w-full bg-[var(--color-cream)]" />
                        <div className="h-4 w-full rounded bg-[var(--color-cream)]" />
                        <div className="h-4 w-5/6 rounded bg-[var(--color-cream)]" />
                        <div className="h-4 w-2/3 rounded bg-[var(--color-cream)]" />
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
                    <div className="mb-4 flex flex-wrap gap-2">
                        {product.collection && (
                            <span className="ui-label rounded-full border border-[var(--color-line)] px-3 py-1 text-[0.6rem] text-[var(--color-fg-mid)]">
                                {product.collection}
                            </span>
                        )}
                        {product.category && (
                            <span className="ui-label rounded-full bg-[var(--color-primary-tint)] px-3 py-1 text-[0.6rem] text-[var(--color-primary)]">
                                {product.category}
                            </span>
                        )}
                    </div>

                    {/* Product name */}
                    <h1 className="font-[var(--font-display)] text-4xl leading-[1.08] font-medium tracking-[0.01em] text-[var(--color-ink)] sm:text-5xl md:text-[3rem]">
                        {product.name}
                    </h1>

                    {/* SKU */}
                    <p className="mt-2 text-xs tracking-[0.18em] text-[var(--color-muted)] uppercase">
                        {t("product_page.sku_label")}: {product.sku}
                    </p>

                    {/* Price */}
                    <p className="mt-5 font-[var(--font-display)] text-3xl font-medium tracking-tight text-[var(--color-ink)] sm:text-4xl">
                        {product.price.toLocaleString()}{" "}
                        <span className="text-xl text-[var(--color-muted)]">kr</span>
                    </p>

                    {/* Divider */}
                    <div className="gold-rule my-6 max-w-[180px]" />

                    {/* Description */}
                    <div>
                        <h2 className="eyebrow mb-2.5">
                            {t("product_page.description")}
                        </h2>
                        <p className="leading-relaxed text-[var(--color-fg-mid)] sm:text-lg">
                            {product.description}
                        </p>
                    </div>

                    {/* Flower contents */}
                    {product.contents && product.contents.length > 0 && (
                        <div className="mt-6">
                            <h2 className="eyebrow mb-3">
                                {t("product_page.contents")}
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {product.contents.map((item) => (
                                    <span
                                        key={item}
                                        className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-surface)] px-3.5 py-1.5 text-sm capitalize text-[var(--color-fg-mid)] ring-1 ring-[var(--color-line)]"
                                    >
                                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-gold)]" />
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Divider */}
                    <div className="my-6 h-px w-full bg-[var(--color-line)]" />

                    {/* Quantity selector + Add to cart */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        {/* Quantity */}
                        <div className="flex h-14 w-fit items-center rounded-full border border-[var(--color-line)] bg-[var(--color-surface)] sm:h-12">
                            <button
                                onClick={() =>
                                    setQuantity((q) => Math.max(1, q - 1))
                                }
                                disabled={quantity <= 1}
                                className="flex h-full w-12 cursor-pointer items-center justify-center text-lg text-[var(--color-fg-mid)] transition-colors hover:text-[var(--color-ink)] disabled:cursor-not-allowed disabled:opacity-30"
                                aria-label="Decrease quantity"
                            >
                                &minus;
                            </button>
                            <span className="flex h-full w-10 items-center justify-center border-x border-[var(--color-line)] text-center font-medium text-[var(--color-ink)]">
                                {quantity}
                            </span>
                            <button
                                onClick={() =>
                                    setQuantity((q) => Math.min(99, q + 1))
                                }
                                disabled={quantity >= 99}
                                className="flex h-full w-12 cursor-pointer items-center justify-center text-lg text-[var(--color-fg-mid)] transition-colors hover:text-[var(--color-ink)] disabled:cursor-not-allowed disabled:opacity-30"
                                aria-label="Increase quantity"
                            >
                                +
                            </button>
                        </div>

                        {/* Add to cart button */}
                        <button
                            onClick={handleAddToCart}
                            className={`ui-label flex h-14 flex-1 cursor-pointer items-center justify-center gap-2.5 rounded-full text-sm shadow-lg transition-all duration-300 sm:h-12 ${
                                addedFeedback
                                    ? "bg-[var(--color-primary-soft)] text-white"
                                    : "bg-[var(--color-primary)] text-[var(--color-bg)] hover:-translate-y-0.5 hover:bg-[var(--color-primary-deep)] hover:shadow-xl"
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
                    <div className="mt-4 flex items-center gap-2 text-sm text-[var(--color-muted)]">
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
                        <div className="h-px flex-1 bg-[var(--color-line)]" />
                        <h2 className="text-center font-[var(--font-display)] text-2xl tracking-[0.01em] text-[var(--color-ink)] sm:text-3xl">
                            {t("product_page.you_may_also_like")}
                        </h2>
                        <div className="h-px flex-1 bg-[var(--color-line)]" />
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
                                <p className="mt-3 text-center font-[var(--font-display)] text-[0.95rem] tracking-[0.01em] text-[var(--color-ink)] sm:text-base">
                                    {rp.name}
                                </p>
                                <p className="text-center text-sm text-[var(--color-fg-mid)] sm:text-base">
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
