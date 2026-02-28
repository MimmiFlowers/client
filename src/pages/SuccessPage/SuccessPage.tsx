import { useParams, Link } from "react-router";
import { useCart } from "../../contexts/CartContext";
import { useEffect, useState, useRef } from "react";
import api from "../../api/api";

type VerifyState = "loading" | "verified" | "error";

const SuccessPage = () => {
    const { clearItems } = useCart();
    const { orderID } = useParams<string>();
    const [state, setState] = useState<VerifyState>("loading");
    const didVerify = useRef(false);

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
                <p className="text-xl">Verifying your order...</p>
            </div>
        );
    }

    if (state === "error") {
        return (
            <div className="mt-20 text-center">
                <h1 className="text-2xl font-bold">
                    We could not verify your order
                </h1>
                <p className="mt-4">
                    If you completed payment, your order is being processed.
                    Please contact our support team if you need assistance.
                </p>
                <div className="mt-6">
                    <Link to="/" className="text-blue-500 hover:underline">
                        Return to Homepage
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="mt-10 text-center text-2xl font-bold">
                Thank You for Your Order!
            </h1>
            <p className="mt-4 text-center">
                Your order ID is:{" "}
                <span className="font-semibold">{orderID}</span>
            </p>
            <p className="mt-2 text-center">
                We will process your order shortly.
            </p>
            <div className="mt-6 flex justify-center text-6xl">&#10003;</div>
            <p className="mt-4 text-center">
                If you have any questions, please contact our support team.
            </p>
            <p className="mt-2 text-center">Thank you for shopping with us!</p>
            <div className="mt-6 text-center">
                <Link to="/" className="text-blue-500 hover:underline">
                    Return to Homepage
                </Link>
            </div>
        </div>
    );
};

export default SuccessPage;
