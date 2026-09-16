import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import StatusLayout from "../../components/StatusLayout/StatusLayout";
import {
    primaryActionClass,
    secondaryActionClass,
} from "../../components/StatusLayout/actionStyles";
import { ArrowRightIcon } from "../../components/Icons/Icons";

const NotFoundPage = () => {
    const { t } = useTranslation();

    return (
        <>
            <title>{t("seo.not_found_title")}</title>
            <StatusLayout
                visual={
                    <span className="price font-display text-[8rem] leading-none font-medium tracking-[-0.04em] text-accent-ink sm:text-[12rem]">
                        404
                    </span>
                }
                title={t("not_found.title")}
                actions={
                    <>
                        <Link to="/" className={primaryActionClass}>
                            {t("not_found.go_home")}
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-ink transition-transform duration-500 ease-luxe group-hover:translate-x-1">
                                <ArrowRightIcon className="h-4 w-4" />
                            </span>
                        </Link>
                        <Link to="/Catalog" className={secondaryActionClass}>
                            {t("checkout.browse_catalog")}
                        </Link>
                    </>
                }
            >
                <p>{t("not_found.message")}</p>
            </StatusLayout>
        </>
    );
};

export default NotFoundPage;
