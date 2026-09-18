import { Link } from "react-router";
import { useTranslation } from "react-i18next";

const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer className="mt-24 w-full bg-[var(--color-primary-deep)] text-[var(--color-bg)]">
            {/* Top brass rule */}
            <div className="gold-rule" />

            <div className="mx-auto w-[95%] py-16 sm:w-[90%] md:w-[80%]">
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3">
                    {/* Brand column */}
                    <div className="flex flex-col items-center sm:items-start">
                        <Link
                            to="/"
                            className="font-[var(--font-display)] text-2xl tracking-[0.08em] text-[var(--color-bg)] uppercase"
                        >
                            Mimmi Flowers
                        </Link>
                        <p className="eyebrow mt-2 !text-[var(--color-gold-soft)]">
                            Stockholm Atelier
                        </p>
                        <p className="mt-4 max-w-xs text-center text-sm leading-relaxed font-light text-[var(--color-bg)]/70 sm:text-left">
                            {t("footer.tagline")}
                        </p>

                        {/* Social icons */}
                        <div className="mt-6 flex items-center gap-4">
                            <a
                                href="https://instagram.com/mimmi_flowers?igshid=MzMyNGUyNmU2YQ=="
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                                className="text-[var(--color-bg)]/55 transition-colors duration-300 hover:text-[var(--color-gold-soft)]"
                            >
                                <svg
                                    className="h-4.5 w-4.5"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </a>
                            <a
                                href="https://www.tiktok.com/@mimmi_flowers"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="TikTok"
                                className="text-[var(--color-bg)]/55 transition-colors duration-300 hover:text-[var(--color-gold-soft)]"
                            >
                                <svg
                                    className="h-4.5 w-4.5"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.75a8.18 8.18 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.18z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick links column */}
                    <div className="flex flex-col items-center sm:items-start">
                        <h4 className="eyebrow !text-[var(--color-gold-soft)]">
                            {t("footer.quick_links")}
                        </h4>
                        <nav className="mt-5 flex flex-col items-center gap-3 sm:items-start">
                            <Link
                                to="/Catalog"
                                className="text-sm font-light text-[var(--color-bg)]/75 transition-colors duration-300 hover:text-[var(--color-bg)]"
                            >
                                {t("menu.catalog")}
                            </Link>
                            <Link
                                to="/About"
                                className="text-sm font-light text-[var(--color-bg)]/75 transition-colors duration-300 hover:text-[var(--color-bg)]"
                            >
                                {t("menu.about")}
                            </Link>
                            <Link
                                to="/Contact"
                                className="text-sm font-light text-[var(--color-bg)]/75 transition-colors duration-300 hover:text-[var(--color-bg)]"
                            >
                                {t("menu.contact")}
                            </Link>
                        </nav>
                    </div>

                    {/* Contact column */}
                    <div className="flex flex-col items-center sm:items-start">
                        <h4 className="eyebrow !text-[var(--color-gold-soft)]">
                            {t("footer.contact_title")}
                        </h4>
                        <div className="mt-5 flex flex-col gap-2.5 text-center sm:text-left">
                            <p className="text-sm font-light text-[var(--color-bg)]/75">
                                {t("contact.address_value")}
                            </p>
                            <a
                                href={`mailto:${t("contact.email_value")}`}
                                className="text-sm font-light text-[var(--color-bg)]/75 transition-colors duration-300 hover:text-[var(--color-bg)]"
                            >
                                {t("contact.email_value")}
                            </a>
                            <a
                                href={t("contact.phone_href")}
                                className="text-sm font-light text-[var(--color-bg)]/75 transition-colors duration-300 hover:text-[var(--color-bg)]"
                            >
                                {t("contact.phone_value")}
                            </a>
                            <p className="text-sm font-light text-[var(--color-bg)]/75">
                                {t("contact.hours_value")}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-12 border-t border-[var(--color-bg)]/15 pt-6">
                    <p className="text-center text-xs font-light tracking-wider text-[var(--color-bg)]/55">
                        &copy; {new Date().getFullYear()} Mimmi Flowers.{" "}
                        {t("footer.rights")}
                        <span className="mx-2">&middot;</span>
                        <Link
                            to="/Privacy"
                            className="text-[var(--color-bg)]/55 underline underline-offset-2 transition-colors duration-300 hover:text-[var(--color-gold-soft)]"
                        >
                            {t("footer.privacy_policy")}
                        </Link>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
