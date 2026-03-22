import { useCart } from "../../contexts/CartContext";
import { FREE_DELIVERY_THRESHOLD, DELIVERY_FEE } from "../../contexts/CartContext";
import { useEffect, useRef, useCallback } from "react";
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

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
                return;
            }

            if (e.key === "Tab" && ref.current) {
                const focusable = ref.current.querySelectorAll<HTMLElement>(
                    'a, button, [tabindex]:not([tabindex="-1"])',
                );
                if (focusable.length === 0) return;

                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                if (!first || !last) return;

                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        },
        [onClose],
    );

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
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose, handleKeyDown]);

    const handleRedirect = (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        navigate(`/Catalog/${id}`);
    };

    const handleRedirectKeyDown = (e: React.KeyboardEvent, id: string) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            navigate(`/Catalog/${id}`);
        }
    };

    const total = items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
    );

    const isFreeDelivery = total >= FREE_DELIVERY_THRESHOLD;
    const deliveryFee = isFreeDelivery ? 0 : DELIVERY_FEE;
    const grandTotal = total + deliveryFee;

    return (
        <div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-label={t("cart.your_cart")}
            className="fixed inset-x-0 top-16 z-50 mx-auto rounded-xl border border-gray-100 bg-[#FFF0F5] p-5 shadow-xl sm:absolute sm:inset-x-auto sm:top-10 sm:right-0 sm:mx-0 sm:w-80"
        >
            <h3 className="text-xs font-medium uppercase tracking-[0.15em] text-gray-500">
                {t("cart.your_cart")}
            </h3>

            <div className="mt-4 flex max-h-64 flex-col gap-3 overflow-y-auto">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center py-6">
                        <svg
                            className="mb-2 h-10 w-10 text-gray-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                            />
                        </svg>
                        <p className="text-sm font-light text-gray-400">
                            {t("cart.empty_cart")}
                        </p>
                    </div>
                ) : (
                    items.map((item, i) => (
                        <div
                            key={item.id}
                            className={`flex items-center gap-3 pb-3 ${
                                i < items.length - 1 ? "border-b border-gray-100" : ""
                            }`}
                        >
                            <img
                                src={item.picture}
                                alt={item.name}
                                onClick={(e) => handleRedirect(e, item.id)}
                                onKeyDown={(e) =>
                                    handleRedirectKeyDown(e, item.id)
                                }
                                role="button"
                                tabIndex={0}
                                className="h-14 w-14 cursor-pointer rounded-lg object-cover object-center transition-opacity duration-300 hover:opacity-80"
                            />
                            <div className="flex-1">
                                <p
                                    onClick={(e) => handleRedirect(e, item.id)}
                                    onKeyDown={(e) =>
                                        handleRedirectKeyDown(e, item.id)
                                    }
                                    role="button"
                                    tabIndex={0}
                                    className="cursor-pointer text-sm font-medium leading-tight text-gray-900 transition-opacity duration-300 hover:opacity-70"
                                >
                                    {item.name}
                                </p>
                                <p className="mt-0.5 text-xs font-light text-gray-400">
                                    {item.price} {t("cart.pp")}
                                </p>
                                <div className="mt-1.5 flex items-center gap-1">
                                    <button
                                        onClick={() => decrease(item.id)}
                                        aria-label={`Decrease quantity of ${item.name}`}
                                        className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-gray-200 text-xs text-gray-500 transition-colors duration-300 hover:border-gray-400 hover:text-gray-900"
                                    >
                                        &minus;
                                    </button>
                                    <span className="w-6 text-center text-xs font-medium text-gray-700">
                                        {item.quantity}
                                    </span>
                                    <button
                                        onClick={() => increase(item.id)}
                                        aria-label={`Increase quantity of ${item.name}`}
                                        className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-gray-200 text-xs text-gray-500 transition-colors duration-300 hover:border-gray-400 hover:text-gray-900"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <p className="text-sm font-medium text-gray-900">
                                    {item.price * item.quantity} kr
                                </p>
                                <button
                                    onClick={() => removeItem(item.id)}
                                    aria-label={`Remove ${item.name} from cart`}
                                    className="cursor-pointer text-xs font-light text-gray-400 transition-colors duration-300 hover:text-red-400"
                                >
                                    {t("buttons.cancel")}
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {items.length > 0 && (
                <>
                    <div className="mt-3 space-y-1.5 border-t border-gray-200/60 pt-3">
                        <div className="flex justify-between text-xs text-gray-400">
                            <span>{t("cart.subtotal")}</span>
                            <span>{total.toLocaleString()} kr</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400">
                            <span>{t("cart.delivery")}</span>
                            <span>
                                {isFreeDelivery
                                    ? t("cart.free_delivery")
                                    : `${DELIVERY_FEE} kr`}
                            </span>
                        </div>
                        {!isFreeDelivery && (
                            <p className="text-[10px] leading-tight text-gray-300">
                                {t("cart.free_delivery_hint")}
                            </p>
                        )}
                        <div className="flex justify-between border-t border-gray-200/60 pt-2">
                            <span className="text-sm font-medium uppercase tracking-wider text-gray-500">
                                {t("cart.total")}
                            </span>
                            <span className="text-sm font-semibold text-gray-900">
                                {grandTotal.toLocaleString()} kr
                            </span>
                        </div>
                    </div>
                    <button
                        className="mt-4 w-full cursor-pointer rounded-full bg-gray-900 py-2.5 text-xs font-medium uppercase tracking-wider text-white transition-opacity duration-300 hover:opacity-80"
                        onClick={() => {
                            onClose();
                            navigate("/Checkout");
                        }}
                    >
                        {t("cart.checkout")}
                    </button>
                </>
            )}
        </div>
    );
};
