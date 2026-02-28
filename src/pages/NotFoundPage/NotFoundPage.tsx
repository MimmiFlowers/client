import { Link } from "react-router";
import { useTranslation } from "react-i18next";

const NotFoundPage = () => {
    const { t } = useTranslation();

    return (
        <div className="mx-auto max-w-xl px-6 py-12 text-center">
            <title>{t("seo.not_found_title")}</title>
            <h1 className="mb-4 text-6xl font-bold text-gray-300">404</h1>
            <h2 className="mb-4 text-2xl font-semibold text-gray-800">
                {t("not_found.title")}
            </h2>
            <p className="mb-6 text-gray-600">
                {t("not_found.message")}
            </p>
            <Link
                to="/"
                className="rounded-lg bg-green-600 px-6 py-3 text-white hover:bg-green-700"
            >
                {t("not_found.go_home")}
            </Link>
        </div>
    );
};

export default NotFoundPage;
