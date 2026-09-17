import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import api from "../../api/api";
import type { CollectionMini } from "../../types/types";
import CollectionCard from "../CollectionCard/CollectionCard";
import Reveal from "../Reveal/Reveal";
import { ArrowRightIcon } from "../Icons/Icons";

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
        <section
            className="mt-24 bg-blush-deep py-20 md:mt-36 md:py-28"
            aria-labelledby="collections-title"
        >
            <Reveal className="container-luxe flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
                <div>
                    <h2
                        id="collections-title"
                        className="font-display text-[2.4rem] leading-[1] font-medium tracking-[-0.02em] sm:text-5xl lg:text-6xl"
                    >
                        {t("collections.title")}
                    </h2>
                    <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-soft">
                        {t("home.collections_text")}
                    </p>
                </div>
                <Link
                    to="/Catalog"
                    className="group inline-flex min-h-11 items-center gap-3 text-[12px] font-medium tracking-[0.16em] text-ink uppercase"
                >
                    <span className="border-b border-ink/30 pb-1 transition-colors duration-300 group-hover:border-ink">
                        {t("specials.show_all")}
                    </span>
                    <ArrowRightIcon className="h-4 w-4 transition-transform duration-500 ease-luxe group-hover:translate-x-1" />
                </Link>
            </Reveal>

            {error ? (
                <p className="container-luxe mt-10 text-sm text-danger" role="alert">
                    {error}
                </p>
            ) : (
                <Reveal
                    delay={120}
                    className="container-luxe mt-10 grid grid-cols-2 gap-3 sm:mt-12 sm:grid-cols-3 sm:gap-5"
                >
                    {loading
                        ? Array.from({ length: 6 }).map((_, i) => (
                              <div
                                  key={i}
                                  className="aspect-[4/5] animate-shimmer rounded-[2px] bg-blush"
                                  aria-hidden="true"
                              />
                          ))
                        : collectionsMini.map((collectionMini) => (
                              <CollectionCard
                                  key={collectionMini.name}
                                  collectionMini={collectionMini}
                              />
                          ))}
                </Reveal>
            )}
        </section>
    );
};

export default CollectionList;
