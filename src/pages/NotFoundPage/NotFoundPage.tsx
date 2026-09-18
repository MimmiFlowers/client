import { Link } from "react-router";
import { useTranslation } from "react-i18next";

const NotFoundPage = () => {
    const { t } = useTranslation();

    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
            <title>{t("seo.not_found_title")}</title>
            <div className="mx-auto w-full max-w-md text-center">
                {/* Large 404 */}
                <h1 className="mb-2 font-[var(--font-display)] text-[8rem] leading-none font-medium tracking-wider text-[var(--color-gold-soft)]">
                    404
                </h1>

                <h2 className="mb-3 font-[var(--font-display)] text-2xl text-[var(--color-ink)]">
                    {t("not_found.title")}
                </h2>

                <p className="mb-8 text-sm leading-relaxed text-[var(--color-muted)]">
                    {t("not_found.message")}
                </p>

                <Link
                    to="/"
                    className="btn-primary hover:btn-primary-hover px-8 py-3"
                >
                    {t("not_found.go_home")}
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;
