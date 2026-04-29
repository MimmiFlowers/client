import { Link } from "react-router";
import { useTranslation } from "react-i18next";

const AboutPage = () => {
    const { t } = useTranslation();

    return (
        <div className="px-4 py-12">
            <title>{t("seo.about_title")}</title>

            <div className="mx-auto w-[95%] max-w-5xl sm:w-[90%] md:w-[85%] lg:w-[80%]">
                {/* Header */}
                <div className="mb-12 text-center">
                    <h1 className="mb-3 text-3xl font-light tracking-wide text-[var(--color-burgundy)] sm:text-4xl">
                        {t("about.title")}
                    </h1>
                    <p className="mx-auto max-w-lg text-sm leading-relaxed text-[var(--color-muted)]">
                        {t("about.subtitle")}
                    </p>
                </div>

                {/* Two-column layout */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    {/* Left column — Our Story */}
                    <div>
                        <h2 className="mb-6 text-[10px] font-medium tracking-[0.2em] text-[var(--color-muted)] uppercase">
                            {t("about.our_story")}
                        </h2>

                        <div className="space-y-4">
                            <div className="rounded-2xl bg-white/70 p-6 backdrop-blur-sm">
                                <p className="text-sm leading-relaxed font-light text-[var(--color-fg-soft)]">
                                    {t("about.paragraph1")}
                                </p>
                            </div>

                            <div className="rounded-2xl bg-white/70 p-6 backdrop-blur-sm">
                                <p className="text-sm leading-relaxed font-light text-[var(--color-fg-soft)]">
                                    {t("about.paragraph2")}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right column — What We Offer + Delivery */}
                    <div className="space-y-8">
                        {/* What We Offer */}
                        <div>
                            <h2 className="mb-6 text-[10px] font-medium tracking-[0.2em] text-[var(--color-muted)] uppercase">
                                {t("about.what_we_offer")}
                            </h2>

                            <div className="rounded-2xl bg-white/70 p-6 backdrop-blur-sm">
                                <p className="text-sm leading-relaxed font-light text-[var(--color-fg-soft)]">
                                    {t("about.paragraph3")}
                                </p>
                            </div>
                        </div>

                        {/* Delivery */}
                        <div>
                            <h2 className="mb-6 text-[10px] font-medium tracking-[0.2em] text-[var(--color-muted)] uppercase">
                                {t("about.delivery_title")}
                            </h2>

                            <div className="rounded-2xl bg-white/70 p-6 backdrop-blur-sm">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-rose)]/30">
                                        <svg
                                            className="h-4.5 w-4.5 text-[var(--color-fg-soft)]"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={1.5}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0H21M3.375 14.25V3.375c0-.621.504-1.125 1.125-1.125h9.75c.621 0 1.125.504 1.125 1.125v7.875m-12 3h12m3.75 0v-3.375c0-.621-.504-1.125-1.125-1.125H18M3.75 14.25h14.25"
                                            />
                                        </svg>
                                    </div>
                                    <p className="text-sm leading-relaxed font-light text-[var(--color-fg-soft)]">
                                        {t("about.delivery_text")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-12 text-center">
                    <Link
                        to="/Catalog"
                        className="inline-block rounded-full bg-[var(--color-burgundy)] px-10 py-3 text-sm font-medium tracking-wider text-white uppercase transition-opacity duration-300 hover:opacity-80"
                    >
                        {t("about.browse_catalog")}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
