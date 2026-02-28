import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";
import ProductFilter from "../../components/ProductFilter/ProductFilter";
import ProductList from "../../components/ProductList/ProductList.tsx";
import type { Product } from "../../types/types";
import api from "../../api/api";

const ProductListPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
    const { t } = useTranslation();

    const fetchProducts = async () => {
        setLoading(true);
        setError("");

        try {
            const fetchedProducts = await api.get("/data/products");
            setProducts(fetchedProducts.data.products);
        } catch {
            setError(t("errors.load_products"));
        } finally {
            setLoading(false);
        }
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
        setSearchParams({ filter: newFilters }); // sync with URL
    };

    return (
        <div className="flex flex-col items-center p-4">
            <ProductFilter
                selected={selectedFilters}
                onChange={handleFilterChange}
            />
            {loading && (
                <p className="w-full py-8 text-center text-gray-400">
                    {t("loading")}
                </p>
            )}
            {error && (
                <p className="w-full py-8 text-center text-red-500">
                    {error}
                </p>
            )}
            {!loading && !error && <ProductList products={filteredProducts} />}
        </div>
    );
};

export default ProductListPage;
