import { useEffect, useState, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";
import ProductFilter, {
    SortSelect,
} from "../../components/ProductFilter/ProductFilter";
import { ProductCardSkeleton } from "../../components/ProductCard/ProductCard";
import { CloseIcon, FiltersIcon } from "../../components/Icons/Icons";
import { useOverlay } from "../../hooks/useOverlay";
import ProductList from "../../components/ProductList/ProductList";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import api, { registerReloadOnLanguageChange } from "../../api/api";
import type { Product } from "../../types/types";

const ProductListPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedCollections, setSelectedCollections] = useState<string[]>(
        [],
    );
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [sort, setSort] = useState("default");
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const { t } = useTranslation();

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const response = await api.get("/data/products");
            setProducts(response.data.products);
        } catch {
            setError(t("errors.load_products"));
        } finally {
            setLoading(false);
        }
    }, [t]);

    useEffect(() => {
        fetchProducts();
        const unregister = registerReloadOnLanguageChange(fetchProducts);
        return () => unregister();
    }, [fetchProducts]);

    // Scroll to top on page load
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Sync URL params to filter state
    useEffect(() => {
        const filters = searchParams.getAll("filter");
        const collections = searchParams.getAll("collection");

        // Legacy: old "filter" param maps to category OR collection (lowercase match)
        const knownCategories = ["favorite", "season"];
        const cats: string[] = [];
        const cols: string[] = [...collections.map((c) => c.toLowerCase())];

        for (const f of filters) {
            const lower = f.toLowerCase();
            if (knownCategories.includes(lower)) {
                cats.push(lower);
            } else {
                cols.push(lower);
            }
        }

        setSelectedCategories(cats);
        setSelectedCollections(cols);
    }, [searchParams]);

    // Update URL when filters change
    const syncURL = useCallback(
        (cols: string[], cats: string[]) => {
            const params: Record<string, string[]> = {};
            if (cols.length > 0) params.collection = cols;
            if (cats.length > 0) params.filter = cats;

            const sp = new URLSearchParams();
            for (const [key, values] of Object.entries(params)) {
                for (const v of values) {
                    sp.append(key, v);
                }
            }
            setSearchParams(sp);
        },
        [setSearchParams],
    );

    const handleCollectionChange = useCallback(
        (cols: string[]) => {
            setSelectedCollections(cols);
            syncURL(cols, selectedCategories);
        },
        [selectedCategories, syncURL],
    );

    const handleCategoryChange = useCallback(
        (cats: string[]) => {
            setSelectedCategories(cats);
            syncURL(selectedCollections, cats);
        },
        [selectedCollections, syncURL],
    );

    const handleClearAll = useCallback(() => {
        setSelectedCollections([]);
        setSelectedCategories([]);
        setSearchParams({});
    }, [setSearchParams]);

    // Filter + sort products
    const filteredProducts = useMemo(() => {
        let result = [...products];

        // Filter by collection
        if (selectedCollections.length > 0) {
            result = result.filter((p) =>
                selectedCollections.includes(p.collection?.toLowerCase()),
            );
        }

        // Filter by category
        if (selectedCategories.length > 0) {
            result = result.filter((p) =>
                selectedCategories.includes(p.category?.toLowerCase()),
            );
        }

        // Sort
        switch (sort) {
            case "price_asc":
                result.sort((a, b) => a.price - b.price);
                break;
            case "price_desc":
                result.sort((a, b) => b.price - a.price);
                break;
            case "name_asc":
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
        }

        return result;
    }, [products, selectedCollections, selectedCategories, sort]);

    const activeFilterCount =
        selectedCollections.length + selectedCategories.length;

    const closeFilters = useCallback(() => setMobileFiltersOpen(false), []);
    const sheetRef = useOverlay<HTMLDivElement>(mobileFiltersOpen, closeFilters);

    const activeChips = [
        ...selectedCollections.map((value) => ({
            value,
            label: t(`catalog.collection.${value}`, { defaultValue: value }),
            remove: () =>
                handleCollectionChange(
                    selectedCollections.filter((c) => c !== value),
                ),
        })),
        ...selectedCategories.map((value) => ({
            value,
            label: t(`catalog.category.${value}`, { defaultValue: value }),
            remove: () =>
                handleCategoryChange(
                    selectedCategories.filter((c) => c !== value),
                ),
        })),
    ];

    const filterProps = {
        selectedCollections,
        selectedCategories,
        onCollectionChange: handleCollectionChange,
        onCategoryChange: handleCategoryChange,
        sort,
        onSortChange: setSort,
        resultCount: filteredProducts.length,
        onClearAll: handleClearAll,
    };

    return (
        <div className="w-full">
            <title>{t("seo.catalog_title")}</title>

            <Breadcrumb
                items={[
                    { label: t("breadcrumbs.home"), to: "/" },
                    { label: t("breadcrumbs.catalog") },
                ]}
            />

            {/* Title */}
            <header className="container-luxe mt-6 md:mt-10">
                <div className="flex flex-col gap-4 border-b border-line pb-8 md:flex-row md:items-end md:justify-between md:pb-12">
                    <h1 className="animate-rise font-display text-[3rem] leading-[0.95] font-medium tracking-[-0.03em] sm:text-7xl lg:text-8xl">
                        {t("catalog.title")}
                    </h1>
                    <p
                        className="max-w-sm animate-rise text-[15px] leading-relaxed text-ink-soft md:text-right"
                        style={{ animationDelay: "120ms" }}
                    >
                        {t("catalog.subtitle")}
                    </p>
                </div>
            </header>

            {/* Mobile toolbar */}
            <div className="sticky top-24 z-30 border-b md:top-28 border-line bg-blush/90 backdrop-blur-xl lg:hidden">
                <div className="container-luxe flex h-14 items-center justify-between gap-4">
                    <button
                        type="button"
                        onClick={() => setMobileFiltersOpen(true)}
                        aria-expanded={mobileFiltersOpen}
                        className="flex min-h-11 cursor-pointer items-center gap-2.5 text-[12px] font-medium tracking-[0.16em] uppercase"
                    >
                        <FiltersIcon className="h-5 w-5" />
                        {t("catalog.filters")}
                        {activeFilterCount > 0 && (
                            <span className="price flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] tracking-normal">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>
                    <label className="sr-only" htmlFor="catalog-sort-mobile">
                        {t("catalog.sort_label")}
                    </label>
                    <SortSelect
                        id="catalog-sort-mobile"
                        value={sort}
                        onChange={setSort}
                        className="w-44 [&_select]:border-0 [&_select]:text-right [&_select]:text-[13px]"
                    />
                </div>
            </div>

            {/* Active filters (mobile) */}
            {activeChips.length > 0 && (
                <div className="no-scrollbar container-luxe flex gap-2 overflow-x-auto pt-5 lg:hidden">
                    {activeChips.map((chip) => (
                        <button
                            key={chip.value + chip.label}
                            type="button"
                            onClick={chip.remove}
                            className="flex min-h-9 shrink-0 cursor-pointer items-center gap-2 rounded-full border border-line-strong bg-surface py-1 pr-2.5 pl-4 text-[13px]"
                        >
                            {chip.label}
                            <CloseIcon className="h-3.5 w-3.5" />
                        </button>
                    ))}
                </div>
            )}

            <div className="container-luxe mt-8 grid gap-10 md:mt-12 lg:grid-cols-12 lg:gap-12">
                {/* Desktop sidebar */}
                <aside className="hidden lg:col-span-3 lg:block">
                    <div className="sticky top-36">
                        <ProductFilter {...filterProps} />
                    </div>
                </aside>

                <div className="min-w-0 lg:col-span-9">
                    {loading && <CatalogSkeleton />}
                    {error && (
                        <p className="py-16 text-center text-danger" role="alert">
                            {error}
                        </p>
                    )}
                    {!loading && !error && (
                        <ProductList
                            products={filteredProducts}
                            onClearAll={handleClearAll}
                        />
                    )}
                </div>
            </div>

            {/* Mobile filter sheet */}
            <div
                className={`fixed inset-0 z-50 lg:hidden ${mobileFiltersOpen ? "" : "pointer-events-none"}`}
                inert={!mobileFiltersOpen}
            >
                <div
                    className={`absolute inset-0 bg-ink/30 transition-opacity duration-500 ${
                        mobileFiltersOpen ? "opacity-100" : "opacity-0"
                    }`}
                    onClick={closeFilters}
                    aria-hidden="true"
                />
                <div
                    ref={sheetRef}
                    role="dialog"
                    aria-modal="true"
                    aria-label={t("catalog.filters")}
                    className={`absolute inset-x-0 bottom-0 flex max-h-[88dvh] flex-col rounded-t-[1.75rem] bg-surface transition-[transform,visibility] duration-700 ease-drawer ${
                        mobileFiltersOpen
                            ? "visible translate-y-0"
                            : "invisible translate-y-full"
                    }`}
                >
                    <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-line-strong" />
                    <div className="flex items-center justify-between px-5 pt-3 pb-2">
                        <h2 className="font-display text-2xl">
                            {t("catalog.filters")}
                        </h2>
                        <button
                            type="button"
                            onClick={closeFilters}
                            className="-mr-2.5 flex h-11 w-11 cursor-pointer items-center justify-center"
                            aria-label={t("catalog.close_filters")}
                        >
                            <CloseIcon className="h-6 w-6" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto overscroll-contain px-5">
                        <ProductFilter {...filterProps} showSort={false} />
                    </div>
                    <div className="border-t border-line px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                        <button
                            type="button"
                            onClick={closeFilters}
                            className="price flex h-14 w-full cursor-pointer items-center justify-center rounded-full bg-ink text-[12px] font-medium tracking-[0.18em] text-blush uppercase active:scale-[0.98]"
                        >
                            {t("catalog.show_results", {
                                count: filteredProducts.length,
                            })}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

/** Skeleton grid shown while products are loading */
const CatalogSkeleton = () => (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-14 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
        ))}
    </div>
);

export default ProductListPage;
