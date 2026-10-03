import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import type { CollectionMini } from "../../types/types";
import { ArrowRightIcon } from "../Icons/Icons";

type Props = {
    collectionMini: CollectionMini;
    /** Lowest product price in this collection, when known. */
    fromPrice?: number;
};

/** Large editorial tile in the collections panel. */
const CollectionCard = ({ collectionMini, fromPrice }: Props) => {
    const { t } = useTranslation();
    const slug = collectionMini.name.toLowerCase();
    const label = t(`catalog.collection.${slug}`, {
        defaultValue: collectionMini.name,
    });
    const description = t(`collections.desc.${slug}`, { defaultValue: "" });

    return (
        <Link
            to={`/Catalog?collection=${encodeURIComponent(slug)}`}
            className="group relative block aspect-[16/10] overflow-hidden rounded-[2px] bg-blush-deep sm:aspect-[3/2]"
        >
            <img
                src={collectionMini.picture}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover object-center transition-transform duration-[1600ms] ease-luxe group-hover:scale-[1.04]"
                onError={(e) => {
                    (e.target as HTMLImageElement).style.visibility = "hidden";
                }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/45 to-ink/10" />

            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 lg:p-7">
                <div className="max-w-[26rem]">
                    {description && (
                        <p className="text-label font-medium tracking-[0.18em] text-blush/80 uppercase">
                            {description}
                        </p>
                    )}

                    <h3 className="mt-2 font-display text-[1.7rem] leading-[1.05] tracking-[-0.02em] text-balance text-blush sm:text-[2rem] lg:text-[2.4rem]">
                        <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-700 ease-luxe group-hover:bg-[length:100%_1px]">
                            {label}
                        </span>
                    </h3>

                    <div className="mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-2">
                        <span className="flex h-10 items-center gap-3 rounded-full border border-blush/45 pr-3 pl-4 text-label font-medium tracking-[0.16em] text-blush uppercase transition-colors duration-500 ease-luxe group-hover:bg-blush group-hover:text-ink">
                            {t("collections.view")}
                            <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-500 ease-luxe group-hover:translate-x-0.5" />
                        </span>
                        {fromPrice !== undefined && (
                            <span className="price text-caption text-blush/85">
                                {t("collections.from_price", {
                                    price: fromPrice.toLocaleString("sv-SE"),
                                })}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default CollectionCard;
