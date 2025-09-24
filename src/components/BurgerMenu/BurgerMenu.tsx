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
                className="group top-4 left-4 z-50 mx-3 flex h-6 w-8 cursor-pointer flex-col justify-between transition-transform duration-300 hover:scale-110"
            >
                <span
                    className={`h-1 rounded bg-black transition-transform duration-300 ${
                        isOpen ? "translate-y-2 rotate-45" : ""
                    }`}
                ></span>
                <span
                    className={`h-1 rounded bg-black transition-all duration-300 ${
                        isOpen ? "opacity-0" : ""
                    }`}
                ></span>
                <span
                    className={`h-1 rounded bg-black transition-transform duration-300 ${
                        isOpen ? "-translate-y-3 -rotate-45" : ""
                    }`}
                ></span>
            </button>

            <div
                className={`fixed top-0 left-0 z-40 h-full bg-white shadow-lg transition-transform duration-300 ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                } w-[20vw] min-w-[200px]`}
            >
                <nav className="flex translate-y-16 flex-col space-y-2 p-6">
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
