import { useTranslation } from "react-i18next";
import { CheckIcon, ChevronDownIcon } from "../Icons/Icons";
import {
    categoryOptions,
    collectionOptions,
    sortOptions,
} from "./filterOptions";

type Props = {
    selectedCollections: string[];
    selectedCategories: string[];
    onCollectionChange: (collections: string[]) => void;
    onCategoryChange: (categories: string[]) => void;
    sort: string;
    onSortChange: (sort: string) => void;
    resultCount: number;
    onClearAll: () => void;
    /** The mobile sheet shows sort in the toolbar instead. */
    showSort?: boolean;
};

export const SortSelect = ({
    id,
    value,
    onChange,
    className = "",
}: {
    id: string;
    value: string;
    onChange: (sort: string) => void;
    className?: string;
}) => {
    const { t } = useTranslation();

    return (
        <div className={`relative ${className}`}>
            <select
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="min-h-11 w-full cursor-pointer appearance-none rounded-none border-b border-line-strong bg-transparent pr-7 text-body-sm text-ink transition-colors outline-none focus:border-ink"
            >
                {sortOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                        {t(o.key)}
                    </option>
                ))}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-0 h-4 w-4 -translate-y-1/2 text-ink" />
        </div>
    );
};

const Option = ({
    active,
    label,
    onClick,
}: {
    active: boolean;
    label: string;
    onClick: () => void;
}) => (
    <li>
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            className={`group flex min-h-11 w-full cursor-pointer items-center gap-3 text-left text-body-sm transition-colors duration-300 ${
                active ? "text-ink" : "text-ink-soft hover:text-ink"
            }`}
        >
            <span
                className={`flex h-[1.1rem] w-[1.1rem] shrink-0 items-center justify-center rounded-[3px] border transition-all duration-300 ${
                    active
                        ? "border-ink bg-ink text-blush"
                        : "border-line-strong group-hover:border-ink"
                }`}
            >
                {active && <CheckIcon className="h-3 w-3" strokeWidth={2} />}
            </span>
            {label}
        </button>
    </li>
);

const ProductFilter = ({
    selectedCollections,
    selectedCategories,
    onCollectionChange,
    onCategoryChange,
    sort,
    onSortChange,
    resultCount,
    onClearAll,
    showSort = true,
}: Props) => {
    const { t } = useTranslation();

    const hasFilters =
        selectedCollections.length > 0 || selectedCategories.length > 0;

    const toggle = (list: string[], value: string) =>
        list.includes(value)
            ? list.filter((v) => v !== value)
            : [...list, value];

    return (
        <div className="flex flex-col">
            <div className="flex min-h-11 items-center justify-between border-b border-line pb-4">
                <p className="price text-caption text-muted">
                    {t(
                        resultCount === 1
                            ? "catalog.results_count_one"
                            : "catalog.results_count",
                        { count: resultCount },
                    )}
                </p>
                {hasFilters && (
                    <button
                        type="button"
                        onClick={onClearAll}
                        className="min-h-11 cursor-pointer text-label tracking-[0.12em] text-ink uppercase underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-ink"
                    >
                        {t("catalog.clear_all")}
                    </button>
                )}
            </div>

            {showSort && (
                <div className="border-b border-line py-6">
                    <label htmlFor="catalog-sort" className="eyebrow block">
                        {t("catalog.sort_label")}
                    </label>
                    <SortSelect
                        id="catalog-sort"
                        value={sort}
                        onChange={onSortChange}
                        className="mt-3"
                    />
                </div>
            )}

            <fieldset className="border-b border-line py-6">
                <legend className="eyebrow float-left mb-3 w-full">
                    {t("catalog.collection_section")}
                </legend>
                <ul className="clear-both">
                    {collectionOptions.map((col) => (
                        <Option
                            key={col}
                            active={selectedCollections.includes(col)}
                            label={t(`catalog.collection.${col}`)}
                            onClick={() =>
                                onCollectionChange(
                                    toggle(selectedCollections, col),
                                )
                            }
                        />
                    ))}
                </ul>
            </fieldset>

            <fieldset className="py-6">
                <legend className="eyebrow float-left mb-3 w-full">
                    {t("catalog.category_section")}
                </legend>
                <ul className="clear-both">
                    {categoryOptions.map((cat) => (
                        <Option
                            key={cat}
                            active={selectedCategories.includes(cat)}
                            label={t(`catalog.category.${cat}`)}
                            onClick={() =>
                                onCategoryChange(toggle(selectedCategories, cat))
                            }
                        />
                    ))}
                </ul>
            </fieldset>
        </div>
    );
};

export default ProductFilter;
