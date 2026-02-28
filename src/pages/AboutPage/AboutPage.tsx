import { Link } from "react-router";
import { useTranslation } from "react-i18next";

const AboutPage = () => {
    const { t } = useTranslation();

    return (
        <div className="mx-auto max-w-3xl px-6 py-12">
            <h1 className="mb-6 text-3xl font-bold">{t("about.title")}</h1>
            <p className="mb-4 text-lg leading-relaxed text-gray-700">
                {t("about.paragraph1")}
            </p>
            <p className="mb-4 text-lg leading-relaxed text-gray-700">
                {t("about.paragraph2")}
            </p>
            <p className="text-lg leading-relaxed text-gray-700">
                {t("about.paragraph3")}
            </p>
            <div className="mt-8">
                <Link
                    to="/Catalog"
                    className="rounded-lg bg-green-600 px-6 py-3 text-white hover:bg-green-700"
                >
                    {t("about.browse_catalog")}
                </Link>
            </div>
        </div>
    );
};

export default AboutPage;
