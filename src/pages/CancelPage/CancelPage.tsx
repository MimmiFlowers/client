import { useParams, Link } from "react-router";
import { useTranslation } from "react-i18next";

const CancelPage = () => {
    const { orderID } = useParams<{ orderID: string }>();
    const { t } = useTranslation();

    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
            <title>{t("seo.cancel_title")}</title>
            <div className="mx-auto w-full max-w-md text-center">
                {/* X circle icon */}
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-blush-soft)]">
                    <svg
                        className="h-8 w-8 text-[var(--color-blush-deep)]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </div>

                <h1 className="mb-3 font-[var(--font-display)] text-2xl text-[var(--color-ink)]">
                    {t("cancel.title")}
                </h1>

                {orderID && (
                    <p className="mb-2 text-sm text-[var(--color-fg-mid)]">
                        {t("cancel.order_not_completed", { orderID })}
                    </p>
                )}

                <p className="mb-8 text-sm leading-relaxed text-[var(--color-muted)]">
                    {t("cancel.not_processed")}
                </p>

                <Link
                    to="/Checkout"
                    className="btn-primary hover:btn-primary-hover px-8 py-3"
                >
                    {t("cancel.return_checkout")}
                </Link>

                <div className="mt-4">
                    <Link
                        to="/"
                        className="text-sm text-[var(--color-muted)] transition-colors duration-300 hover:text-[var(--color-primary)]"
                    >
                        {t("success.return_home")}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CancelPage;
