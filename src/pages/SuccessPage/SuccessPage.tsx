import { useParams, Link } from "react-router";
import { useCart } from "../../contexts/CartContext";
import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import api from "../../api/api";
import StatusLayout from "../../components/StatusLayout/StatusLayout";
import { secondaryActionClass } from "../../components/StatusLayout/actionStyles";
import {
    AlertIcon,
    CheckIcon,
} from "../../components/Icons/Icons";
import PillLink from "../../components/PillLink/PillLink";

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

    const homeAction = (
        <PillLink to="/">{t("success.return_home")}</PillLink>
    );

    /* ── Loading state ── */
    if (state === "loading") {
        return (
            <div
                className="container-luxe flex min-h-[70dvh] flex-col items-center justify-center text-center"
                aria-busy="true"
            >
                <title>{t("seo.success_title")}</title>
                <span className="h-14 w-14 animate-spin rounded-full border border-line-strong border-t-ink" />
                <p className="eyebrow mt-8">{t("success.verifying")}</p>
            </div>
        );
    }

    /* ── Error state ── */
    if (state === "error") {
        return (
            <>
                <title>{t("seo.success_title")}</title>
                <StatusLayout
                    visual={
                        <span className="flex h-20 w-20 items-center justify-center rounded-full border border-line-strong text-ink">
                            <AlertIcon className="h-8 w-8" />
                        </span>
                    }
                    title={t("success.error_title")}
                    actions={
                        <>
                            {homeAction}
                            <Link to="/Contact" className={secondaryActionClass}>
                                {t("menu.contact")}
                            </Link>
                        </>
                    }
                >
                    <p>{t("success.error_message")}</p>
                </StatusLayout>
            </>
        );
    }

    /* ── Success state ── */
    return (
        <>
            <title>{t("seo.success_title")}</title>
            <StatusLayout
                visual={
                    <span className="flex h-24 w-24 items-center justify-center rounded-full bg-primary text-ink">
                        <CheckIcon className="h-10 w-10" strokeWidth={1} />
                    </span>
                }
                note={t("success.thanks_shopping")}
                title={t("success.thank_you")}
                actions={homeAction}
            >
                <div className="mx-auto mb-6 inline-flex flex-col items-center rounded-2xl border border-line bg-surface px-8 py-4">
                    <span className="eyebrow">{t("success.order_id")}</span>
                    <span className="price mt-1.5 font-display text-subtitle tracking-[0.04em] text-ink">
                        {orderID}
                    </span>
                </div>
                <p>{t("success.processing")}</p>
                <p className="text-muted">{t("success.questions")}</p>
            </StatusLayout>
        </>
    );
};

export default SuccessPage;
