import { Link } from "react-router";
import { useTranslation } from "react-i18next";

const NotFoundPage = () => {
    const { t } = useTranslation();

    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
            <title>{t("seo.not_found_title")}</title>
            <div className="mx-auto w-full max-w-md text-center">
                {/* Large 404 */}
                <h1 className="mb-2 text-[7rem] leading-none font-extralight tracking-wider text-[var(--color-accent)]">
                    404
                </h1>

                <h2 className="mb-3 text-xl font-semibold text-[var(--color-obsidian)]">
                    {t("not_found.title")}
                </h2>

                <p className="mb-8 text-sm leading-relaxed text-[var(--color-muted)]">
                    {t("not_found.message")}
                </p>

                <Link
                    to="/"
                    className="inline-block rounded-full bg-[var(--color-obsidian)] px-8 py-2.5 text-sm font-medium tracking-wider text-white uppercase transition-opacity duration-300 hover:opacity-80"
                >
                    {t("not_found.go_home")}
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;
