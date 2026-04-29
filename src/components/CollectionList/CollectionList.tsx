import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../../api/api";
import type { CollectionMini } from "../../types/types";
import CollectionCard from "../CollectionCard/CollectionCard";

const SkeletonCollectionCard = () => (
    <div>
        <div className="tile-frame aspect-[5/6] w-full animate-pulse" />
        <div className="mt-5 h-4 w-1/2 bg-[var(--color-line)] animate-pulse" />
    </div>
);

const CollectionList = () => {
    const [collectionsMini, setCollectionsMini] = useState<CollectionMini[]>([]);
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
        <section className="w-full px-5 sm:px-8 lg:px-12 py-16 sm:py-24">
            {/* Section header — gallery wing label */}
            <div className="mb-12 sm:mb-16 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                    <span className="eyebrow-muted">— Chapter 02</span>
                    <h2 className="mt-3 font-display text-[var(--color-obsidian)] text-4xl sm:text-5xl lg:text-6xl leading-[0.95]">
                        {t("collections.title")}
                    </h2>
                </div>
                <p className="max-w-sm text-[var(--color-fg-soft)] text-sm sm:text-base leading-relaxed">
                    Curated chapters of the season — each composition signed by the atelier.
                </p>
            </div>

            {/* Collection grid — 2up wide */}
            <div className="grid w-full grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:gap-x-12">
                {loading &&
                    Array.from({ length: 4 }).map((_, i) => (
                        <SkeletonCollectionCard key={i} />
                    ))}
                {error && (
                    <p className="col-span-full py-8 text-center text-sm text-[var(--color-accent-deep)]">
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
