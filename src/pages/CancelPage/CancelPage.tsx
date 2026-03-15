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
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                    <svg
                        className="h-8 w-8 text-red-400"
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

                <h1 className="mb-3 text-xl font-semibold text-gray-900">
                    {t("cancel.title")}
                </h1>

                {orderID && (
                    <p className="mb-2 text-sm text-gray-500">
                        {t("cancel.order_not_completed", { orderID })}
                    </p>
                )}

                <p className="mb-8 text-sm leading-relaxed text-gray-400">
                    {t("cancel.not_processed")}
                </p>

                <Link
                    to="/Checkout"
                    className="inline-block rounded-full bg-gray-900 px-8 py-2.5 text-sm font-medium tracking-wider text-white uppercase transition-opacity duration-300 hover:opacity-80"
                >
                    {t("cancel.return_checkout")}
                </Link>

                <div className="mt-4">
                    <Link
                        to="/"
                        className="text-sm text-gray-400 transition-colors duration-300 hover:text-gray-600"
                    >
                        {t("success.return_home")}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CancelPage;
