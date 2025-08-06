import BasketShopping3 from "../../icons/basketIcon";
import { useTranslation } from "react-i18next";
import BurgerMenu from "../../components/BurgerMenu/BurgerMenu";
import { useCart } from '../../contexts/CartContext';
import { useState } from 'react';
import { CartDropdown } from "../../components/CartDropdown/CartDropdown";

const Header = () => {
    const { i18n } = useTranslation();
    const { count } = useCart();
    const [showCart, setShowCart] = useState(false);

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="fixed z-10 w-full h-[7vh] flex items-center justify-between px-4 bg-[#edc7f5] shadow-lg">
            <BurgerMenu />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <a className="text-3xl font-bold uppercase" href="/">
                Mimmi Flowers
                </a>
            </div>
            <ul className="flex items-center justify-between">
                <div className="flex justify-center items-center px-3 py-1 scale-120">
                    <button className="cursor-pointer" onClick={() => setShowCart(prev => !prev)}>
                        <BasketShopping3 className="hover:scale-110 transition-transform duration-300"/>
                        <span className="absolute top-0 right-0 bg-white text-black text-xs font-bold rounded-full px-1.5 py-0.5">
                            {count}
                        </span>
                    </button>
                    {showCart && <CartDropdown onClose={() => setShowCart(false)} />}
                </div>
                <ul className="ml-2">
                    <button
                        className={
                        i18n.language === "en"
                            ? "px-3 py-1 border-b-2 border-black font-semibold cursor-pointer"
                            : "px-3 py-1 border-b-2 border-transparent text-gray-500 hover:text-black cursor-pointer"
                        }
                        onClick={() => changeLanguage("en")}
                    >
                        EN
                    </button>
                    <span className="font-semibold"> | </span>
                    <button
                        className={
                        i18n.language === "sv"
                            ? "px-3 py-1 border-b-2 border-black font-semibold cursor-pointer"
                            : "px-3 py-1 border-b-2 border-transparent text-gray-500 hover:text-black cursor-pointer"
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
