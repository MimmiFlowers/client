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
        <header className="fixed z-[50] w-full bg-[var(--color-bg)]/95 backdrop-blur-md">
            <div className="flex h-16 sm:h-20 w-full items-center justify-between px-5 sm:px-8 lg:px-12">
                <div className="flex items-center gap-3">
                    <BurgerMenu />
                </div>

                {/* Logo — centered, gallery wordmark */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <Link
                        to="/"
                        className="font-display text-[var(--color-obsidian)] uppercase tracking-[0.42em] text-base sm:text-lg md:text-xl transition-opacity duration-500 hover:opacity-50"
                    >
                        Mimmi&nbsp;Flowers
                    </Link>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-4 sm:gap-6">
                    {/* Language switcher — minimal text only */}
                    <div className="hidden items-center gap-3 md:flex">
                        <button
                            className={`eyebrow cursor-pointer transition-opacity duration-300 ${
                                i18n.language === "en"
                                    ? "opacity-100"
                                    : "opacity-40 hover:opacity-80"
                            }`}
                            onClick={() => changeLanguage("en")}
                            aria-pressed={i18n.language === "en"}
                        >
                            EN
                        </button>
                        <span className="h-3 w-px bg-[var(--color-hairline)]" aria-hidden="true" />
                        <button
                            className={`eyebrow cursor-pointer transition-opacity duration-300 ${
                                i18n.language === "sv"
                                    ? "opacity-100"
                                    : "opacity-40 hover:opacity-80"
                            }`}
                            onClick={() => changeLanguage("sv")}
                            aria-pressed={i18n.language === "sv"}
                        >
                            SV
                        </button>
                    </div>

                    <div className="relative flex items-center justify-center">
                        <button
                            className="cursor-pointer transition-opacity duration-300 hover:opacity-50"
                            onClick={() => setShowCart((prev) => !prev)}
                            aria-label={`Shopping cart, ${count} items`}
                            aria-expanded={showCart}
                        >
                            <BasketShopping3 className="h-5 w-5 text-[var(--color-obsidian)] sm:h-6 sm:w-6" />
                        </button>
                        {count > 0 && (
                            <span className="absolute -top-2 -right-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-obsidian)] text-[9px] font-medium text-[var(--color-bg)]">
                                {count}
                            </span>
                        )}
                        {showCart && (
                            <CartDropdown onClose={() => setShowCart(false)} />
                        )}
                    </div>
                </div>
            </div>
            <div className="hairline" />
        </header>
    );
};

export default Header;
