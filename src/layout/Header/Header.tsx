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
        <header className="fixed z-[50] flex h-16 w-full items-center justify-between border-b border-[var(--color-line)] bg-[var(--color-bg)]/85 px-4 backdrop-blur-md">
            <BurgerMenu />

            {/* Logo — centered */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Link
                    className="group flex flex-col items-center transition-opacity duration-300 hover:opacity-80"
                    to="/"
                >
                    <span className="font-[var(--font-display)] text-lg leading-none tracking-[0.22em] text-[var(--color-ink)] uppercase sm:text-xl md:text-[1.6rem]">
                        Mimmi&nbsp;Flowers
                    </span>
                    <span className="mt-1 hidden text-[0.5rem] font-medium tracking-[0.4em] text-[var(--color-gold-deep)] uppercase sm:block">
                        Stockholm Atelier
                    </span>
                </Link>
            </div>

            {/* Right side: cart + language */}
            <div className="flex items-center gap-3 sm:gap-4">
                <div className="relative flex items-center justify-center">
                    <button
                        className="cursor-pointer text-[var(--color-ink)] transition-all duration-300 hover:text-[var(--color-primary-soft)]"
                        onClick={() => setShowCart((prev) => !prev)}
                        aria-label={`Shopping cart, ${count} items`}
                        aria-expanded={showCart}
                    >
                        <BasketShopping3 className="h-6 w-6 sm:h-[1.65rem] sm:w-[1.65rem]" />
                    </button>
                    {count > 0 && (
                        <span className="absolute -top-2 -right-2.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[var(--color-primary)] text-[10px] font-medium text-[var(--color-bg)]">
                            {count}
                        </span>
                    )}
                    {showCart && (
                        <CartDropdown onClose={() => setShowCart(false)} />
                    )}
                </div>

                {/* Language switcher — desktop only */}
                <div className="hidden items-center gap-0.5 rounded-full border border-[var(--color-line)] bg-[var(--color-surface)]/60 p-0.5 backdrop-blur-sm md:flex">
                    <button
                        className={`ui-label cursor-pointer rounded-full px-3 py-1 text-[0.7rem] transition-all duration-300 ${
                            i18n.language === "en"
                                ? "bg-[var(--color-primary)] text-[var(--color-bg)] shadow-sm"
                                : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                        }`}
                        onClick={() => changeLanguage("en")}
                        aria-pressed={i18n.language === "en"}
                    >
                        EN
                    </button>
                    <button
                        className={`ui-label cursor-pointer rounded-full px-3 py-1 text-[0.7rem] transition-all duration-300 ${
                            i18n.language === "sv"
                                ? "bg-[var(--color-primary)] text-[var(--color-bg)] shadow-sm"
                                : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                        }`}
                        onClick={() => changeLanguage("sv")}
                        aria-pressed={i18n.language === "sv"}
                    >
                        SV
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
