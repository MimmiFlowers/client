import { useNavigate } from "react-router";
import type { ProductMini } from "../../types/types";

const ProductCard = ({ productMini }: { productMini: ProductMini }) => {
    // const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    const handleRedirect = (e: React.MouseEvent) => {
        e.preventDefault();
        navigate(`Catalog/${productMini.productID}`);
    };

    return (
        <div
            className="flex w-[24%] flex-col items-center justify-center overflow-hidden transition duration-500 hover:cursor-pointer"
            onClick={handleRedirect}
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
