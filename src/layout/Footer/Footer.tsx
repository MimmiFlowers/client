import { Link } from "react-router";
import { useTranslation } from "react-i18next";

const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer className="mt-24 w-full bg-[var(--color-bg)] text-[var(--color-fg)]">
            <div className="hairline" />

            {/* Massive house wordmark */}
            <div className="px-5 sm:px-8 lg:px-12 pt-16 pb-10">
                <h2 className="font-display text-[var(--color-obsidian)] leading-[0.9] text-[clamp(3rem,12vw,11rem)] tracking-tight">
                    Mimmi&nbsp;Flowers
                </h2>
            </div>

            <div className="hairline" />

            <div className="px-5 sm:px-8 lg:px-12 py-12">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
                    {/* Brand */}
                    <div className="md:col-span-5">
                        <span className="eyebrow-muted">— Maison</span>
                        <p className="mt-4 max-w-md text-[var(--color-fg-soft)] text-base leading-relaxed">
                            {t("footer.tagline")}
                        </p>

                        <div className="mt-8 flex items-center gap-5">
                            <a
                                href="https://instagram.com/mimmi_flowers?igshid=MzMyNGUyNmU2YQ=="
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                                className="eyebrow couture-link text-[var(--color-fg)]"
                            >
                                Instagram
                            </a>
                            <a
                                href="https://www.tiktok.com/@mimmi_flowers"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="TikTok"
                                className="eyebrow couture-link text-[var(--color-fg)]"
                            >
                                TikTok
                            </a>
                        </div>
                    </div>

                    {/* Quick links */}
                    <div className="md:col-span-3">
                        <h4 className="eyebrow-muted">
                            {t("footer.quick_links")}
                        </h4>
                        <nav className="mt-5 flex flex-col gap-3">
                            <Link to="/Catalog" className="font-display text-2xl text-[var(--color-obsidian)] transition-opacity duration-300 hover:opacity-50">
                                {t("menu.catalog")}
                            </Link>
                            <Link to="/About" className="font-display text-2xl text-[var(--color-obsidian)] transition-opacity duration-300 hover:opacity-50">
                                {t("menu.about")}
                            </Link>
                            <Link to="/Contact" className="font-display text-2xl text-[var(--color-obsidian)] transition-opacity duration-300 hover:opacity-50">
                                {t("menu.contact")}
                            </Link>
                        </nav>
                    </div>

                    {/* Contact */}
                    <div className="md:col-span-4">
                        <h4 className="eyebrow-muted">
                            {t("footer.contact_title")}
                        </h4>
                        <div className="mt-5 flex flex-col gap-2.5 text-[var(--color-fg-soft)]">
                            <p className="text-sm">{t("contact.address_value")}</p>
                            <a
                                href={`mailto:${t("contact.email_value")}`}
                                className="text-sm couture-link self-start"
                            >
                                {t("contact.email_value")}
                            </a>
                            <a
                                href={t("contact.phone_href")}
                                className="text-sm couture-link self-start"
                            >
                                {t("contact.phone_value")}
                            </a>
                            <p className="text-sm">{t("contact.hours_value")}</p>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-14 pt-6 border-t border-[var(--color-line)] flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="eyebrow-muted">
                        &copy;&nbsp;{new Date().getFullYear()} · Mimmi Flowers · {t("footer.rights")}
                    </p>
                    <Link to="/Privacy" className="eyebrow couture-link text-[var(--color-fg)]">
                        {t("footer.privacy_policy")}
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
