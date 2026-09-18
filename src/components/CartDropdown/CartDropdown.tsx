import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import {
    useCart,
    FREE_DELIVERY_THRESHOLD,
    DELIVERY_FEE,
} from "../../contexts/CartContext";
import { useOverlay } from "../../hooks/useOverlay";
import {
    ArrowRightIcon,
    BagIcon,
    CheckIcon,
    CloseIcon,
    MinusIcon,
    PlusIcon,
} from "../Icons/Icons";

interface Props {
    open: boolean;
    onClose: () => void;
}

/** Slide-over shopping bag. Full width on phones, 28rem panel from sm: up. */
export const CartDropdown: React.FC<Props> = ({ open, onClose }) => {
    const { items, increase, decrease, removeItem } = useCart();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const panelRef = useOverlay<HTMLDivElement>(open, onClose);

    const total = items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
    );
    const isFreeDelivery = total >= FREE_DELIVERY_THRESHOLD;
    const grandTotal = total + (isFreeDelivery ? 0 : DELIVERY_FEE);
    const progress = Math.min(100, (total / FREE_DELIVERY_THRESHOLD) * 100);

    return createPortal(
        <div
            className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}
            inert={!open}
        >
            {/* Scrim */}
            <div
                className={`absolute inset-0 bg-ink/30 transition-opacity duration-500 ease-luxe ${
                    open ? "opacity-100" : "opacity-0"
                }`}
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Panel */}
            <div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-label={t("cart.your_cart")}
                className={`absolute inset-y-0 right-0 flex w-full flex-col bg-surface transition-[transform,visibility] duration-700 ease-drawer sm:max-w-[28rem] ${
                    open
                        ? "visible translate-x-0 shadow-lift"
                        : "invisible translate-x-full"
                }`}
            >
                {/* Head */}
                <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-5 sm:h-20 sm:px-8">
                    <h2 className="font-display text-2xl font-medium">
                        {t("cart.your_cart")}
                        {items.length > 0 && (
                            <span className="price ml-2 align-top font-sans text-xs text-muted">
                                ({items.reduce((n, i) => n + i.quantity, 0)})
                            </span>
                        )}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label={t("cart.close")}
                        className="-mr-2.5 flex h-11 w-11 cursor-pointer items-center justify-center text-ink transition-transform duration-500 ease-luxe hover:rotate-90"
                    >
                        <CloseIcon className="h-6 w-6" />
                    </button>
                </div>

                {items.length === 0 ? (
                    <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-blush text-muted">
                            <BagIcon className="h-8 w-8" />
                        </span>
                        <p className="mt-6 font-display text-2xl">
                            {t("cart.empty_cart")}
                        </p>
                        <p className="mt-2 max-w-60 text-sm text-muted">
                            {t("checkout.empty_cart_hint")}
                        </p>
                        <Link
                            to="/Catalog"
                            onClick={onClose}
                            className="group mt-8 inline-flex items-center gap-3 border-b border-ink pb-1 text-[12px] font-medium tracking-[0.16em] uppercase"
                        >
                            {t("checkout.browse_catalog")}
                            <ArrowRightIcon className="h-4 w-4 transition-transform duration-500 ease-luxe group-hover:translate-x-1" />
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Free delivery progress */}
                        <div className="shrink-0 border-b border-line px-5 py-4 sm:px-8">
                            <p className="flex items-center gap-2 text-[13px] text-ink-soft">
                                {isFreeDelivery && (
                                    <CheckIcon className="h-4 w-4 text-success" />
                                )}
                                {isFreeDelivery
                                    ? t("cart.free_delivery_unlocked")
                                    : t("cart.free_delivery_progress", {
                                          amount: (
                                              FREE_DELIVERY_THRESHOLD - total
                                          ).toLocaleString("sv-SE"),
                                      })}
                            </p>
                            <div className="mt-3 h-[3px] overflow-hidden rounded-full bg-blush-deep">
                                <div
                                    className="h-full origin-left rounded-full bg-primary-deep transition-transform duration-700 ease-luxe"
                                    style={{
                                        transform: `scaleX(${progress / 100})`,
                                    }}
                                />
                            </div>
                        </div>

                        {/* Items */}
                        <ul className="flex-1 divide-y divide-line overflow-y-auto overscroll-contain px-5 sm:px-8">
                            {items.map((item) => (
                                <li key={item.id} className="flex gap-4 py-5">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            onClose();
                                            navigate(
                                                item.designID
                                                    ? "/Wreath"
                                                    : `/Catalog/${item.id}`,
                                            );
                                        }}
                                        className="block h-28 w-22 shrink-0 cursor-pointer overflow-hidden rounded-[2px] bg-blush-deep"
                                        aria-label={item.name}
                                    >
                                        <img
                                            src={item.picture}
                                            alt=""
                                            className="h-full w-full object-cover transition-transform duration-700 ease-luxe hover:scale-105"
                                        />
                                    </button>

                                    <div className="flex min-w-0 flex-1 flex-col">
                                        <div className="flex items-start justify-between gap-3">
                                            <p className="font-display text-lg leading-tight">
                                                {item.name}
                                            </p>
                                            <p className="price shrink-0 text-sm">
                                                {(
                                                    item.price * item.quantity
                                                ).toLocaleString("sv-SE")}{" "}
                                                kr
                                            </p>
                                        </div>
                                        <p className="price mt-1 text-xs text-muted">
                                            {item.price.toLocaleString("sv-SE")}{" "}
                                            {t("cart.pp")}
                                        </p>
                                        {item.details && (
                                            <ul className="mt-1 space-y-0.5 text-xs leading-snug text-muted">
                                                {item.details.map((line) => (
                                                    <li key={line}>{line}</li>
                                                ))}
                                            </ul>
                                        )}

                                        <div className="mt-auto flex items-center justify-between pt-3">
                                            <div className="flex h-11 items-center rounded-full border border-line-strong">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        decrease(item.id)
                                                    }
                                                    aria-label={t(
                                                        "cart.decrease",
                                                        { name: item.name },
                                                    )}
                                                    className="flex h-full w-11 cursor-pointer items-center justify-center text-ink-soft transition-colors hover:text-ink"
                                                >
                                                    <MinusIcon className="h-3.5 w-3.5" />
                                                </button>
                                                <span className="price w-6 text-center text-sm">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        increase(item.id)
                                                    }
                                                    aria-label={t(
                                                        "cart.increase",
                                                        { name: item.name },
                                                    )}
                                                    className="flex h-full w-11 cursor-pointer items-center justify-center text-ink-soft transition-colors hover:text-ink"
                                                >
                                                    <PlusIcon className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeItem(item.id)
                                                }
                                                className="-mr-2 min-h-11 cursor-pointer px-2 text-xs text-muted underline decoration-line-strong underline-offset-4 transition-colors hover:text-danger"
                                            >
                                                {t("cart.remove")}
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        {/* Totals */}
                        <div className="shrink-0 border-t border-line bg-surface px-5 pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-8 sm:pb-8">
                            <dl className="space-y-2 text-sm">
                                <div className="flex justify-between text-ink-soft">
                                    <dt>{t("cart.subtotal")}</dt>
                                    <dd className="price">
                                        {total.toLocaleString("sv-SE")} kr
                                    </dd>
                                </div>
                                <div className="flex justify-between text-ink-soft">
                                    <dt>{t("cart.delivery")}</dt>
                                    <dd className="price">
                                        {isFreeDelivery
                                            ? t("cart.free_delivery")
                                            : `${DELIVERY_FEE} kr`}
                                    </dd>
                                </div>
                                <div className="flex items-baseline justify-between pt-2">
                                    <dt className="eyebrow text-ink">
                                        {t("cart.total")}
                                    </dt>
                                    <dd className="price font-display text-2xl">
                                        {grandTotal.toLocaleString("sv-SE")} kr
                                    </dd>
                                </div>
                            </dl>

                            <button
                                type="button"
                                onClick={() => {
                                    onClose();
                                    navigate("/Checkout");
                                }}
                                className="group mt-5 flex h-14 w-full cursor-pointer items-center justify-between rounded-full bg-ink pr-2 pl-7 text-[12px] font-medium tracking-[0.18em] text-blush uppercase transition-transform duration-300 active:scale-[0.98]"
                            >
                                {t("cart.checkout")}
                                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-ink transition-transform duration-500 ease-luxe group-hover:translate-x-0.5">
                                    <ArrowRightIcon className="h-4 w-4" />
                                </span>
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="mt-2 flex min-h-11 w-full cursor-pointer items-center justify-center text-[12px] tracking-[0.12em] text-muted uppercase transition-colors hover:text-ink"
                            >
                                {t("cart.continue_shopping")}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>,
        document.body,
    );
};
