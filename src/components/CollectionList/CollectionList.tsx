import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../../api/api";
import type { CollectionMini } from "../../types/types";
import CollectionCard from "../CollectionCard/CollectionCard";

const SkeletonCollectionCard = () => (
    <div className="aspect-[5/6] w-full animate-pulse rounded-tl-[40%] rounded-br-[40%] rounded-tr-3xl rounded-bl-3xl bg-[var(--color-line)]/50" />
);

const SectionLeaf = () => (
    <svg viewBox="0 0 32 16" fill="currentColor" className="h-4 w-8 text-[var(--color-leaf)]" aria-hidden="true">
        <path d="M16 8 C 10 4, 4 5, 0 8 C 4 11, 10 12, 16 8 Z" />
        <path d="M16 8 C 22 4, 28 5, 32 8 C 28 11, 22 12, 16 8 Z" />
    </svg>
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
            <div className="mb-12 flex flex-col items-center text-center">
                <SectionLeaf />
                <p className="eyebrow mt-3">A garden of</p>
                <h2 className="mt-3 font-display text-4xl italic leading-[1.05] tracking-[-0.02em] text-[var(--color-ink)] sm:text-5xl md:text-6xl">
                    {t("collections.title")}
                </h2>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--color-fg-soft)]">
                    {t(
                        "collections.editorial_lede",
                        "Each composition begins with a feeling — and ends in your hands.",
                    )}
                </p>
                <div className="mt-6 leaf-rule w-32" />
            </div>

            <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 md:gap-10">
                {loading && Array.from({ length: 4 }).map((_, i) => <SkeletonCollectionCard key={i} />)}
                {error && (
                    <p className="col-span-full py-8 text-center text-sm text-[var(--color-accent-deep)]">{error}</p>
                )}
                {!loading && !error &&
                    collectionsMini.map((c) => (
                        <CollectionCard key={c.name} collectionMini={c} />
                    ))}
            </div>
        </section>
    );
};

export default CollectionList;
