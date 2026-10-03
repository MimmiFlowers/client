import { useState, useEffect } from "react";
import { Link } from "react-router";
import ProductCard, { ProductCardSkeleton } from "../ProductCard/ProductCard";
import Reveal from "../Reveal/Reveal";
import { ArrowRightIcon } from "../Icons/Icons";
import { useTranslation } from "react-i18next";
import api from "../../api/api";
import type { SpecialProps, ProductMini } from "../../types/types";

const Specials = ({ setting }: SpecialProps) => {
    const [productsMini, setProductsMini] = useState<ProductMini[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { t } = useTranslation();
    const key = setting.toLowerCase();

    const fetchProductsMini = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await api.get(`/data/category/${key}`);
            setProductsMini(response.data.data);
        } catch {
            setError(t("errors.load_products"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProductsMini();
    }, []);

    const showAll = (
        <Link
            to={`/Catalog?filter=${key}`}
            className="group inline-flex min-h-11 items-center gap-3 text-label font-medium tracking-[0.16em] text-ink uppercase"
        >
            <span className="border-b border-ink/30 pb-1 transition-colors duration-300 group-hover:border-ink">
                {t("specials.show_all")}
            </span>
            <ArrowRightIcon className="h-4 w-4 transition-transform duration-500 ease-luxe group-hover:translate-x-1" />
        </Link>
    );

    return (
        <section className="mt-section" aria-labelledby={`specials-${key}`}>
            <Reveal className="container-luxe flex items-end justify-between gap-6">
                <div>
                    <h2
                        id={`specials-${key}`}
                        className="font-display text-section leading-[1] font-medium tracking-[-0.02em]"
                    >
                        {t(`specials.${key}_title`)}
                    </h2>
                </div>
                <div className="hidden sm:block">{showAll}</div>
            </Reveal>

            {error ? (
                <p className="container-luxe mt-10 text-caption text-danger" role="alert">
                    {error}
                </p>
            ) : (
                <Reveal delay={120}>
                    {/* Phones: horizontal snap rail. sm+: grid. */}
                    <div className="no-scrollbar mt-10 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-2 sm:mx-auto sm:grid sm:max-w-[90rem] sm:px-8 lg:px-14 sm:snap-none sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 sm:overflow-visible sm:pb-0 lg:grid-cols-4">
                        {loading
                            ? Array.from({ length: 4 }).map((_, i) => (
                                  <div
                                      key={i}
                                      className="w-[72vw] shrink-0 snap-start sm:w-auto"
                                  >
                                      <ProductCardSkeleton />
                                  </div>
                              ))
                            : productsMini.map((productMini) => (
                                  <div
                                      key={productMini.productID}
                                      className="w-[72vw] shrink-0 snap-start sm:w-auto"
                                  >
                                      <ProductCard productMini={productMini} />
                                  </div>
                              ))}
                    </div>
                </Reveal>
            )}

            <div className="container-luxe mt-6 sm:hidden">{showAll}</div>
        </section>
    );
};

export default Specials;
