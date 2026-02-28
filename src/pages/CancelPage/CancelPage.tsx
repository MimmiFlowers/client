import { useParams, Link } from "react-router";
import { useTranslation } from "react-i18next";

const CancelPage = () => {
    const { orderID } = useParams<{ orderID: string }>();
    const { t } = useTranslation();

    return (
        <div className="mx-auto max-w-xl px-6 py-12 text-center">
            <title>{t("seo.cancel_title")}</title>
            <h1 className="mb-4 text-3xl font-bold text-red-600">
                {t("cancel.title")}
            </h1>
            {orderID && (
                <p className="mb-4 text-gray-600">
                    {t("cancel.order_not_completed", { orderID })}
                </p>
            )}
            <p className="mb-6 text-gray-600">
                {t("cancel.not_processed")}
            </p>
            <Link
                to="/Checkout"
                className="rounded-lg bg-green-600 px-6 py-3 text-white hover:bg-green-700"
            >
                {t("cancel.return_checkout")}
            </Link>
        </div>
    );
};

export default CancelPage;
