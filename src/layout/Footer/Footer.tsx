import { Link } from "react-router";
import { useTranslation } from "react-i18next";

const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer className="mt-24 w-full bg-[var(--color-burgundy-deep)] text-[var(--color-bg)] relative">
            <div className="gold-rule" />

            {/* Massive script wordmark */}
            <div className="px-5 sm:px-8 lg:px-12 pt-16 pb-8 text-center">
                <span className="ornament block text-sm text-[var(--color-gold-light)] mb-4 flicker">
                    ✦ ✦ ✦
                </span>
                <h2 className="font-display italic gold-shimmer leading-[0.95] text-[clamp(2.75rem,10vw,9rem)]">
                    Mimmi&nbsp;Flowers
                </h2>
                <p className="mt-5 max-w-xl mx-auto eyebrow text-[var(--color-gold-light)]">
                    — Maison florale · Stockholm —
                </p>
            </div>

            <div className="mx-5 sm:mx-8 lg:mx-12 gold-rule" />

            <div className="px-5 sm:px-8 lg:px-12 py-14">
                <div className="grid grid-cols-1 gap-12 sm:grid-cols-3 max-w-5xl mx-auto">
                    {/* Brand */}
                    <div className="text-center sm:text-left">
                        <h4 className="eyebrow text-[var(--color-gold-light)]">— Maison</h4>
                        <p className="mt-4 text-[var(--color-bg)]/85 text-sm leading-relaxed font-display italic">
                            {t("footer.tagline")}
                        </p>
                        <div className="mt-6 flex items-center justify-center sm:justify-start gap-5">
                            <a
                                href="https://instagram.com/mimmi_flowers?igshid=MzMyNGUyNmU2YQ=="
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                                className="eyebrow text-[var(--color-gold-light)] hover:text-[var(--color-bg)] transition-colors duration-500"
                            >
                                Instagram
                            </a>
                            <span className="ornament text-[var(--color-gold)]">✦</span>
                            <a
                                href="https://www.tiktok.com/@mimmi_flowers"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="TikTok"
                                className="eyebrow text-[var(--color-gold-light)] hover:text-[var(--color-bg)] transition-colors duration-500"
                            >
                                TikTok
                            </a>
                        </div>
                    </div>

                    {/* Quick links */}
                    <div className="text-center sm:text-left">
                        <h4 className="eyebrow text-[var(--color-gold-light)]">
                            {t("footer.quick_links")}
                        </h4>
                        <nav className="mt-4 flex flex-col gap-2.5">
                            <Link to="/Catalog" className="font-display italic text-lg text-[var(--color-bg)] transition-colors duration-300 hover:text-[var(--color-gold-light)]">
                                {t("menu.catalog")}
                            </Link>
                            <Link to="/About" className="font-display italic text-lg text-[var(--color-bg)] transition-colors duration-300 hover:text-[var(--color-gold-light)]">
                                {t("menu.about")}
                            </Link>
                            <Link to="/Contact" className="font-display italic text-lg text-[var(--color-bg)] transition-colors duration-300 hover:text-[var(--color-gold-light)]">
                                {t("menu.contact")}
                            </Link>
                        </nav>
                    </div>

                    {/* Contact */}
                    <div className="text-center sm:text-left">
                        <h4 className="eyebrow text-[var(--color-gold-light)]">
                            {t("footer.contact_title")}
                        </h4>
                        <div className="mt-4 flex flex-col gap-2 text-[var(--color-bg)]/85 text-sm">
                            <p>{t("contact.address_value")}</p>
                            <a href={`mailto:${t("contact.email_value")}`} className="hover:text-[var(--color-gold-light)] transition-colors duration-300">
                                {t("contact.email_value")}
                            </a>
                            <a href={t("contact.phone_href")} className="hover:text-[var(--color-gold-light)] transition-colors duration-300">
                                {t("contact.phone_value")}
                            </a>
                            <p>{t("contact.hours_value")}</p>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-16 pt-6">
                    <div className="gold-rule mb-6" />
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center">
                        <p className="eyebrow text-[var(--color-gold-light)]/80">
                            &copy;&nbsp;{new Date().getFullYear()} · Mimmi Flowers · {t("footer.rights")}
                        </p>
                        <Link to="/Privacy" className="eyebrow text-[var(--color-gold-light)]/80 hover:text-[var(--color-bg)] transition-colors duration-300">
                            {t("footer.privacy_policy")}
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
