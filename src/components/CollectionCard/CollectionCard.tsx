import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import type { CollectionMini } from "../../types/types";
import { ArrowRightIcon } from "../Icons/Icons";

type Props = {
    collectionMini: CollectionMini;
    position: number;
    onActivate?: () => void;
};

/** One row of the collections index. */
const CollectionCard = ({ collectionMini, position, onActivate }: Props) => {
    const { t } = useTranslation();
    const slug = collectionMini.name.toLowerCase();
    const label = t(`catalog.collection.${slug}`, {
        defaultValue: collectionMini.name,
    });

    return (
        <Link
            to={`/Catalog?collection=${encodeURIComponent(slug)}`}
            onMouseEnter={onActivate}
            onFocus={onActivate}
            className="group flex items-center gap-5 border-b border-line py-5 md:gap-8 md:py-7"
        >
            <span className="price w-6 shrink-0 text-xs text-muted md:w-8">
                {String(position).padStart(2, "0")}
            </span>

            {/* Thumbnail on phones/tablets; desktop uses the shared preview. */}
            <span className="block h-20 w-16 shrink-0 overflow-hidden rounded-t-full bg-blush-deep lg:hidden">
                <img
                    src={collectionMini.picture}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover"
                />
            </span>

            <span className="flex-1 font-display text-[1.75rem] leading-none tracking-[-0.02em] text-ink transition-transform duration-700 ease-luxe sm:text-4xl md:group-hover:translate-x-3 lg:text-5xl">
                {label}
            </span>

            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line-strong text-ink transition-all duration-500 ease-luxe group-hover:border-ink group-hover:bg-ink group-hover:text-blush">
                <ArrowRightIcon className="h-4 w-4" />
            </span>
        </Link>
    );
};

export default CollectionCard;
