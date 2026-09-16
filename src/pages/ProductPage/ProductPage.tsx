import { Link, useParams } from "react-router";
import { useEffect, useState, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useCart } from "../../contexts/CartContext";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import api, { registerReloadOnLanguageChange } from "../../api/api";
import type { Product } from "../../types/types";
import ProductCard, {
    ProductCardSkeleton,
} from "../../components/ProductCard/ProductCard";
import Reveal from "../../components/Reveal/Reveal";
import {
    BagIcon,
    CheckIcon,
    ClockIcon,
    MinusIcon,
    PlusIcon,
    TruckIcon,
} from "../../components/Icons/Icons";

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
    const buyRef = useRef<HTMLDivElement>(null);
    const [buyVisible, setBuyVisible] = useState(true);

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

    // Show the mobile sticky bar only once the main buy block leaves view.
    useEffect(() => {
        const node = buyRef.current;
        if (!node || typeof IntersectionObserver === "undefined") return;
        const observer = new IntersectionObserver(([entry]) =>
            setBuyVisible(entry?.isIntersecting ?? true),
        );
        observer.observe(node);
        return () => observer.disconnect();
    }, [product]);

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

    if (loading) {
        return (
            <div className="container-luxe pt-6 md:pt-10" aria-busy="true">
                <div className="h-3 w-48 animate-shimmer rounded-full bg-blush-deep" />
                <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-16">
                    <div className="lg:col-span-7">
                        <ProductCardSkeleton />
                    </div>
                    <div className="space-y-5 lg:col-span-5 lg:pt-10">
                        <div className="h-3 w-24 animate-shimmer rounded-full bg-blush-deep" />
                        <div className="h-14 w-3/4 animate-shimmer rounded-full bg-blush-deep" />
                        <div className="h-6 w-28 animate-shimmer rounded-full bg-blush-deep" />
                        <div className="h-24 w-full animate-shimmer rounded-2xl bg-blush-deep" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="container-luxe flex min-h-[60dvh] flex-col items-center justify-center text-center">
                <p className="font-display text-3xl">
                    {error || t("errors.load_product")}
                </p>
                <Link
                    to="/Catalog"
                    className="mt-8 min-h-11 border-b border-ink pb-1 text-[12px] font-medium tracking-[0.16em] uppercase"
                >
                    {t("checkout.browse_catalog")}
                </Link>
            </div>
        );
    }

    const addButton = (size: "lg" | "sm") => (
        <button
            type="button"
            onClick={handleAddToCart}
            className={`group flex min-w-0 flex-1 cursor-pointer items-center justify-center gap-3 rounded-full font-medium tracking-[0.16em] uppercase transition-[background-color,transform] duration-500 ease-luxe active:scale-[0.98] ${
                size === "lg" ? "h-14 text-[12px]" : "h-12 text-[11px]"
            } ${
                addedFeedback
                    ? "bg-success text-blush"
                    : "bg-ink text-blush hover:bg-ink-soft"
            }`}
        >
            {addedFeedback ? (
                <>
                    <CheckIcon className="h-4 w-4" strokeWidth={1.75} />
                    {t("product_page.added_to_cart")}
                </>
            ) : (
                <>
                    <BagIcon className="h-4 w-4 transition-transform duration-500 ease-luxe group-hover:-translate-y-0.5" />
                    {t("buttons.add_to_cart")}
                </>
            )}
        </button>
    );

    return (
        <div className="w-full">
            <title>
                {product.name
                    ? `${product.name} — Mimmi Flowers`
                    : "Mimmi Flowers"}
            </title>

            {product.name && (
                <Breadcrumb
                    items={[
                        { label: t("breadcrumbs.home"), to: "/" },
                        { label: t("breadcrumbs.catalog"), to: "/Catalog" },
                        {
                            label: t(`breadcrumbs.subgroup.${subgroup}`, {
                                defaultValue: subgroup,
                            }),
                            to: `/Catalog?filter=${subgroup}`,
                        },
                        { label: product.name },
                    ]}
                />
            )}

            <div className="container-luxe mt-6 grid gap-10 md:mt-10 lg:grid-cols-12 lg:gap-16">
                {/* Image */}
                <div className="lg:col-span-7">
                    <div className="relative aspect-[4/5] animate-fade overflow-hidden rounded-[2px] bg-blush-deep">
                        <img
                            className="h-full w-full object-cover"
                            src={product.picture}
                            alt={product.name}
                            fetchPriority="high"
                        />
                    </div>
                </div>

                {/* Details */}
                <div className="lg:col-span-5">
                    <div className="lg:sticky lg:top-36">
                        <p
                            className="eyebrow flex animate-rise flex-wrap items-center gap-3"
                            style={{ animationDelay: "60ms" }}
                        >
                            {product.collection && <span>{product.collection}</span>}
                            {product.collection && product.category && (
                                <span className="h-px w-6 bg-line-strong" />
                            )}
                            {product.category && (
                                <span className="text-ink">{product.category}</span>
                            )}
                        </p>

                        <h1
                            className="mt-4 animate-rise font-display text-[2.9rem] leading-[0.98] font-medium tracking-[-0.025em] sm:text-6xl"
                            style={{ animationDelay: "120ms" }}
                        >
                            {product.name}
                        </h1>

                        <div
                            className="mt-5 flex animate-rise items-baseline justify-between gap-4 border-b border-line pb-6"
                            style={{ animationDelay: "180ms" }}
                        >
                            <p className="price font-display text-3xl">
                                {product.price.toLocaleString("sv-SE")}{" "}
                                <span className="text-xl">kr</span>
                            </p>
                            <p className="price text-[11px] tracking-[0.14em] text-muted uppercase">
                                {t("product_page.sku_label")} {product.sku}
                            </p>
                        </div>

                        <div
                            className="animate-rise py-6"
                            style={{ animationDelay: "240ms" }}
                        >
                            <h2 className="eyebrow">
                                {t("product_page.description")}
                            </h2>
                            <p className="mt-3 text-[16px] leading-[1.75] text-ink-soft">
                                {product.description}
                            </p>

                            {product.contents && product.contents.length > 0 && (
                                <>
                                    <h2 className="eyebrow mt-7">
                                        {t("product_page.contents")}
                                    </h2>
                                    <ul className="mt-3 flex flex-wrap gap-2">
                                        {product.contents.map((item) => (
                                            <li
                                                key={item}
                                                className="rounded-full border border-line-strong px-3.5 py-1.5 text-[13px] text-ink-soft capitalize"
                                            >
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </div>

                        {/* Buy */}
                        <div
                            ref={buyRef}
                            className="animate-rise border-t border-line pt-6"
                            style={{ animationDelay: "300ms" }}
                        >
                            <div className="flex items-stretch gap-3">
                                <div
                                    className="flex h-14 items-center rounded-full border border-line-strong"
                                    role="group"
                                    aria-label={t("product_page.quantity")}
                                >
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setQuantity((q) => Math.max(1, q - 1))
                                        }
                                        disabled={quantity <= 1}
                                        className="flex h-full w-12 cursor-pointer items-center justify-center text-ink transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
                                        aria-label={t("cart.decrease", {
                                            name: product.name,
                                        })}
                                    >
                                        <MinusIcon className="h-4 w-4" />
                                    </button>
                                    <span
                                        className="price w-6 text-center text-[15px]"
                                        aria-live="polite"
                                    >
                                        {quantity}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setQuantity((q) => Math.min(99, q + 1))
                                        }
                                        disabled={quantity >= 99}
                                        className="flex h-full w-12 cursor-pointer items-center justify-center text-ink transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
                                        aria-label={t("cart.increase", {
                                            name: product.name,
                                        })}
                                    >
                                        <PlusIcon className="h-4 w-4" />
                                    </button>
                                </div>
                                {addButton("lg")}
                            </div>

                            <ul className="mt-6 space-y-3 text-sm text-ink-soft">
                                <li className="flex items-center gap-3">
                                    <TruckIcon className="h-5 w-5 shrink-0 text-ink" />
                                    {t("product_page.free_delivery")}
                                </li>
                                <li className="flex items-center gap-3">
                                    <ClockIcon className="h-5 w-5 shrink-0 text-ink" />
                                    {t("checkout.delivery_time_range")}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related */}
            {related.length > 0 && (
                <section className="mt-24 md:mt-36">
                    <Reveal className="container-luxe">
                        <h2 className="font-display text-[2.4rem] leading-none font-medium tracking-[-0.02em] sm:text-5xl">
                            {t("product_page.you_may_also_like")}
                        </h2>
                    </Reveal>
                    <Reveal delay={100}>
                        <div className="no-scrollbar mt-10 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 sm:mx-auto sm:grid sm:max-w-[90rem] sm:snap-none sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 sm:overflow-visible sm:px-8 lg:grid-cols-4 lg:px-14">
                            {related.map((rp) => (
                                <div
                                    key={rp.productID}
                                    className="w-[72vw] shrink-0 snap-start sm:w-auto"
                                >
                                    <ProductCard productMini={rp} />
                                </div>
                            ))}
                        </div>
                    </Reveal>
                </section>
            )}

            {/* Mobile sticky buy bar */}
            <div
                className={`fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 backdrop-blur-xl transition-transform duration-500 ease-luxe lg:hidden ${
                    buyVisible ? "translate-y-full" : "translate-y-0"
                }`}
                inert={buyVisible}
            >
                <div className="container-luxe flex items-center gap-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                    <div className="min-w-0">
                        <p className="truncate font-display text-lg leading-tight">
                            {product.name}
                        </p>
                        <p className="price text-sm text-ink-soft">
                            {(product.price * quantity).toLocaleString("sv-SE")} kr
                        </p>
                    </div>
                    {addButton("sm")}
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
