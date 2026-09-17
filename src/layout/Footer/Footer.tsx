import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { navLinks, SOCIAL_LINKS } from "../navigation";
import { InstagramIcon, TikTokIcon } from "../../components/Icons/Icons";

const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer className="mt-24 bg-blush-deep md:mt-36">
            <div className="container-luxe pt-16 pb-10 md:pt-24">
                <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-12">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-5">
                        <Link
                            to="/"
                            className="font-display text-[2.75rem] leading-[0.95] font-medium tracking-[-0.02em] sm:text-6xl"
                        >
                            Mimmi
                            <br />
                            Flowers
                        </Link>
                        <p className="mt-6 max-w-xs text-[15px] leading-relaxed text-ink-soft">
                            {t("footer.tagline")}
                        </p>
                        <div className="mt-7 flex items-center gap-3">
                            <a
                                href={SOCIAL_LINKS.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                                className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-ink transition-colors duration-300 hover:bg-primary-deep"
                            >
                                <InstagramIcon className="h-[1.35rem] w-[1.35rem]" />
                            </a>
                            <a
                                href={SOCIAL_LINKS.tiktok}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="TikTok"
                                className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-ink transition-colors duration-300 hover:bg-primary-deep"
                            >
                                <TikTokIcon className="h-[1.2rem] w-[1.2rem]" />
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    <nav
                        aria-label={t("footer.quick_links")}
                        className="md:col-span-3 md:col-start-7"
                    >
                        <h2 className="eyebrow">{t("footer.quick_links")}</h2>
                        <ul className="mt-5 space-y-1">
                            {navLinks.map((link) => (
                                <li key={link.to}>
                                    <Link
                                        to={link.to}
                                        className="inline-flex min-h-9 items-center text-[15px] text-ink-soft transition-colors duration-300 hover:text-ink"
                                    >
                                        {t(link.key)}
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <Link
                                    to="/Privacy"
                                    className="inline-flex min-h-9 items-center text-[15px] text-ink-soft transition-colors duration-300 hover:text-ink"
                                >
                                    {t("footer.privacy_policy")}
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    {/* Contact */}
                    <div className="md:col-span-3">
                        <h2 className="eyebrow">{t("footer.contact_title")}</h2>
                        <address className="mt-5 space-y-1 text-[15px] leading-relaxed text-ink-soft not-italic">
                            <p className="min-h-9 py-1.5">
                                {t("contact.address_value")}
                            </p>
                            <a
                                href={`mailto:${t("contact.email_value")}`}
                                className="block min-h-9 py-1.5 break-all transition-colors duration-300 hover:text-ink"
                            >
                                {t("contact.email_value")}
                            </a>
                            <a
                                href={t("contact.phone_href")}
                                className="price block min-h-9 py-1.5 transition-colors duration-300 hover:text-ink"
                            >
                                {t("contact.phone_value")}
                            </a>
                            <p className="py-1.5 text-muted">
                                {t("contact.hours_value")}
                            </p>
                        </address>
                    </div>
                </div>

                <div className="mt-16 flex flex-col gap-2 border-t border-line-strong pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
                    <p>
                        &copy; {new Date().getFullYear()} Mimmi Flowers.{" "}
                        {t("footer.rights")}
                    </p>
                    <p className="tracking-[0.12em] uppercase">
                        {t("contact.address_value")}
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
