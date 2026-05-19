import { useTranslation } from "react-i18next";
import { useState } from "react";

type Props = {
    selectedCollections: string[];
    selectedCategories: string[];
    onCollectionChange: (collections: string[]) => void;
    onCategoryChange: (categories: string[]) => void;
    sort: string;
    onSortChange: (sort: string) => void;
    resultCount: number;
    onClearAll: () => void;
};

const collectionOptions = [
    "mono bouquets",
    "duo bouquets",
    "author",
    "boxes and baskets",
    "gifts",
    "season",
];

const categoryOptions = ["favorite", "season"];

const ProductFilter = ({
    selectedCollections,
    selectedCategories,
    onCollectionChange,
    onCategoryChange,
    sort,
    onSortChange,
    resultCount,
    onClearAll,
}: Props) => {
    const { t } = useTranslation();
    const [collectionOpen, setCollectionOpen] = useState(true);
    const [categoryOpen, setCategoryOpen] = useState(true);

    const hasFilters =
        selectedCollections.length > 0 || selectedCategories.length > 0;

    const toggleCollection = (col: string) => {
        const updated = selectedCollections.includes(col)
            ? selectedCollections.filter((c) => c !== col)
            : [...selectedCollections, col];
        onCollectionChange(updated);
    };

    const toggleCategory = (cat: string) => {
        const updated = selectedCategories.includes(cat)
            ? selectedCategories.filter((c) => c !== cat)
            : [...selectedCategories, cat];
        onCategoryChange(updated);
    };

    const Chevron = ({ open }: { open: boolean }) => (
        <svg
            className={`h-4 w-4 text-[var(--color-muted)] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
            />
        </svg>
    );

    return (
        <div className="flex flex-col">
            {/* Results count + clear */}
            <div className="mb-5 flex items-center justify-between">
                <p className="text-sm text-[var(--color-fg-soft)]">
                    {t(
                        resultCount === 1
                            ? "catalog.results_count_one"
                            : "catalog.results_count",
                        { count: resultCount },
                    )}
                </p>
                {hasFilters && (
                    <button
                        onClick={onClearAll}
                        className="cursor-pointer text-sm text-[var(--color-fg-soft)] underline transition-colors hover:text-black"
                    >
                        {t("catalog.clear_all")}
                    </button>
                )}
            </div>

            {/* Sort */}
            <div className="mb-6">
                <label className="mb-2 block text-sm font-semibold uppercase tracking-wider text-[var(--color-fg-soft)]">
                    {t("catalog.sort_label")}
                </label>
                <select
                    value={sort}
                    onChange={(e) => onSortChange(e.target.value)}
                    className="w-full cursor-pointer rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-fg)] outline-none transition-colors focus:border-[var(--color-leaf)]"
                >
                    <option value="default">
                        {t("catalog.sort_default")}
                    </option>
                    <option value="price_asc">
                        {t("catalog.sort_price_asc")}
                    </option>
                    <option value="price_desc">
                        {t("catalog.sort_price_desc")}
                    </option>
                    <option value="name_asc">
                        {t("catalog.sort_name_asc")}
                    </option>
                </select>
            </div>

            <div className="h-px w-full bg-gray-200" />

            {/* Collection filters */}
            <div className="py-5">
                <button
                    onClick={() => setCollectionOpen(!collectionOpen)}
                    className="flex w-full cursor-pointer items-center justify-between"
                >
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-fg)]">
                        {t("catalog.collection_section")}
                    </h3>
                    <Chevron open={collectionOpen} />
                </button>
                {collectionOpen && (
                    <div className="mt-3 flex flex-col gap-1.5">
                        {collectionOptions.map((col) => {
                            const active = selectedCollections.includes(col);
                            return (
                                <button
                                    key={col}
                                    onClick={() => toggleCollection(col)}
                                    className={`flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-all duration-200 ${
                                        active
                                            ? "bg-[var(--color-leaf)]/30 font-medium text-[var(--color-fg)]"
                                            : "text-[var(--color-fg-soft)] hover:bg-[var(--color-cream)]"
                                    }`}
                                >
                                    <span
                                        className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border transition-colors ${
                                            active
                                                ? "border-[var(--color-leaf)] bg-[var(--color-leaf)]"
                                                : "border-[var(--color-line)]"
                                        }`}
                                    >
                                        {active && (
                                            <svg
                                                className="h-3 w-3 text-white"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={3}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        )}
                                    </span>
                                    {t(`catalog.collection.${col}`)}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="h-px w-full bg-gray-200" />

            {/* Category filters */}
            <div className="py-5">
                <button
                    onClick={() => setCategoryOpen(!categoryOpen)}
                    className="flex w-full cursor-pointer items-center justify-between"
                >
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-fg)]">
                        {t("catalog.category_section")}
                    </h3>
                    <Chevron open={categoryOpen} />
                </button>
                {categoryOpen && (
                    <div className="mt-3 flex flex-col gap-1.5">
                        {categoryOptions.map((cat) => {
                            const active = selectedCategories.includes(cat);
                            return (
                                <button
                                    key={cat}
                                    onClick={() => toggleCategory(cat)}
                                    className={`flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-all duration-200 ${
                                        active
                                            ? "bg-[var(--color-leaf)]/30 font-medium text-[var(--color-fg)]"
                                            : "text-[var(--color-fg-soft)] hover:bg-[var(--color-cream)]"
                                    }`}
                                >
                                    <span
                                        className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border transition-colors ${
                                            active
                                                ? "border-[var(--color-leaf)] bg-[var(--color-leaf)]"
                                                : "border-[var(--color-line)]"
                                        }`}
                                    >
                                        {active && (
                                            <svg
                                                className="h-3 w-3 text-white"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={3}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        )}
                                    </span>
                                    {t(`catalog.category.${cat}`)}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductFilter;
