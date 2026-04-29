import { useParams, Link } from "react-router";
import { useCart } from "../../contexts/CartContext";
import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import api from "../../api/api";

type VerifyState = "loading" | "verified" | "error";

const SuccessPage = () => {
    const { clearItems } = useCart();
    const { orderID } = useParams<string>();
    const [state, setState] = useState<VerifyState>("loading");
    const didVerify = useRef(false);
    const { t } = useTranslation();

    useEffect(() => {
        if (!orderID || didVerify.current) return;
        didVerify.current = true;

        api.get(`/stripe/order/${encodeURIComponent(orderID)}/status`)
            .then((res) => {
                if (res.data.status === "paid") {
                    clearItems();
                    setState("verified");
                } else {
                    setState("error");
                }
            })
            .catch(() => {
                setState("error");
            });
    }, [orderID]);

    /* ── Loading state ── */
    if (state === "loading") {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
                <title>{t("seo.success_title")}</title>
                <div className="mb-6 h-12 w-12 animate-spin rounded-full border-[3px] border-[var(--color-line)] border-t-[#edc7f5]" />
                <p className="text-sm font-light tracking-wider text-[var(--color-muted)] uppercase">
                    {t("success.verifying")}
                </p>
            </div>
        );
    }

    /* ── Error state ── */
    if (state === "error") {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
                <title>{t("seo.success_title")}</title>
                <div className="mx-auto w-full max-w-md text-center">
                    {/* Warning icon */}
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50">
                        <svg
                            className="h-8 w-8 text-amber-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                            />
                        </svg>
                    </div>

                    <h1 className="mb-3 text-xl font-semibold text-[var(--color-burgundy)]">
                        {t("success.error_title")}
                    </h1>
                    <p className="mb-8 text-sm leading-relaxed text-[var(--color-muted)]">
                        {t("success.error_message")}
                    </p>

                    <Link
                        to="/"
                        className="inline-block rounded-full bg-[var(--color-burgundy)] px-8 py-2.5 text-sm font-medium tracking-wider text-white uppercase transition-opacity duration-300 hover:opacity-80"
                    >
                        {t("success.return_home")}
                    </Link>
                </div>
            </div>
        );
    }

    /* ── Success state ── */
    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
            <title>{t("seo.success_title")}</title>
            <div className="mx-auto w-full max-w-md text-center">
                {/* Animated checkmark circle */}
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
                    <svg
                        className="h-10 w-10 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>

                <h1 className="mb-2 text-2xl font-semibold text-[var(--color-burgundy)]">
                    {t("success.thank_you")}
                </h1>

                {/* Order ID badge */}
                <div className="mx-auto mb-6 inline-block rounded-full bg-[var(--color-cream)] px-5 py-2">
                    <p className="text-xs text-[var(--color-muted)]">
                        {t("success.order_id")}
                    </p>
                    <p className="font-mono text-sm font-semibold tracking-wider text-[var(--color-burgundy)]">
                        {orderID}
                    </p>
                </div>

                <p className="mb-1 text-sm text-[var(--color-fg-soft)]">
                    {t("success.processing")}
                </p>
                <p className="mb-8 text-sm text-[var(--color-muted)]">
                    {t("success.questions")}
                </p>

                {/* Divider */}
                <div className="mx-auto mb-6 h-px w-16 bg-[var(--color-line)]" />

                <p className="mb-6 text-xs font-light tracking-wider text-[var(--color-muted)] uppercase">
                    {t("success.thanks_shopping")}
                </p>

                <Link
                    to="/"
                    className="inline-block rounded-full bg-[var(--color-burgundy)] px-8 py-2.5 text-sm font-medium tracking-wider text-white uppercase transition-opacity duration-300 hover:opacity-80"
                >
                    {t("success.return_home")}
                </Link>
            </div>
        </div>
    );
};

export default SuccessPage;
