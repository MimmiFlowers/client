import BasketShopping3 from "../../icons/basketIcon";
import { useTranslation } from "react-i18next";
import BurgerMenu from "../../components/BurgerMenu/BurgerMenu";
import { useCart } from "../../contexts/CartContext";
import { useState, useEffect } from "react";
import { Link } from "react-router";
import { CartDropdown } from "../../components/CartDropdown/CartDropdown";

const Header = () => {
    const { i18n } = useTranslation();
    const { count } = useCart();
    const [showCart, setShowCart] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12);
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const changeLanguage = (lng: string) => i18n.changeLanguage(lng);

    return (
        <header
            className={`fixed z-[50] flex h-16 w-full items-center justify-between px-5 transition-all duration-500 sm:h-20 sm:px-10 ${
                scrolled
                    ? "bg-[var(--color-bg)]/85 backdrop-blur-xl"
                    : "bg-transparent"
            }`}
        >
            {/* Hairline rule under header */}
            <div
                className={`absolute bottom-0 left-0 h-px w-full bg-[var(--color-line)] transition-opacity duration-500 ${
                    scrolled ? "opacity-100" : "opacity-0"
                }`}
            />

            <BurgerMenu />

            {/* Logo — centered, oversized serif */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Link
                    to="/"
                    className="group flex flex-col items-center text-[var(--color-ink)]"
                >
                    <span className="font-display text-[1.05rem] tracking-[0.42em] uppercase sm:text-[1.25rem] md:text-[1.4rem] transition-opacity duration-300 group-hover:opacity-60">
                        Mimmi
                    </span>
                    <span className="mt-0.5 flex items-center gap-2 text-[0.55rem] tracking-[0.5em] uppercase text-[var(--color-accent)] sm:text-[0.65rem]">
                        <span className="h-px w-3 bg-[var(--color-accent)]" />
                        Flowers
                        <span className="h-px w-3 bg-[var(--color-accent)]" />
                    </span>
                </Link>
            </div>

            {/* Right cluster */}
            <div className="flex items-center gap-4 sm:gap-6">
                {/* Language switcher — desktop */}
                <div className="hidden items-center gap-3 text-[0.7rem] tracking-[0.3em] uppercase md:flex">
                    <button
                        className={`cursor-pointer transition-colors duration-300 ${
                            i18n.language === "en"
                                ? "text-[var(--color-ink)]"
                                : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                        }`}
                        onClick={() => changeLanguage("en")}
                        aria-pressed={i18n.language === "en"}
                    >
                        EN
                    </button>
                    <span className="h-3 w-px bg-[var(--color-line)]" />
                    <button
                        className={`cursor-pointer transition-colors duration-300 ${
                            i18n.language === "sv"
                                ? "text-[var(--color-ink)]"
                                : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                        }`}
                        onClick={() => changeLanguage("sv")}
                        aria-pressed={i18n.language === "sv"}
                    >
                        SV
                    </button>
                </div>

                {/* Cart */}
                <div className="relative flex items-center justify-center">
                    <button
                        className="cursor-pointer text-[var(--color-ink)] transition-opacity duration-300 hover:opacity-60"
                        onClick={() => setShowCart((p) => !p)}
                        aria-label={`Shopping cart, ${count} items`}
                        aria-expanded={showCart}
                    >
                        <BasketShopping3 className="h-5 w-5 sm:h-6 sm:w-6" />
                    </button>
                    {count > 0 && (
                        <span className="pointer-events-none absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-accent)] px-1 text-[10px] font-medium text-[var(--color-cream)]">
                            {count}
                        </span>
                    )}
                    {showCart && (
                        <CartDropdown onClose={() => setShowCart(false)} />
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
