import { useCart } from "../../contexts/CartContext";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

interface Props {
    onClose: () => void;
}

export const CartDropdown: React.FC<Props> = ({ onClose }) => {
    const { items, increase, decrease, removeItem } = useCart();
    const ref = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { t } = useTranslation();
    // const apiUrl = "http://localhost:8500/";

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const path = event.composedPath();
            if (ref.current && !path.includes(ref.current)) {
                setTimeout(() => {
                    onClose();
                }, 200);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    const handleRedirect = (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        navigate(`Catalog/${id}`);
    };

    const total = items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
    );

    return (
        <div
            ref={ref}
            className="absolute top-10 right-2 z-50 w-80 rounded-lg border bg-[#FFF0F5] p-4 shadow-xl"
        >
            <h3 className="mb-2 text-lg font-semibold">
                {t("cart.your_cart")}
            </h3>

            <div className="flex max-h-64 flex-col gap-3 overflow-y-auto">
                {items.length === 0 ? (
                    <p className="text-center text-gray-500">
                        {t("cart.empty_cart")}
                    </p>
                ) : (
                    items.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between border-b pb-2"
                        >
                            <img
                                src={item.picture}
                                alt={item.name}
                                onClick={(e) => handleRedirect(e, item.id)}
                                className="h-12 w-12 cursor-pointer rounded object-cover object-center transition-transform duration-300 hover:scale-105"
                            />
                            <div className="flex-1 px-2">
                                <p
                                    onClick={(e) => handleRedirect(e, item.id)}
                                    className="cursor-pointer text-sm font-medium hover:underline"
                                >
                                    {item.name}
                                </p>
                                <p className="text-xs text-gray-600">
                                    {item.price} {t("cart.pp")}
                                </p>
                                <div className="mt-1 flex items-center gap-2">
                                    <button
                                        onClick={() => decrease(item.id)}
                                        className="cursor-pointer px-2 transition-transform duration-300 hover:scale-110"
                                    >
                                        −
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button
                                        onClick={() => increase(item.id)}
                                        className="cursor-pointer px-2 transition-transform duration-300 hover:scale-110"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <div className="text-right text-sm">
                                <p>{item.price * item.quantity} kr</p>
                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="mt-1 cursor-pointer text-sm text-red-500 transition-transform duration-300 hover:scale-110"
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {items.length > 0 && (
                <>
                    <div className="mt-2 flex justify-between pt-2 font-semibold">
                        <span>{t("cart.total")}</span>
                        <span>{total} kr</span>
                    </div>
                    <button
                        className="mt-4 w-full cursor-pointer rounded bg-[#edc7f5] py-2 text-black transition-transform duration-300 hover:scale-105"
                        onClick={() => navigate("/Checkout")}
                    >
                        {t("cart.checkout")}
                    </button>
                </>
            )}
        </div>
    );
};
