import { useParams, Link } from "react-router";
import { useCart } from "../../contexts/CartContext";
import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import api from "../../api/api";

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

    if (state === "loading") {
        return (
            <div className="mt-20 text-center">
                <p className="text-xl">{t("success.verifying")}</p>
            </div>
        );
    }

    if (state === "error") {
        return (
            <div className="mt-20 text-center">
                <h1 className="text-2xl font-bold">
                    {t("success.error_title")}
                </h1>
                <p className="mt-4">
                    {t("success.error_message")}
                </p>
                <div className="mt-6">
                    <Link to="/" className="text-blue-500 hover:underline">
                        {t("success.return_home")}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="mt-10 text-center text-2xl font-bold">
                {t("success.thank_you")}
            </h1>
            <p className="mt-4 text-center">
                {t("success.order_id")}{" "}
                <span className="font-semibold">{orderID}</span>
            </p>
            <p className="mt-2 text-center">
                {t("success.processing")}
            </p>
            <div className="mt-6 flex justify-center text-6xl">&#10003;</div>
            <p className="mt-4 text-center">
                {t("success.questions")}
            </p>
            <p className="mt-2 text-center">{t("success.thanks_shopping")}</p>
            <div className="mt-6 text-center">
                <Link to="/" className="text-blue-500 hover:underline">
                    {t("success.return_home")}
                </Link>
            </div>
        </div>
    );
};

export default SuccessPage;
