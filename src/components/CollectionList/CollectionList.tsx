import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../../api/api";
import type { CollectionMini } from "../../types/types";
import CollectionCard from "../CollectionCard/CollectionCard";

const SkeletonCollectionCard = () => (
    <div className="ribbon-frame aspect-[5/6] w-full animate-pulse" />
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
        <section className="w-full px-5 sm:px-8 lg:px-12 py-20 sm:py-28">
            {/* Centered ornate header */}
            <div className="mb-14 sm:mb-20 text-center">
                <span className="ornament block text-xs text-[var(--color-gold)] mb-4 flicker">
                    ✦ ✦ ✦
                </span>
                <span className="eyebrow">— Le Salon —</span>
                <h2 className="mt-4 font-display italic text-[var(--color-burgundy)] text-4xl sm:text-5xl lg:text-6xl leading-[1.05]">
                    {t("collections.title")}
                </h2>
                <div className="mt-7 mx-auto max-w-md gold-rule" />
            </div>

            <div className="grid w-full grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:gap-x-12 max-w-6xl mx-auto">
                {loading &&
                    Array.from({ length: 4 }).map((_, i) => (
                        <SkeletonCollectionCard key={i} />
                    ))}
                {error && (
                    <p className="col-span-full py-8 text-center text-sm text-[var(--color-burgundy)]">
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
