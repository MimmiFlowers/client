import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../../api/api";
import type { CollectionMini } from "../../types/types";
import CollectionCard from "../CollectionCard/CollectionCard";

const SkeletonCollectionCard = () => (
    <div className="aspect-[5/6] w-full animate-pulse bg-[var(--color-line)]/40" />
);

const CollectionList = () => {
    const [collectionsMini, setCollectionsMini] = useState<CollectionMini[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { t } = useTranslation();

    useEffect(() => {
        const fetch = async () => {
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
        fetch();
    }, [t]);

    return (
        <section className="mx-auto mt-24 mb-20 w-[92%] md:w-[88%]">
            {/* Editorial section header */}
            <div className="mb-12 grid gap-6 md:grid-cols-12 md:gap-12">
                <div className="md:col-span-5">
                    <p className="eyebrow text-[var(--color-accent-deep)]">
                        Chapter Two
                    </p>
                    <h2 className="mt-4 font-display text-4xl leading-[1.02] tracking-[-0.02em] text-[var(--color-ink)] sm:text-5xl md:text-6xl">
                        {t("collections.title")}
                    </h2>
                </div>
                <div className="flex items-end md:col-span-6 md:col-start-7">
                    <p className="max-w-md text-base leading-relaxed text-[var(--color-fg-soft)]">
                        {t(
                            "collections.editorial_lede",
                            "Curated chapters of our season — each composition tells its own quiet story.",
                        )}
                    </p>
                </div>
            </div>

            <div className="hairline mb-10" />

            <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 md:gap-10">
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
                    collectionsMini.map((c) => (
                        <CollectionCard key={c.name} collectionMini={c} />
                    ))}
            </div>
        </section>
    );
};

export default CollectionList;
