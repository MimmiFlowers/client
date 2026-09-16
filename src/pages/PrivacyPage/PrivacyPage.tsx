import { useTranslation } from "react-i18next";

const PrivacyPage = () => {
    const { t } = useTranslation();

    return (
        <div className="container-luxe pt-10 md:pt-16">
            <title>{t("seo.privacy_title")}</title>

            <div className="mx-auto max-w-2xl">
                {/* Header */}
                <h1 className="font-display text-[3rem] leading-[0.95] font-medium tracking-[-0.03em] sm:text-7xl">
                    {t("privacy.title")}
                </h1>
                <p className="eyebrow mt-5 mb-10">
                    {t("privacy.last_updated")}
                </p>

                <p className="mb-12 border-b border-line pb-12 text-lg leading-relaxed text-ink-soft">
                    {t("privacy.intro")}
                </p>

                {/* What We Store */}
                <section className="mb-12">
                    <h2 className="mb-4 font-display text-2xl sm:text-3xl">
                        {t("privacy.what_we_store_title")}
                    </h2>
                    <p className="mb-4 text-[16px] leading-[1.75] text-ink-soft">
                        {t("privacy.what_we_store_intro")}
                    </p>
                    <ul className="space-y-3 pl-1">
                        <li className="flex gap-3 text-[16px] leading-[1.75] text-ink-soft">
                            <span className="mt-[0.7rem] h-1.5 w-1.5 shrink-0 rounded-full bg-primary-deep" />
                            <div>
                                <span className="font-medium text-ink">
                                    {t("privacy.storage_cart_title")}
                                </span>
                                {" \u2014 "}
                                {t("privacy.storage_cart_desc")}
                            </div>
                        </li>
                        <li className="flex gap-3 text-[16px] leading-[1.75] text-ink-soft">
                            <span className="mt-[0.7rem] h-1.5 w-1.5 shrink-0 rounded-full bg-primary-deep" />
                            <div>
                                <span className="font-medium text-ink">
                                    {t("privacy.storage_lang_title")}
                                </span>
                                {" \u2014 "}
                                {t("privacy.storage_lang_desc")}
                            </div>
                        </li>
                    </ul>
                </section>

                {/* Why We Store */}
                <section className="mb-12">
                    <h2 className="mb-4 font-display text-2xl sm:text-3xl">
                        {t("privacy.why_title")}
                    </h2>
                    <p className="text-[16px] leading-[1.75] text-ink-soft">
                        {t("privacy.why_desc")}
                    </p>
                </section>

                {/* Payments */}
                <section className="mb-12">
                    <h2 className="mb-4 font-display text-2xl sm:text-3xl">
                        {t("privacy.payments_title")}
                    </h2>
                    <p className="text-[16px] leading-[1.75] text-ink-soft">
                        {t("privacy.payments_desc")}{" "}
                        <a
                            href="https://stripe.com/privacy"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-ink underline decoration-primary-deep underline-offset-4 transition-colors duration-300 hover:decoration-ink"
                        >
                            {t("privacy.stripe_privacy_link")}
                        </a>
                        .
                    </p>
                </section>

                {/* Personal Data */}
                <section className="mb-12">
                    <h2 className="mb-4 font-display text-2xl sm:text-3xl">
                        {t("privacy.personal_data_title")}
                    </h2>
                    <p className="text-[16px] leading-[1.75] text-ink-soft">
                        {t("privacy.personal_data_desc")}
                    </p>
                </section>

                {/* Your Rights */}
                <section className="mb-12">
                    <h2 className="mb-4 font-display text-2xl sm:text-3xl">
                        {t("privacy.your_rights_title")}
                    </h2>
                    <p className="text-[16px] leading-[1.75] text-ink-soft">
                        {t("privacy.your_rights_desc")}
                    </p>
                </section>

                {/* Contact */}
                <section className="mb-12">
                    <h2 className="mb-4 font-display text-2xl sm:text-3xl">
                        {t("privacy.contact_title")}
                    </h2>
                    <p className="mb-4 text-[16px] leading-[1.75] text-ink-soft">
                        {t("privacy.contact_desc")}
                    </p>
                    <address className="price space-y-1 text-[16px] leading-relaxed text-ink not-italic">
                        <p>{t("privacy.controller_name")}</p>
                        <p>{t("privacy.controller_address")}</p>
                        <p>{t("privacy.controller_phone")}</p>
                        <p>{t("privacy.controller_email")}</p>
                    </address>
                </section>

                {/* Future note */}
                <div className="rounded-2xl bg-blush-deep px-6 py-5">
                    <p className="text-sm leading-relaxed text-ink-soft">
                        {t("privacy.future_note")}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPage;
