import { useEffect, useState, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";
import ProductFilter from "../../components/ProductFilter/ProductFilter";
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

    // Lock body scroll when mobile filters open
    useEffect(() => {
        if (mobileFiltersOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [mobileFiltersOpen]);

    const activeFilterCount =
        selectedCollections.length + selectedCategories.length;

    return (
        <div className="flex w-full flex-col pb-12 md:pb-16">
            <title>{t("seo.catalog_title")}</title>

            {/* Breadcrumb */}
            <Breadcrumb
                items={[
                    { label: t("breadcrumbs.home"), to: "/" },
                    { label: t("breadcrumbs.catalog") },
                ]}
            />

            {/* Page title */}
            <div className="mx-auto mt-4 w-[95%] sm:w-[90%] md:mt-6 md:w-[75%]">
                <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-gray-200" />
                    <h1 className="text-center text-2xl font-semibold uppercase tracking-wider text-gray-800 sm:text-3xl md:text-4xl">
                        {t("catalog.title")}
                    </h1>
                    <div className="h-px flex-1 bg-gray-200" />
                </div>
            </div>

            {/* Mobile filter toggle button */}
            <div className="mx-auto mt-4 flex w-[95%] sm:w-[90%] md:hidden">
                <button
                    onClick={() => setMobileFiltersOpen(true)}
                    className="flex cursor-pointer items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
                >
                    <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
                        />
                    </svg>
                    {t("catalog.filters")}
                    {activeFilterCount > 0 && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-accent)] text-xs font-bold text-gray-800">
                            {activeFilterCount}
                        </span>
                    )}
                </button>
            </div>

            {/* Main content: sidebar + grid */}
            <div className="mx-auto mt-6 flex w-[95%] gap-8 sm:w-[90%] md:w-[75%] lg:gap-12">
                {/* Desktop sidebar */}
                <aside className="hidden w-60 flex-shrink-0 md:block">
                    <div className="sticky top-20">
                        <ProductFilter
                            selectedCollections={selectedCollections}
                            selectedCategories={selectedCategories}
                            onCollectionChange={handleCollectionChange}
                            onCategoryChange={handleCategoryChange}
                            sort={sort}
                            onSortChange={setSort}
                            resultCount={filteredProducts.length}
                            onClearAll={handleClearAll}
                        />
                    </div>
                </aside>

                {/* Product grid */}
                <div className="min-w-0 flex-1">
                    {loading && <CatalogSkeleton />}
                    {error && (
                        <p className="w-full py-16 text-center text-red-500">
                            {error}
                        </p>
                    )}
                    {!loading && !error && (
                        <ProductList products={filteredProducts} />
                    )}
                </div>
            </div>

            {/* Mobile filter drawer — backdrop */}
            {mobileFiltersOpen && (
                <div
                    className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-xs transition-opacity md:hidden"
                    onClick={() => setMobileFiltersOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Mobile filter drawer — panel */}
            <div
                className={`fixed top-0 left-0 z-[70] flex h-full w-[80vw] max-w-xs flex-col bg-[var(--color-bg)] shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
                    mobileFiltersOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                }`}
            >
                {/* Drawer header */}
                <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
                    <h2 className="text-lg font-semibold uppercase tracking-wider text-gray-800">
                        {t("catalog.filters")}
                    </h2>
                    <button
                        onClick={() => setMobileFiltersOpen(false)}
                        className="cursor-pointer rounded-lg p-1 text-gray-500 transition-colors hover:text-black"
                        aria-label="Close filters"
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* Drawer content */}
                <div className="flex-1 overflow-y-auto px-5 py-4">
                    <ProductFilter
                        selectedCollections={selectedCollections}
                        selectedCategories={selectedCategories}
                        onCollectionChange={handleCollectionChange}
                        onCategoryChange={handleCategoryChange}
                        sort={sort}
                        onSortChange={setSort}
                        resultCount={filteredProducts.length}
                        onClearAll={handleClearAll}
                    />
                </div>
            </div>
        </div>
    );
};

/** Skeleton grid shown while products are loading */
const CatalogSkeleton = () => (
    <div className="grid w-full animate-pulse grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
            <div key={i}>
                <div className="aspect-[3/4] w-full rounded-xl bg-gray-200" />
                <div className="mt-3 h-4 w-3/4 rounded bg-gray-200" />
                <div className="mt-1.5 h-4 w-1/3 rounded bg-gray-200" />
            </div>
        ))}
    </div>
);

export default ProductListPage;
