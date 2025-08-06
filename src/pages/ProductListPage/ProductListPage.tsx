import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import ProductFilter from "../../components/ProductFilter/ProductFilter";
import ProductList from "../../components/ProductList/ProductList.tsx";
import type { Bouquet } from "../../types/types";
import axios from "axios";

const ProductListPage = () => {
    const [products, setProducts] = useState<Bouquet[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Bouquet[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

    const fetchProducts = async () => {
        const urlDev = "http://localhost:8500/flowers";
        const fetchedProducts = await axios.get(urlDev);

        setProducts(fetchedProducts.data.data);
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
            const filtered = products.filter((p) => {
                const bouquetGroups = [
                p.category?.toLowerCase(),
                p.collection?.toLowerCase(),
                ].filter(Boolean);

                return bouquetGroups.some((group) => selectedFilters.includes(group));
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
        <ProductFilter selected={selectedFilters} onChange={handleFilterChange} />
        <ProductList products={filteredProducts} />
        </div>
    );
};

export default ProductListPage;
