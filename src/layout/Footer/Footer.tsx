import { Link } from "react-router";
import { useTranslation } from "react-i18next";

const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer className="mt-32 w-full bg-[var(--color-leaf-deep)] text-[var(--color-cream)]">
            {/* Top wavy edge */}
            <svg viewBox="0 0 1200 40" preserveAspectRatio="none" className="block h-8 w-full text-[var(--color-leaf-deep)]" aria-hidden="true">
                <path d="M0 40 C 200 0, 400 40, 600 20 C 800 0, 1000 40, 1200 20 L 1200 40 Z" fill="currentColor" />
            </svg>

            <div className="mx-auto w-[92%] py-16 md:w-[88%] md:py-24">
                {/* Newsletter / signature top */}
                <div className="grid gap-10 md:grid-cols-12 md:gap-12">
                    <div className="md:col-span-6">
                        <p className="text-[0.7rem] tracking-[0.34em] uppercase text-[var(--color-blush)]">
                            From our atelier
                        </p>
                        <h3 className="mt-4 font-display text-4xl italic leading-[1.0] sm:text-5xl md:text-6xl">
                            Stay in the <span className="text-[var(--color-blush)]">garden</span>.
                        </h3>
                        <p className="mt-5 max-w-md leading-relaxed text-[var(--color-cream)]/75">
                            {t("footer.tagline")}
                        </p>
                    </div>

                    <div className="md:col-span-3 md:col-start-8">
                        <p className="text-[0.65rem] tracking-[0.32em] uppercase text-[var(--color-cream)]/55">
                            {t("footer.quick_links")}
                        </p>
                        <nav className="mt-5 flex flex-col gap-3">
                            <Link to="/Catalog" className="text-base italic text-[var(--color-cream)]/85 transition-colors duration-300 hover:text-[var(--color-blush)]">
                                {t("menu.catalog")}
                            </Link>
                            <Link to="/About" className="text-base italic text-[var(--color-cream)]/85 transition-colors duration-300 hover:text-[var(--color-blush)]">
                                {t("menu.about")}
                            </Link>
                            <Link to="/Contact" className="text-base italic text-[var(--color-cream)]/85 transition-colors duration-300 hover:text-[var(--color-blush)]">
                                {t("menu.contact")}
                            </Link>
                        </nav>
                    </div>

                    <div className="md:col-span-3 md:col-start-11">
                        <p className="text-[0.65rem] tracking-[0.32em] uppercase text-[var(--color-cream)]/55">
                            {t("footer.contact_title")}
                        </p>
                        <div className="mt-5 flex flex-col gap-2 text-sm text-[var(--color-cream)]/85">
                            <p>{t("contact.address_value")}</p>
                            <a href={`mailto:${t("contact.email_value")}`} className="transition-colors duration-300 hover:text-[var(--color-blush)]">
                                {t("contact.email_value")}
                            </a>
                            <a href={t("contact.phone_href")} className="transition-colors duration-300 hover:text-[var(--color-blush)]">
                                {t("contact.phone_value")}
                            </a>
                            <p className="text-[var(--color-cream)]/55">{t("contact.hours_value")}</p>
                        </div>
                    </div>
                </div>

                {/* Social */}
                <div className="mt-16 flex items-center justify-between border-t border-[var(--color-cream)]/15 pt-8">
                    <div className="flex items-center gap-5">
                        <a href="https://instagram.com/mimmi_flowers?igshid=MzMyNGUyNmU2YQ==" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                           className="text-[var(--color-cream)]/70 transition-colors duration-300 hover:text-[var(--color-blush)]">
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                        </a>
                        <a href="https://www.tiktok.com/@mimmi_flowers" target="_blank" rel="noopener noreferrer" aria-label="TikTok"
                           className="text-[var(--color-cream)]/70 transition-colors duration-300 hover:text-[var(--color-blush)]">
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.75a8.18 8.18 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.18z" />
                            </svg>
                        </a>
                    </div>
                    <p className="font-display text-base italic text-[var(--color-cream)]/65">— with care, from Stockholm</p>
                </div>

                {/* Bottom bar */}
                <div className="mt-8 flex flex-col items-center justify-between gap-3 text-[0.7rem] tracking-[0.18em] uppercase text-[var(--color-cream)]/45 sm:flex-row">
                    <p>© {new Date().getFullYear()} Mimmi Flowers · {t("footer.rights")}</p>
                    <Link to="/Privacy" className="transition-colors duration-300 hover:text-[var(--color-blush)]">
                        {t("footer.privacy_policy")}
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
