import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../../api/api";
import type { CollectionMini } from "../../types/types";
import CollectionCard from "../CollectionCard/CollectionCard";

const SkeletonCollectionCard = () => (
    <div className="aspect-4/3 w-full animate-pulse rounded-lg bg-[var(--color-cream)]" />
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
            {/* Editorial section header */}
            <div className="mt-20 mb-9 flex flex-col items-center text-center sm:mt-24">
                <span className="eyebrow">Curated</span>
                <h2 className="mt-3 font-[var(--font-display)] text-3xl tracking-[0.01em] text-[var(--color-ink)] sm:text-4xl">
                    {t("collections.title")}
                </h2>
                <div className="mt-5 flex items-center gap-3">
                    <span className="block h-px w-10 bg-[var(--color-gold-soft)]" />
                    <span className="ornament">&#10022;</span>
                    <span className="block h-px w-10 bg-[var(--color-gold-soft)]" />
                </div>
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
