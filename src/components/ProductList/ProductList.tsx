import { useNavigate } from "react-router";
import type { Bouquet } from "../../types/types";

const ProductList = ({ products }: { products: Bouquet[] }) => {
    const navigate = useNavigate();

    const handleRedirect = (e: React.MouseEvent, productID: string) => {
        e.preventDefault();
        navigate(`/Catalog/${productID}`);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
            {products.map((product) => (
                <div
                    key={product.name}
                    className="shadow-md p-4 bg-white rounded hover:cursor-pointer"
                    onClick={(e) => handleRedirect(e, product.id)}
                >
                    <img
                        src={product.picture}
                        alt={product.name}
                        className="w-full aspect-square object-cover rounded mb-2 transform transition duration-500 hover:scale-105"
                    />
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <p>{product.price} kr</p>
                </div>
            ))}
        </div>
    );
};

export default ProductList;
