import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../../api/api";
import type { CollectionMini } from "../../types/types";
import CollectionCard from "../CollectionCard/CollectionCard";

const SkeletonCollectionCard = () => (
    <div className="aspect-4/3 w-full animate-pulse rounded-xl bg-gray-200" />
);

const CollectionList = () => {
    const [collectionsMini, setCollectionsMini] = useState<CollectionMini[]>(
        [],
    );
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { t } = useTranslation();

    const fetchCollectionsMini = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await api.get("/data/collections");
            setCollectionsMini(response.data.data);
        } catch {
            setError(t("errors.load_collections"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCollectionsMini();
    }, []);

    return (
        <section className="w-[95%] sm:w-[90%] md:w-[80%]">
            {/* Section title with hairline dividers */}
            <div className="mt-14 mb-8 flex items-center gap-4">
                <div className="h-px flex-1 bg-gray-200" />
                <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500 sm:text-sm">
                    {t("collections.title")}
                </h2>
                <div className="h-px flex-1 bg-gray-200" />
            </div>

            {/* Collection grid */}
            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                {loading &&
                    Array.from({ length: 4 }).map((_, i) => (
                        <SkeletonCollectionCard key={i} />
                    ))}
                {error && (
                    <p className="col-span-full py-8 text-center text-sm text-red-400">
                        {error}
                    </p>
                )}
                {!loading &&
                    !error &&
                    collectionsMini.map((collectionMini) => (
                        <CollectionCard
                            key={collectionMini.name}
                            collectionMini={collectionMini}
                        />
                    ))}
            </div>
        </section>
    );
};

export default CollectionList;
