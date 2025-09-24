import BasketShopping3 from "../../icons/basketIcon";
import { useTranslation } from "react-i18next";
import BurgerMenu from "../../components/BurgerMenu/BurgerMenu";
import { useCart } from "../../contexts/CartContext";
import { useState } from "react";
import { CartDropdown } from "../../components/CartDropdown/CartDropdown";

const Header = () => {
    const { i18n } = useTranslation();
    const { count } = useCart();
    const [showCart, setShowCart] = useState(false);

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="fixed z-10 flex h-[7vh] w-full items-center justify-between bg-[#edc7f5] px-4 shadow-lg">
            <BurgerMenu />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <a className="text-3xl font-bold uppercase" href="/">
                    Mimmi Flowers
                </a>
            </div>
            <ul className="flex items-center justify-between">
                <div className="flex scale-120 items-center justify-center px-3 py-1">
                    <button
                        className="cursor-pointer"
                        onClick={() => setShowCart((prev) => !prev)}
                    >
                        <BasketShopping3 className="transition-transform duration-300 hover:scale-110" />
                        <span className="absolute top-0 right-0 rounded-full bg-white px-1.5 py-0.5 text-xs font-bold text-black">
                            {count}
                        </span>
                    </button>
                    {showCart && (
                        <CartDropdown onClose={() => setShowCart(false)} />
                    )}
                </div>
                <ul className="ml-2">
                    <button
                        className={
                            i18n.language === "en"
                                ? "cursor-pointer border-b-2 border-black px-3 py-1 font-semibold"
                                : "cursor-pointer border-b-2 border-transparent px-3 py-1 text-gray-500 hover:text-black"
                        }
                        onClick={() => changeLanguage("en")}
                    >
                        EN
                    </button>
                    <span className="font-semibold"> | </span>
                    <button
                        className={
                            i18n.language === "sv"
                                ? "cursor-pointer border-b-2 border-black px-3 py-1 font-semibold"
                                : "cursor-pointer border-b-2 border-transparent px-3 py-1 text-gray-500 hover:text-black"
                        }
                        onClick={() => changeLanguage("sv")}
                    >
                        SV
                    </button>
                </ul>
            </ul>
        </div>
    );
};

export default Header;
