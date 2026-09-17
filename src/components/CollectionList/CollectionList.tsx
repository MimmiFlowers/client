import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import api from "../../api/api";
import type { CollectionMini, Product } from "../../types/types";
import CollectionCard from "../CollectionCard/CollectionCard";
import Reveal from "../Reveal/Reveal";
import { ArrowRightIcon } from "../Icons/Icons";

const CollectionList = () => {
    const [collectionsMini, setCollectionsMini] = useState<CollectionMini[]>(
        [],
    );
    const [fromPrices, setFromPrices] = useState<Record<string, number>>({});
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

    /** "From N kr" per collection. Non-critical: stays hidden if it fails. */
    const fetchFromPrices = async () => {
        try {
            const response = await api.get("/data/products");
            const lowest: Record<string, number> = {};
            for (const product of (response.data.products ?? []) as Product[]) {
                const key = product.collection?.toLowerCase();
                if (!key) continue;
                lowest[key] = Math.min(lowest[key] ?? Infinity, product.price);
            }
            setFromPrices(lowest);
        } catch {
            // No price line, nothing else changes.
        }
    };

    useEffect(() => {
        fetchCollectionsMini();
        fetchFromPrices();
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
                    className="container-luxe mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-5 lg:gap-6"
                >
                    {loading
                        ? Array.from({ length: 4 }).map((_, i) => (
                              <div
                                  key={i}
                                  className="aspect-[16/10] animate-shimmer rounded-[2px] bg-blush sm:aspect-[3/2]"
                                  aria-hidden="true"
                              />
                          ))
                        : collectionsMini.map((collectionMini) => (
                              <CollectionCard
                                  key={collectionMini.name}
                                  collectionMini={collectionMini}
                                  fromPrice={
                                      fromPrices[
                                          collectionMini.name.toLowerCase()
                                      ]
                                  }
                              />
                          ))}
                </Reveal>
            )}
        </section>
    );
};

export default CollectionList;
