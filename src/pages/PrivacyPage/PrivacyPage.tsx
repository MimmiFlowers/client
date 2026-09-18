import { useTranslation } from "react-i18next";

const PrivacyPage = () => {
    const { t } = useTranslation();

    return (
        <div className="px-4 py-12">
            <title>{t("seo.privacy_title")}</title>

            <div className="mx-auto w-[95%] max-w-3xl sm:w-[90%] md:w-[70%] lg:w-[60%]">
                {/* Header */}
                <h1 className="mb-2 font-[var(--font-display)] text-4xl tracking-[0.01em] text-[var(--color-ink)] sm:text-5xl">
                    {t("privacy.title")}
                </h1>
                <p className="mb-10 eyebrow-muted">
                    {t("privacy.last_updated")}
                </p>

                <p className="mb-10 text-sm leading-relaxed text-[var(--color-fg-mid)]">
                    {t("privacy.intro")}
                </p>

                {/* What We Store */}
                <section className="mb-10">
                    <h2 className="mb-4 font-[var(--font-display)] text-xl text-[var(--color-ink)]">
                        {t("privacy.what_we_store_title")}
                    </h2>
                    <p className="mb-4 text-sm leading-relaxed text-[var(--color-fg-mid)]">
                        {t("privacy.what_we_store_intro")}
                    </p>
                    <ul className="space-y-3 pl-1">
                        <li className="flex gap-3 text-sm leading-relaxed text-[var(--color-fg-mid)]">
                            <span className="mt-0.5 text-[var(--color-gold)]">
                                &#9679;
                            </span>
                            <div>
                                <span className="font-medium text-[var(--color-ink)]">
                                    {t("privacy.storage_cart_title")}
                                </span>
                                {" \u2014 "}
                                {t("privacy.storage_cart_desc")}
                            </div>
                        </li>
                        <li className="flex gap-3 text-sm leading-relaxed text-[var(--color-fg-mid)]">
                            <span className="mt-0.5 text-[var(--color-gold)]">
                                &#9679;
                            </span>
                            <div>
                                <span className="font-medium text-[var(--color-ink)]">
                                    {t("privacy.storage_lang_title")}
                                </span>
                                {" \u2014 "}
                                {t("privacy.storage_lang_desc")}
                            </div>
                        </li>
                    </ul>
                </section>

                {/* Why We Store */}
                <section className="mb-10">
                    <h2 className="mb-4 font-[var(--font-display)] text-xl text-[var(--color-ink)]">
                        {t("privacy.why_title")}
                    </h2>
                    <p className="text-sm leading-relaxed text-[var(--color-fg-mid)]">
                        {t("privacy.why_desc")}
                    </p>
                </section>

                {/* Payments */}
                <section className="mb-10">
                    <h2 className="mb-4 font-[var(--font-display)] text-xl text-[var(--color-ink)]">
                        {t("privacy.payments_title")}
                    </h2>
                    <p className="text-sm leading-relaxed text-[var(--color-fg-mid)]">
                        {t("privacy.payments_desc")}{" "}
                        <a
                            href="https://stripe.com/privacy"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[var(--color-primary)] underline underline-offset-2 transition-colors duration-300 hover:text-[var(--color-gold-deep)]"
                        >
                            {t("privacy.stripe_privacy_link")}
                        </a>
                        .
                    </p>
                </section>

                {/* Personal Data */}
                <section className="mb-10">
                    <h2 className="mb-4 font-[var(--font-display)] text-xl text-[var(--color-ink)]">
                        {t("privacy.personal_data_title")}
                    </h2>
                    <p className="text-sm leading-relaxed text-[var(--color-fg-mid)]">
                        {t("privacy.personal_data_desc")}
                    </p>
                </section>

                {/* Your Rights */}
                <section className="mb-10">
                    <h2 className="mb-4 font-[var(--font-display)] text-xl text-[var(--color-ink)]">
                        {t("privacy.your_rights_title")}
                    </h2>
                    <p className="text-sm leading-relaxed text-[var(--color-fg-mid)]">
                        {t("privacy.your_rights_desc")}
                    </p>
                </section>

                {/* Contact */}
                <section className="mb-10">
                    <h2 className="mb-4 font-[var(--font-display)] text-xl text-[var(--color-ink)]">
                        {t("privacy.contact_title")}
                    </h2>
                    <p className="mb-4 text-sm leading-relaxed text-[var(--color-fg-mid)]">
                        {t("privacy.contact_desc")}
                    </p>
                    <address className="space-y-1 text-sm leading-relaxed text-[var(--color-fg-mid)] not-italic">
                        <p>{t("privacy.controller_name")}</p>
                        <p>{t("privacy.controller_address")}</p>
                        <p>{t("privacy.controller_phone")}</p>
                        <p>{t("privacy.controller_email")}</p>
                    </address>
                </section>

                {/* Future note */}
                <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)]/80 px-6 py-5 backdrop-blur-sm">
                    <p className="text-xs leading-relaxed text-[var(--color-muted)]">
                        {t("privacy.future_note")}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPage;
