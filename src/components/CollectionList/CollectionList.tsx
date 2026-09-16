import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../../api/api";
import type { CollectionMini } from "../../types/types";
import CollectionCard from "../CollectionCard/CollectionCard";
import Reveal from "../Reveal/Reveal";

const CollectionList = () => {
    const [collectionsMini, setCollectionsMini] = useState<CollectionMini[]>(
        [],
    );
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [active, setActive] = useState(0);
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

    const preview = collectionsMini[active];

    return (
        <section
            className="container-luxe mt-24 md:mt-36"
            aria-labelledby="collections-title"
        >
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
                {/* Intro + live preview */}
                <div className="lg:col-span-5">
                    <div className="lg:sticky lg:top-36">
                        <Reveal>
                            <p className="eyebrow flex items-center gap-3">
                                <span className="price text-ink">03</span>
                                <span className="h-px w-8 bg-line-strong" />
                                {t("catalog.collection_section")}
                            </p>
                            <h2
                                id="collections-title"
                                className="mt-4 font-display text-[2.4rem] leading-[1] font-medium tracking-[-0.02em] sm:text-5xl lg:text-6xl"
                            >
                                {t("collections.title")}
                            </h2>
                            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-ink-soft">
                                {t("home.collections_text")}
                            </p>
                        </Reveal>

                        <div className="mt-10 hidden aspect-[4/5] max-w-[17rem] overflow-hidden rounded-t-full bg-blush-deep lg:block">
                            {preview && (
                                <img
                                    key={preview.name}
                                    src={preview.picture}
                                    alt=""
                                    loading="lazy"
                                    className="h-full w-full animate-fade object-cover"
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Index */}
                <div className="lg:col-span-7">
                    {error && (
                        <p className="py-8 text-sm text-danger" role="alert">
                            {error}
                        </p>
                    )}
                    <div className="border-t border-line">
                        {loading &&
                            Array.from({ length: 5 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-5 border-b border-line py-7"
                                    aria-hidden="true"
                                >
                                    <div className="h-8 w-2/3 animate-shimmer rounded-full bg-blush-deep" />
                                </div>
                            ))}
                        {!loading &&
                            !error &&
                            collectionsMini.map((collectionMini, i) => (
                                <Reveal key={collectionMini.name} delay={i * 60}>
                                    <CollectionCard
                                        collectionMini={collectionMini}
                                        position={i + 1}
                                        onActivate={() => setActive(i)}
                                    />
                                </Reveal>
                            ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CollectionList;
