import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import type { CollectionMini } from "../../types/types";
import { ArrowUpRightIcon } from "../Icons/Icons";

type Props = {
    collectionMini: CollectionMini;
};

/** One tile in the collections panel. */
const CollectionCard = ({ collectionMini }: Props) => {
    const { t } = useTranslation();
    const slug = collectionMini.name.toLowerCase();
    const label = t(`catalog.collection.${slug}`, {
        defaultValue: collectionMini.name,
    });

    return (
        <Link
            to={`/Catalog?collection=${encodeURIComponent(slug)}`}
            className="group relative block aspect-[4/5] overflow-hidden rounded-[2px] bg-blush-deep"
        >
            <img
                src={collectionMini.picture}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover object-center transition-transform duration-[1400ms] ease-luxe group-hover:scale-[1.05]"
                onError={(e) => {
                    (e.target as HTMLImageElement).style.visibility = "hidden";
                }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/15 to-transparent" />

            <span className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full border border-blush/50 text-blush transition-colors duration-500 ease-luxe group-hover:bg-blush group-hover:text-ink sm:top-4 sm:right-4">
                <ArrowUpRightIcon className="h-4 w-4" />
            </span>

            <h3 className="absolute inset-x-0 bottom-0 p-4 font-display text-[1.15rem] leading-tight text-balance text-blush sm:p-5 sm:text-2xl">
                {label}
            </h3>
        </Link>
    );
};

export default CollectionCard;
