import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router";
import { useTranslation } from "react-i18next";
import BurgerMenu from "../../components/BurgerMenu/BurgerMenu";
import { CartDropdown } from "../../components/CartDropdown/CartDropdown";
import { BagIcon } from "../../components/Icons/Icons";
import { useCart } from "../../contexts/CartContext";
import { navLinks } from "../navigation";
import LanguageSwitch from "../../components/LanguageSwitch/LanguageSwitch";

const Header = () => {
    const { t } = useTranslation();
    const { count } = useCart();
    const [showCart, setShowCart] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const sentinel = document.getElementById("top-sentinel");
        if (!sentinel || typeof IntersectionObserver === "undefined") return;
        const observer = new IntersectionObserver(([entry]) =>
            setScrolled(!entry?.isIntersecting),
        );
        observer.observe(sentinel);
        return () => observer.disconnect();
    }, []);

    return (
        <>
            <div
                id="top-sentinel"
                className="pointer-events-none absolute top-0 h-12 w-px"
                aria-hidden="true"
            />
            <header className="fixed inset-x-0 top-0 z-40">
                {/* Announcement strip */}
                <div className="flex h-8 items-center justify-center bg-primary px-4">
                    <p className="truncate text-[10.5px] font-medium tracking-[0.2em] text-ink uppercase">
                        {t("cart.free_delivery_hint")}
                    </p>
                </div>

                {/* Main bar */}
                <div
                    className={`border-b backdrop-blur-xl transition-[background-color,border-color] duration-500 ${
                        scrolled
                            ? "border-line bg-blush/85"
                            : "border-transparent bg-blush/60"
                    }`}
                >
                    <div className="container-luxe grid h-16 grid-cols-[1fr_auto_1fr] items-center md:h-20">
                        {/* Left: burger on mobile, nav on desktop */}
                        <div className="flex items-center">
                            <BurgerMenu />
                            <nav
                                aria-label="Main"
                                className="hidden items-center gap-9 lg:flex"
                            >
                                {navLinks.map((link) => (
                                    <NavLink
                                        key={link.to}
                                        to={link.to}
                                        className={({ isActive }) =>
                                            `group relative py-2 text-[12px] font-medium tracking-[0.16em] uppercase transition-colors duration-300 ${
                                                isActive
                                                    ? "text-ink"
                                                    : "text-ink-soft hover:text-ink"
                                            }`
                                        }
                                    >
                                        {({ isActive }) => (
                                            <>
                                                {t(link.key)}
                                                <span
                                                    className={`absolute inset-x-0 -bottom-0.5 h-px origin-left bg-ink transition-transform duration-500 ease-luxe ${
                                                        isActive
                                                            ? "scale-x-100"
                                                            : "scale-x-0 group-hover:scale-x-100"
                                                    }`}
                                                />
                                            </>
                                        )}
                                    </NavLink>
                                ))}
                            </nav>
                        </div>

                        {/* Wordmark */}
                        <Link
                            to="/"
                            className="font-display text-[1.45rem] leading-none font-medium tracking-[-0.01em] text-ink transition-opacity duration-300 hover:opacity-70 sm:text-[1.7rem] md:text-[2rem]"
                        >
                            Mimmi Flowers
                        </Link>

                        {/* Right: language + bag */}
                        <div className="flex items-center justify-end gap-6">
                            <LanguageSwitch className="hidden lg:flex" />
                            <button
                                type="button"
                                onClick={() => setShowCart(true)}
                                aria-label={t("cart.open", { count })}
                                aria-expanded={showCart}
                                className="group relative -mr-2 flex h-11 w-11 cursor-pointer items-center justify-center text-ink"
                            >
                                <BagIcon className="h-[1.4rem] w-[1.4rem] transition-transform duration-500 ease-luxe group-hover:-translate-y-0.5" />
                                {count > 0 && (
                                    <span className="price absolute top-1.5 right-0.5 flex h-[1.1rem] min-w-[1.1rem] items-center justify-center rounded-full bg-ink px-1 text-[10px] leading-none font-medium text-blush">
                                        {count}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <CartDropdown
                open={showCart}
                onClose={() => setShowCart(false)}
            />
        </>
    );
};

export default Header;
