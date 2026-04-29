import BasketShopping3 from "../../icons/basketIcon";
import { useTranslation } from "react-i18next";
import BurgerMenu from "../../components/BurgerMenu/BurgerMenu";
import { useCart } from "../../contexts/CartContext";
import { useState, useEffect } from "react";
import { Link } from "react-router";
import { CartDropdown } from "../../components/CartDropdown/CartDropdown";

const LeafSprig = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
        <path d="M12 22 V8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        <path d="M12 12 C 8 10, 6 6, 6 4 C 9 5, 11 7, 12 12 Z" fill="currentColor" opacity="0.85" />
        <path d="M12 16 C 16 14, 18 11, 18 9 C 15 10, 13 12, 12 16 Z" fill="currentColor" opacity="0.6" />
    </svg>
);

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

    return (
        <header
            className={`fixed z-[50] flex h-16 w-full items-center justify-between px-5 transition-all duration-500 sm:h-20 sm:px-10 ${
                scrolled
                    ? "bg-[var(--color-bg)]/90 backdrop-blur-xl"
                    : "bg-transparent"
            }`}
        >
            <div
                className={`absolute bottom-0 left-0 h-px w-full leaf-rule transition-opacity duration-500 ${
                    scrolled ? "opacity-100" : "opacity-0"
                }`}
            />

            <BurgerMenu />

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Link to="/" className="group flex flex-col items-center text-[var(--color-ink)]">
                    <LeafSprig className="mb-1 h-5 w-5 text-[var(--color-leaf)] transition-transform duration-500 group-hover:rotate-3 sm:h-6 sm:w-6" />
                    <span className="font-display text-[1.05rem] tracking-[0.32em] uppercase sm:text-[1.2rem] md:text-[1.35rem] transition-opacity duration-300 group-hover:opacity-70">
                        Mimmi Flowers
                    </span>
                </Link>
            </div>

            <div className="flex items-center gap-4 sm:gap-6">
                <div className="hidden items-center gap-3 text-[0.7rem] tracking-[0.28em] uppercase md:flex">
                    <button
                        className={`cursor-pointer transition-colors duration-300 ${
                            i18n.language === "en"
                                ? "text-[var(--color-ink)]"
                                : "text-[var(--color-muted)] hover:text-[var(--color-leaf-deep)]"
                        }`}
                        onClick={() => i18n.changeLanguage("en")}
                    >EN</button>
                    <span className="h-3 w-px bg-[var(--color-line)]" />
                    <button
                        className={`cursor-pointer transition-colors duration-300 ${
                            i18n.language === "sv"
                                ? "text-[var(--color-ink)]"
                                : "text-[var(--color-muted)] hover:text-[var(--color-leaf-deep)]"
                        }`}
                        onClick={() => i18n.changeLanguage("sv")}
                    >SV</button>
                </div>

                <div className="relative flex items-center justify-center">
                    <button
                        className="cursor-pointer text-[var(--color-ink)] transition-opacity duration-300 hover:opacity-70"
                        onClick={() => setShowCart((p) => !p)}
                        aria-label={`Shopping cart, ${count} items`}
                        aria-expanded={showCart}
                    >
                        <BasketShopping3 className="h-5 w-5 sm:h-6 sm:w-6" />
                    </button>
                    {count > 0 && (
                        <span className="pointer-events-none absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-leaf-deep)] px-1 text-[10px] font-medium text-[var(--color-cream)]">
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
