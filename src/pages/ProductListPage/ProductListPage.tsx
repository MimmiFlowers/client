import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import ProductFilter from "../../components/ProductFilter/ProductFilter";
import ProductList from "../../components/ProductList/ProductList.tsx";
import type { Product } from "../../types/types";
import axios from "axios";

const ProductListPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

    const fetchProducts = async () => {
        const apiUrl = import.meta.env.VITE_API_URL;
        const fetchedProducts = await axios.get(`${apiUrl}/data/products`);
        setProducts(fetchedProducts.data.products);
        return;
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        const filters = searchParams.getAll("filter");
        setSelectedFilters(filters);
    }, [searchParams]);

    useEffect(() => {
        if (selectedFilters.length === 0) {
            setFilteredProducts(products);
        } else {
            console.log("Selected Filters:", products);

            const filtered = products.filter((p) => {
                const productGroups = [
                    p.category?.toLowerCase(),
                    p.collection?.toLowerCase(),
                ].filter(Boolean);

                return productGroups.some((group) =>
                    selectedFilters.includes(group),
                );
            });
            setFilteredProducts(filtered);
        }
    }, [selectedFilters, products]);

    const handleFilterChange = (newFilters: string[]) => {
        setSelectedFilters(newFilters);
        setSearchParams({ filter: newFilters }); // синхронизация с URL
    };

    return (
        <div className="flex flex-col items-center p-4">
            <ProductFilter
                selected={selectedFilters}
                onChange={handleFilterChange}
            />
            <ProductList products={filteredProducts} />
        </div>
    );
};

export default ProductListPage;
