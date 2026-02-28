import { useNavigate } from "react-router";
import type { Product } from "../../types/types";

const ProductList = ({ products }: { products: Product[] }) => {
    const navigate = useNavigate();

    const handleRedirect = (e: React.MouseEvent, productID: string) => {
        e.preventDefault();
        navigate(`/Catalog/${productID}`);
    };

    return (
        <div className="grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
            {products.map((product) => (
                <div
                    key={product.productID}
                    className="rounded bg-white p-4 shadow-md hover:cursor-pointer"
                    onClick={(e) => handleRedirect(e, product.productID)}
                >
                    <img
                        src={product.picture}
                        alt={product.name}
                        className="mb-2 aspect-[3/4] w-full transform rounded object-cover transition duration-500 hover:scale-105"
                    />
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <p>{product.price} kr</p>
                </div>
            ))}
        </div>
    );
};

export default ProductList;
