import { useState, useEffect } from "react";
import ProductListItem from "../BouquetCard/BouquetCard";
import axios from "axios";
import type { BouquetMini } from "../../types/types";

const ProductList = () => {
    const [bouquetsMini, setBouquetsMini] = useState<BouquetMini[]>([]);

    const fetchBouquetsMini = async () => {
        const urlDev = "http://localhost:8500/flowers";

        const flowers = await axios.get(urlDev);
        setBouquetsMini(flowers.data.data);
        return;
    };

    useEffect(() => {
        fetchBouquetsMini();
    }, []);

    return (
        <div className="Flowers-container">
        <h2 className="Flowers-container_title">Our Bouquets</h2>
        <div className="Flowers-container_bouquets">
            {bouquetsMini.length > 0 &&
                bouquetsMini.map((bouquetMini) => (
                    <ProductListItem key={bouquetMini.name} bouquetMini={bouquetMini} />
            ))}
        </div>
        </div>
    );
};

export default ProductList;
