import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

const BurgerMenu: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { t, i18n } = useTranslation();
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const toggleMenu = () => setIsOpen(!isOpen);

    const closeMenu = useCallback(() => {
        setIsOpen(false);
        buttonRef.current?.focus();
    }, []);

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                closeMenu();
            }

            if (e.key === "Tab" && menuRef.current) {
                const focusable = menuRef.current.querySelectorAll<HTMLElement>(
                    'a, button, [tabindex]:not([tabindex="-1"])',
                );
                if (focusable.length === 0) return;

                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                if (!first || !last) return;

                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, closeMenu]);

    const navLinks = [
        { to: "/Catalog", label: t("menu.catalog") },
        { to: "/About", label: t("menu.about") },
        { to: "/Contact", label: t("menu.contact") },
    ];

    return (
        <>
            {/* Invisible spacer — keeps header layout intact when button is portalled */}
            <div className="h-5 w-6" aria-hidden="true" />

            {/* Portal: burger button + backdrop + panel all rendered at document.body */}
            {createPortal(
                <>
                    {/* Burger / X toggle button — always above everything */}
                    <button
                        ref={buttonRef}
                        onClick={toggleMenu}
                        className="fixed top-[18px] left-4 z-[80] flex h-5 w-6 cursor-pointer flex-col justify-between transition-opacity duration-300 hover:opacity-60"
                        aria-label={isOpen ? "Close menu" : "Open menu"}
                        aria-expanded={isOpen}
                        aria-controls="burger-menu-panel"
                    >
                        <span
                            className={`h-[1.5px] w-full rounded-full bg-[var(--color-burgundy)] transition-all duration-300 ${
                                isOpen ? "translate-y-[7.5px] rotate-45" : ""
                            }`}
                        />
                        <span
                            className={`h-[1.5px] w-full rounded-full bg-[var(--color-burgundy)] transition-all duration-300 ${
                                isOpen ? "scale-x-0 opacity-0" : ""
                            }`}
                        />
                        <span
                            className={`h-[1.5px] w-full rounded-full bg-[var(--color-burgundy)] transition-all duration-300 ${
                                isOpen ? "-translate-y-[11px] -rotate-45" : ""
                            }`}
                        />
                    </button>

                    {/* Backdrop overlay */}
                    {isOpen && (
                        <div
                            className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-[2px]"
                            onClick={closeMenu}
                            aria-hidden="true"
                        />
                    )}

                    {/* Slide-out panel — 100vh height */}
                    <div
                        id="burger-menu-panel"
                        ref={menuRef}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Navigation menu"
                        className={`fixed top-0 left-0 z-[70] flex h-screen flex-col bg-[var(--color-bg)] shadow-xl transition-transform duration-300 ease-in-out ${
                            isOpen ? "translate-x-0" : "-translate-x-full"
                        } w-[78vw] sm:w-[55vw] md:w-[28vw] md:min-w-[260px]`}
                    >
                        {/* Nav links — below header clearance */}
                        <nav className="mt-20 flex flex-col px-8">
                            {navLinks.map((link, i) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    onClick={closeMenu}
                                    className={`group flex items-center py-3 text-sm font-light tracking-[0.15em] text-[var(--color-fg-soft)] uppercase transition-colors duration-300 hover:text-[var(--color-burgundy)] ${
                                        i < navLinks.length - 1
                                            ? "border-b border-[var(--color-line)]/60"
                                            : ""
                                    }`}
                                >
                                    <span className="mr-0 w-0 overflow-hidden text-[var(--color-rose)] transition-all duration-300 group-hover:mr-2 group-hover:w-3">
                                        &rsaquo;
                                    </span>
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Language switcher + social links — at bottom */}
                        <div className="mt-auto border-t border-[var(--color-line)]/60 p-6">
                            <div className="md:hidden">
                                <p className="mb-3 text-[10px] font-medium tracking-[0.2em] text-[var(--color-muted)] uppercase">
                                    {t("menu.language")}
                                </p>
                                <div className="flex items-center gap-0.5 rounded-full bg-white/60 p-0.5">
                                    <button
                                        className={`flex-1 cursor-pointer rounded-full py-1.5 text-xs font-medium tracking-wider transition-all duration-300 ${
                                            i18n.language === "en"
                                                ? "bg-white text-[var(--color-burgundy)] shadow-sm"
                                                : "text-[var(--color-muted)] hover:text-[var(--color-fg-soft)]"
                                        }`}
                                        onClick={() => changeLanguage("en")}
                                        aria-pressed={i18n.language === "en"}
                                    >
                                        EN
                                    </button>
                                    <button
                                        className={`flex-1 cursor-pointer rounded-full py-1.5 text-xs font-medium tracking-wider transition-all duration-300 ${
                                            i18n.language === "sv"
                                                ? "bg-white text-[var(--color-burgundy)] shadow-sm"
                                                : "text-[var(--color-muted)] hover:text-[var(--color-fg-soft)]"
                                        }`}
                                        onClick={() => changeLanguage("sv")}
                                        aria-pressed={i18n.language === "sv"}
                                    >
                                        SV
                                    </button>
                                </div>
                            </div>

                            {/* Social links */}
                            <div className="mt-4 flex items-center justify-center gap-5 md:mt-0">
                                <a
                                    href="https://instagram.com/mimmi_flowers?igshid=MzMyNGUyNmU2YQ=="
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Instagram"
                                    className="text-[var(--color-muted)] transition-colors duration-300 hover:text-[var(--color-fg-soft)]"
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
                                    className="text-[var(--color-muted)] transition-colors duration-300 hover:text-[var(--color-fg-soft)]"
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
                    </div>
                </>,
                document.body,
            )}
        </>
    );
};

export default BurgerMenu;
