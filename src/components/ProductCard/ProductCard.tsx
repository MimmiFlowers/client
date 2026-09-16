import { Link } from "react-router";
import type { ProductMini } from "../../types/types";
import { ArrowUpRightIcon } from "../Icons/Icons";

type Props = {
    productMini: ProductMini & { collection?: string };
    /** Show the collection label over the image (catalogue grid). */
    showCollection?: boolean;
    eager?: boolean;
};

export const ProductCardSkeleton = () => (
    <div aria-hidden="true">
        <div className="aspect-[4/5] w-full animate-shimmer rounded-[2px] bg-blush-deep" />
        <div className="mt-4 h-5 w-2/3 animate-shimmer rounded-full bg-blush-deep" />
        <div className="mt-2 h-4 w-1/4 animate-shimmer rounded-full bg-blush-deep" />
    </div>
);

const ProductCard = ({ productMini, showCollection, eager }: Props) => {
    const { productID, name, picture, price, collection } = productMini;

    return (
        <Link
            to={`/Catalog/${productID}`}
            className="group block focus-visible:outline-offset-4"
        >
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2px] bg-blush-deep">
                <img
                    src={picture}
                    alt={name}
                    loading={eager ? "eager" : "lazy"}
                    className="h-full w-full object-cover transition-transform duration-[1400ms] ease-luxe group-hover:scale-[1.045]"
                />

                {showCollection && collection && (
                    <span className="absolute top-3 left-3 bg-surface/90 px-2.5 py-1 text-[10px] font-medium tracking-[0.16em] text-ink uppercase">
                        {collection}
                    </span>
                )}

                {/* Hover affordance — pointer devices only */}
                <span className="absolute right-3 bottom-3 hidden h-11 w-11 translate-y-3 items-center justify-center rounded-full bg-surface text-ink opacity-0 shadow-soft transition-all duration-500 ease-luxe group-hover:translate-y-0 group-hover:opacity-100 [@media(hover:hover)]:flex">
                    <ArrowUpRightIcon className="h-4 w-4" />
                </span>
            </div>

            <div className="mt-4 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                <h3 className="font-display text-[1.15rem] leading-tight text-ink sm:text-xl">
                    <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 ease-luxe group-hover:bg-[length:100%_1px]">
                        {name}
                    </span>
                </h3>
                <p className="price shrink-0 text-sm text-ink-soft">
                    {price.toLocaleString("sv-SE")} kr
                </p>
            </div>
        </Link>
    );
};

export default ProductCard;
