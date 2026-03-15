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
        <header className="fixed z-[50] flex h-16 w-full items-center justify-between bg-[#edc7f5]/90 px-4 shadow-sm backdrop-blur-md">
            <BurgerMenu />

            {/* Logo — centered */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Link
                    className="text-lg font-light uppercase tracking-[0.2em] text-gray-900 transition-opacity duration-300 hover:opacity-70 sm:text-xl md:text-2xl"
                    to="/"
                >
                    Mimmi Flowers
                </Link>
            </div>

            {/* Right side: cart + language */}
            <div className="flex items-center gap-3 sm:gap-4">
                <div className="relative flex items-center justify-center">
                    <button
                        className="cursor-pointer transition-opacity duration-300 hover:opacity-70"
                        onClick={() => setShowCart((prev) => !prev)}
                        aria-label={`Shopping cart, ${count} items`}
                        aria-expanded={showCart}
                    >
                        <BasketShopping3 className="h-5 w-5 text-gray-900 sm:h-6 sm:w-6" />
                    </button>
                    {count > 0 && (
                        <span className="absolute -top-2 -right-2.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-gray-900 text-[10px] font-medium text-white">
                            {count}
                        </span>
                    )}
                    {showCart && (
                        <CartDropdown onClose={() => setShowCart(false)} />
                    )}
                </div>

                {/* Language switcher — desktop only */}
                <div className="hidden items-center gap-0.5 rounded-full bg-white/40 p-0.5 backdrop-blur-sm md:flex">
                    <button
                        className={`cursor-pointer rounded-full px-3 py-1 text-xs font-medium tracking-wider transition-all duration-300 ${
                            i18n.language === "en"
                                ? "bg-white text-gray-900 shadow-sm"
                                : "text-gray-600 hover:text-gray-900"
                        }`}
                        onClick={() => changeLanguage("en")}
                        aria-pressed={i18n.language === "en"}
                    >
                        EN
                    </button>
                    <button
                        className={`cursor-pointer rounded-full px-3 py-1 text-xs font-medium tracking-wider transition-all duration-300 ${
                            i18n.language === "sv"
                                ? "bg-white text-gray-900 shadow-sm"
                                : "text-gray-600 hover:text-gray-900"
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
