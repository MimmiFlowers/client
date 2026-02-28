import { useParams, Link } from "react-router";

const CancelPage = () => {
    const { orderID } = useParams<{ orderID: string }>();

    return (
        <div className="mx-auto max-w-xl px-6 py-12 text-center">
            <h1 className="mb-4 text-3xl font-bold text-red-600">
                Payment Cancelled
            </h1>
            {orderID && (
                <p className="mb-4 text-gray-600">
                    Order <span className="font-semibold">{orderID}</span> was
                    not completed.
                </p>
            )}
            <p className="mb-6 text-gray-600">
                Your payment was not processed. You can return to your cart and
                try again.
            </p>
            <Link
                to="/Checkout"
                className="rounded-lg bg-green-600 px-6 py-3 text-white hover:bg-green-700"
            >
                Return to Checkout
            </Link>
        </div>
    );
};

export default CancelPage;
