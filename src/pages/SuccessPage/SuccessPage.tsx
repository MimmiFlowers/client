import { useParams } from "react-router";
// import { useTranslation } from "react-i18next";
import { useCart } from "../../contexts/CartContext";
import { useEffect } from "react";

const SuccessPage = () => {
    // const { t } = useTranslation();
    const { clearItems } = useCart();
    const { orderID } = useParams<string>();

    useEffect(() => {
        clearItems();
    }, []);

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
            <div className="mt-6 flex justify-center text-6xl">
                &#10003;
            </div>
            <p className="mt-4 text-center">
                If you have any questions, please contact our support team.
            </p>
            <p className="mt-2 text-center">Thank you for shopping with us!</p>
            <div className="mt-6 text-center">
                <a href="/" className="text-blue-500 hover:underline">
                    Return to Homepage
                </a>
            </div>
        </div>
    );
};

export default SuccessPage;
