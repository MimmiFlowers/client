import React, { useState } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

const BurgerMenu: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useTranslation();

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <>
            <button
                onClick={toggleMenu}
                className="top-4 left-4 z-50 mx-3 flex flex-col justify-between w-8 h-6 group cursor-pointer hover:scale-110 transition-transform duration-300"
            >
                <span
                    className={`h-1 bg-black rounded transition-transform duration-300 ${
                        isOpen ? "rotate-45 translate-y-2" : ""
                    }`}
                ></span>
                <span
                    className={`h-1 bg-black rounded transition-all duration-300 ${
                        isOpen ? "opacity-0" : ""
                    }`}
                ></span>
                <span
                    className={`h-1 bg-black rounded transition-transform duration-300 ${
                        isOpen ? "-rotate-45 -translate-y-3" : ""
                    }`}
                ></span>
            </button>

            <div
                className={`fixed top-0 left-0 h-full bg-white shadow-lg z-40 transition-transform duration-300 ${
                isOpen ? "translate-x-0" : "-translate-x-full"
                } w-[20vw] min-w-[200px]`}
            >
                <nav className="flex flex-col p-6 space-y-2 translate-y-16">
                    <Link
                        to="/Catalog"
                        onClick={() => setIsOpen(false)}
                        className="text-2xl hover:underline"
                    >
                        {t("menu.catalog")}
                    </Link>
                    <Link
                        to="/About"
                        onClick={() => setIsOpen(false)}
                        className="text-2xl hover:underline"
                    >
                        {t("menu.about")}
                    </Link>
                    <Link
                        to="/Contact"
                        onClick={() => setIsOpen(false)}
                        className="text-2xl hover:underline"
                    >
                        {t("menu.contact")}
                    </Link>
                </nav>
            </div>
        </>
    );
};

export default BurgerMenu;
