import BasketShopping3 from "../../icons/basketIcon";
import { useTranslation } from "react-i18next";
import BurgerMenu from "../../components/BurgerMenu/BurgerMenu";
import { useCart } from "../../contexts/CartContext";
import { useState } from "react";
import { Link } from "react-router";
import { CartDropdown } from "../../components/CartDropdown/CartDropdown";

const Header = () => {
    const { i18n } = useTranslation();
    const { count } = useCart();
    const [showCart, setShowCart] = useState(false);

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    return (
        <header className="fixed z-[50] w-full bg-[var(--color-bg)]/92 backdrop-blur-md">
            <div className="flex h-16 sm:h-20 w-full items-center justify-between px-5 sm:px-8 lg:px-12">
                <BurgerMenu />

                {/* Logo — soirée wordmark with ornaments */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-3">
                    <span className="ornament hidden sm:inline text-xs flicker">✦</span>
                    <Link
                        to="/"
                        className="font-display italic text-[var(--color-burgundy)] text-base sm:text-xl md:text-2xl tracking-wide transition-opacity duration-500 hover:opacity-70"
                    >
                        Mimmi&nbsp;Flowers
                    </Link>
                    <span className="ornament hidden sm:inline text-xs flicker">✦</span>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-4 sm:gap-5">
                    <div className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-[var(--color-gold)]/40 bg-[var(--color-cream)]/60">
                        <button
                            className={`eyebrow cursor-pointer transition-all duration-300 ${
                                i18n.language === "en"
                                    ? "text-[var(--color-burgundy)]"
                                    : "text-[var(--color-muted)] hover:text-[var(--color-gold-deep)]"
                            }`}
                            onClick={() => changeLanguage("en")}
                            aria-pressed={i18n.language === "en"}
                        >
                            EN
                        </button>
                        <span className="text-[var(--color-gold)]">·</span>
                        <button
                            className={`eyebrow cursor-pointer transition-all duration-300 ${
                                i18n.language === "sv"
                                    ? "text-[var(--color-burgundy)]"
                                    : "text-[var(--color-muted)] hover:text-[var(--color-gold-deep)]"
                            }`}
                            onClick={() => changeLanguage("sv")}
                            aria-pressed={i18n.language === "sv"}
                        >
                            SV
                        </button>
                    </div>

                    <div className="relative flex items-center justify-center">
                        <button
                            className="cursor-pointer transition-all duration-300 hover:opacity-70 hover:rotate-[3deg]"
                            onClick={() => setShowCart((prev) => !prev)}
                            aria-label={`Shopping cart, ${count} items`}
                            aria-expanded={showCart}
                        >
                            <BasketShopping3 className="h-6 w-6 text-[var(--color-burgundy)] sm:h-7 sm:w-7" />
                        </button>
                        {count > 0 && (
                            <span className="absolute -top-2 -right-2.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[var(--color-burgundy)] text-[10px] font-medium text-[var(--color-bg)] shadow-[0_0_0_1px_var(--color-gold)]">
                                {count}
                            </span>
                        )}
                        {showCart && (
                            <CartDropdown onClose={() => setShowCart(false)} />
                        )}
                    </div>
                </div>
            </div>
            <div className="gold-rule" />
        </header>
    );
};

export default Header;
