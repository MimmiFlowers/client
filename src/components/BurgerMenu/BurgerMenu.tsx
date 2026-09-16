import { useState } from "react";
import { createPortal } from "react-dom";
import { Link, NavLink } from "react-router";
import { useTranslation } from "react-i18next";
import { useOverlay } from "../../hooks/useOverlay";
import { navLinks, SOCIAL_LINKS } from "../../layout/navigation";
import LanguageSwitch from "../LanguageSwitch/LanguageSwitch";
import {
    ArrowRightIcon,
    CloseIcon,
    InstagramIcon,
    MenuIcon,
    TikTokIcon,
} from "../Icons/Icons";

/** Full-screen navigation for phones and tablets. Hidden from lg: upwards. */
const BurgerMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useTranslation();
    const close = () => setIsOpen(false);
    const panelRef = useOverlay<HTMLDivElement>(
        isOpen,
        close,
        "(min-width: 1024px)",
    );

    const links = [{ to: "/", key: "breadcrumbs.home" }, ...navLinks];

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="-ml-2.5 flex h-11 w-11 cursor-pointer items-center justify-center text-ink lg:hidden"
                aria-label={t("menu.open")}
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
            >
                <MenuIcon className="h-6 w-6" />
            </button>

            {createPortal(
                <div
                    id="mobile-menu"
                    ref={panelRef}
                    role="dialog"
                    aria-modal="true"
                    aria-label={t("menu.title")}
                    inert={!isOpen}
                    className={`fixed inset-0 z-50 flex flex-col bg-blush transition-[opacity,visibility] duration-500 ease-luxe lg:hidden ${
                        isOpen ? "visible opacity-100" : "invisible opacity-0"
                    }`}
                >
                    <div className="container-luxe flex h-16 shrink-0 items-center justify-between border-b border-line">
                        <Link
                            to="/"
                            onClick={close}
                            className="font-display text-[1.45rem] leading-none font-medium text-ink"
                        >
                            Mimmi Flowers
                        </Link>
                        <button
                            type="button"
                            onClick={close}
                            className="-mr-2.5 flex h-11 w-11 cursor-pointer items-center justify-center text-ink"
                            aria-label={t("menu.close")}
                        >
                            <CloseIcon className="h-6 w-6" />
                        </button>
                    </div>

                    <nav
                        aria-label={t("nav.main")}
                        className="container-luxe flex flex-1 flex-col justify-center gap-1 overflow-y-auto py-10"
                    >
                        {links.map((link, i) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end={link.to === "/"}
                                onClick={close}
                                style={{
                                    transitionDelay: isOpen
                                        ? `${120 + i * 70}ms`
                                        : "0ms",
                                }}
                                className={({ isActive }) =>
                                    `group flex items-baseline justify-between border-b border-line py-5 transition-[opacity,transform] duration-700 ease-luxe ${
                                        isOpen
                                            ? "translate-y-0 opacity-100"
                                            : "translate-y-6 opacity-0"
                                    } ${isActive ? "text-ink" : "text-ink-soft"}`
                                }
                            >
                                <span className="font-display text-[2.6rem] leading-none font-medium tracking-[-0.02em]">
                                    {t(link.key)}
                                </span>
                                <ArrowRightIcon className="h-5 w-5 -translate-x-2 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:opacity-100" />
                            </NavLink>
                        ))}
                    </nav>

                    <div className="container-luxe shrink-0 space-y-6 border-t border-line py-7 pb-[max(1.75rem,env(safe-area-inset-bottom))]">
                        <div className="flex items-center justify-between">
                            <span className="eyebrow">{t("menu.language")}</span>
                            <LanguageSwitch />
                        </div>
                        <div className="flex items-center justify-between">
                            <a
                                href={`mailto:${t("contact.email_value")}`}
                                className="text-sm text-ink-soft"
                            >
                                {t("contact.email_value")}
                            </a>
                            <div className="flex items-center gap-1">
                                <a
                                    href={SOCIAL_LINKS.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Instagram"
                                    className="flex h-11 w-11 items-center justify-center text-ink-soft transition-colors hover:text-ink"
                                >
                                    <InstagramIcon />
                                </a>
                                <a
                                    href={SOCIAL_LINKS.tiktok}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="TikTok"
                                    className="-mr-3 flex h-11 w-11 items-center justify-center text-ink-soft transition-colors hover:text-ink"
                                >
                                    <TikTokIcon className="h-[1.1rem] w-[1.1rem]" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body,
            )}
        </>
    );
};

export default BurgerMenu;
