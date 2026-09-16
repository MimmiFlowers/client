import { useParams, Link } from "react-router";
import { useTranslation } from "react-i18next";
import StatusLayout from "../../components/StatusLayout/StatusLayout";
import {
    primaryActionClass,
    secondaryActionClass,
} from "../../components/StatusLayout/actionStyles";
import { ArrowRightIcon, CloseIcon } from "../../components/Icons/Icons";

const CancelPage = () => {
    const { orderID } = useParams<{ orderID: string }>();
    const { t } = useTranslation();

    return (
        <>
            <title>{t("seo.cancel_title")}</title>
            <StatusLayout
                visual={
                    <span className="flex h-20 w-20 items-center justify-center rounded-full border border-line-strong text-ink">
                        <CloseIcon className="h-8 w-8" />
                    </span>
                }
                title={t("cancel.title")}
                actions={
                    <>
                        <Link to="/Checkout" className={primaryActionClass}>
                            {t("cancel.return_checkout")}
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-ink transition-transform duration-500 ease-luxe group-hover:translate-x-1">
                                <ArrowRightIcon className="h-4 w-4" />
                            </span>
                        </Link>
                        <Link to="/" className={secondaryActionClass}>
                            {t("success.return_home")}
                        </Link>
                    </>
                }
            >
                {orderID && (
                    <p className="price text-ink">
                        {t("cancel.order_not_completed", { orderID })}
                    </p>
                )}
                <p>{t("cancel.not_processed")}</p>
            </StatusLayout>
        </>
    );
};

export default CancelPage;
