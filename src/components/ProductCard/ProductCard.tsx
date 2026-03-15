import { useNavigate } from "react-router";
import type { ProductMini } from "../../types/types";

const ProductCard = ({ productMini }: { productMini: ProductMini }) => {
    const navigate = useNavigate();

    const handleRedirect = () => {
        navigate(`/Catalog/${productMini.productID}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleRedirect();
        }
    };

    return (
        <div
            className="group cursor-pointer"
            onClick={handleRedirect}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-label={`${productMini.name}, ${productMini.price} kr`}
        >
            {/* Image container */}
            <div className="overflow-hidden rounded-xl">
                <img
                    className="aspect-[3/4] w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    src={productMini.picture}
                    alt={productMini.name}
                    loading="lazy"
                />
            </div>

            {/* Info */}
            <div className="mt-3 px-0.5">
                <p className="text-sm font-semibold uppercase leading-tight text-gray-900 sm:text-base">
                    {productMini.name}
                </p>
                <p className="mt-0.5 text-sm text-gray-600 sm:text-base">
                    {productMini.price.toLocaleString()} kr
                </p>
            </div>
        </div>
    );
};

export default ProductCard;
