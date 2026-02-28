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
            className="flex w-[24%] flex-col items-center justify-center overflow-hidden transition duration-500 hover:cursor-pointer"
            onClick={handleRedirect}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-label={`${productMini.name}, ${productMini.price} kr`}
        >
            <img
                className="aspect-[3/4] w-[100%] transform rounded object-cover shadow-lg transition duration-500 hover:scale-105"
                src={productMini.picture}
                alt={productMini.name}
            />
            <p className="mt-3 text-center text-xl font-semibold uppercase">
                {productMini.name}
            </p>
            <p className="text-center text-xl">{productMini.price}kr</p>
        </div>
    );
};

export default ProductCard;
