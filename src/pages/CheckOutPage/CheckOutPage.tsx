import { useState, useMemo } from "react";
import { useCart } from "../../contexts/CartContext";
import { loadStripe } from "@stripe/stripe-js";
import api from "../../api/api";
import axios from "axios";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormErrors {
    [key: string]: string;
}

export default function CheckoutPage() {
    const { items } = useCart();

    const [customer, setCustomer] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
    });
    const [recipient, setRecipient] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        address: "",
        date: "",
        time: "",
    });
    const [orderForMyself, setOrderForMyself] = useState(false);
    const [pickup, setPickup] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [submitError, setSubmitError] = useState("");

    const subtotal = useMemo(
        () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        [items],
    );
    const deliveryFee = pickup ? 0 : 99;
    const total = subtotal + deliveryFee;
    const moms = total * 0.25;

    const validate = (): FormErrors => {
        const errs: FormErrors = {};

        if (!customer.firstName.trim()) errs.customerFirstName = "First name is required";
        if (!customer.lastName.trim()) errs.customerLastName = "Last name is required";
        if (!customer.phone.trim()) errs.customerPhone = "Phone is required";
        if (!customer.email.trim()) {
            errs.customerEmail = "Email is required";
        } else if (!EMAIL_RE.test(customer.email)) {
            errs.customerEmail = "Invalid email format";
        }

        const needsRecipient = !pickup && !orderForMyself;
        if (needsRecipient) {
            if (!recipient.firstName.trim()) errs.recipientFirstName = "Recipient first name is required";
            if (!recipient.lastName.trim()) errs.recipientLastName = "Recipient last name is required";
            if (!recipient.phone.trim()) errs.recipientPhone = "Recipient phone is required";
            if (!recipient.address.trim()) errs.recipientAddress = "Delivery address is required";
            if (!recipient.date) errs.recipientDate = "Delivery date is required";
            if (!recipient.time) errs.recipientTime = "Delivery time is required";
        }

        return errs;
    };

    const handlePay = async () => {
        setSubmitError("");
        const validationErrors = validate();
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;

        if (items.length === 0) return;

        setIsLoading(true);
        try {
            const stripe = await stripePromise;
            if (!stripe) return;

            const orderID = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

            const orderData = {
                orderID,
                customer,
                recipient: pickup || orderForMyself ? null : recipient,
                pickup,
                orderForMyself,
                items,
                subtotal,
                deliveryFee,
                total,
                moms,
            };

            const itemsForStripe = items.map((item) => ({
                name: item.name,
                price: Number(item.price) * 100,
                quantity: item.quantity,
            }));

            const response = await api.post(
                "/stripe/create_checkout_session",
                { items: itemsForStripe, orderData },
            );
            const session = response.data;

            const result = await stripe.redirectToCheckout({
                sessionId: session.session.id,
            });

            if (result.error) {
                setSubmitError(result.error.message || "Payment redirect failed");
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setSubmitError(
                    error.response?.data?.detail || "Failed to create checkout session. Please try again.",
                );
            } else {
                setSubmitError("An unexpected error occurred. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const customerFields = [
        { key: "firstName", label: "First name", errorKey: "customerFirstName" },
        { key: "lastName", label: "Last name", errorKey: "customerLastName" },
        { key: "phone", label: "Phone", errorKey: "customerPhone" },
        { key: "email", label: "Email", errorKey: "customerEmail" },
    ] as const;

    const recipientFields = [
        { key: "firstName", label: "First name", errorKey: "recipientFirstName" },
        { key: "lastName", label: "Last name", errorKey: "recipientLastName" },
        { key: "phone", label: "Phone", errorKey: "recipientPhone" },
    ] as const;

    return (
        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3">
            {/* Customer Info */}
            <div className="rounded-xl bg-white p-4 shadow-lg">
                <h2 className="mb-4 text-xl font-bold">
                    Information of the customer
                </h2>
                {customerFields.map(({ key, label, errorKey }) => (
                    <div key={key}>
                        <input
                            className={`mb-1 w-full border p-2 ${errors[errorKey] ? "border-red-500" : ""}`}
                            placeholder={label}
                            value={customer[key]}
                            onChange={(e) =>
                                setCustomer({
                                    ...customer,
                                    [key]: e.target.value,
                                })
                            }
                        />
                        {errors[errorKey] && (
                            <p className="mb-2 text-xs text-red-600">{errors[errorKey]}</p>
                        )}
                    </div>
                ))}
                <label className="mb-2 flex items-center">
                    <input
                        type="checkbox"
                        checked={orderForMyself}
                        onChange={(e) => setOrderForMyself(e.target.checked)}
                        className="mr-2"
                    />
                    Order for myself
                </label>
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        checked={pickup}
                        onChange={(e) => setPickup(e.target.checked)}
                        className="mr-2"
                    />
                    I am picking up the order myself
                </label>
                {pickup && (
                    <p className="mt-2 text-sm text-gray-500">
                        Pick up address: Rågsved, Stockholm
                    </p>
                )}
            </div>

            {/* Recipient Info */}
            <div className="rounded-xl bg-white p-4 shadow-lg">
                <h2 className="mb-4 text-xl font-bold">
                    Information of the receiver
                </h2>
                {recipientFields.map(({ key, label, errorKey }) => (
                    <div key={key}>
                        <input
                            className={`mb-1 w-full border p-2 ${errors[errorKey] ? "border-red-500" : ""}`}
                            placeholder={label}
                            disabled={orderForMyself || pickup}
                            value={recipient[key]}
                            onChange={(e) =>
                                setRecipient({
                                    ...recipient,
                                    [key]: e.target.value,
                                })
                            }
                        />
                        {errors[errorKey] && (
                            <p className="mb-2 text-xs text-red-600">{errors[errorKey]}</p>
                        )}
                    </div>
                ))}
                <div>
                    <input
                        className={`mb-1 w-full border p-2 ${errors.recipientAddress ? "border-red-500" : ""}`}
                        placeholder="Delivery address"
                        disabled={pickup}
                        value={recipient.address}
                        onChange={(e) =>
                            setRecipient({ ...recipient, address: e.target.value })
                        }
                    />
                    {errors.recipientAddress && (
                        <p className="mb-2 text-xs text-red-600">{errors.recipientAddress}</p>
                    )}
                </div>
                <label className="mb-2 block">Delivery date</label>
                <div>
                    <input
                        type="date"
                        className={`mb-1 w-full border p-2 ${errors.recipientDate ? "border-red-500" : ""}`}
                        disabled={pickup || orderForMyself}
                        value={recipient.date}
                        onChange={(e) =>
                            setRecipient({ ...recipient, date: e.target.value })
                        }
                        min={
                            new Date(Date.now() + 24 * 60 * 60 * 1000)
                                .toISOString()
                                .split("T")[0]
                        }
                    />
                    {errors.recipientDate && (
                        <p className="mb-2 text-xs text-red-600">{errors.recipientDate}</p>
                    )}
                </div>
                <label className="mb-2 block">Time of delivery</label>
                <div>
                    <input
                        type="time"
                        className={`w-full border p-2 ${errors.recipientTime ? "border-red-500" : ""}`}
                        disabled={pickup || orderForMyself}
                        value={recipient.time}
                        onChange={(e) => {
                            const hour = parseInt(e.target.value.split(":")[0]);
                            if (hour >= 8 && hour <= 22) {
                                setRecipient({
                                    ...recipient,
                                    time: e.target.value,
                                });
                                setErrors((prev) => {
                                    const next = { ...prev };
                                    delete next.recipientTime;
                                    return next;
                                });
                            } else {
                                setErrors((prev) => ({
                                    ...prev,
                                    recipientTime: "Delivery time is only from 08:00 to 22:00",
                                }));
                            }
                        }}
                    />
                    {errors.recipientTime && (
                        <p className="mt-1 text-xs text-red-600">{errors.recipientTime}</p>
                    )}
                </div>
            </div>

            {/* Cart Summary */}
            <div className="rounded-xl bg-white p-4 shadow-lg">
                <h2 className="mb-4 text-xl font-bold">Cart</h2>
                {items.length === 0 && (
                    <p className="mb-4 text-gray-500">Your cart is empty.</p>
                )}
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="mb-2 flex items-center justify-between"
                    >
                        <div className="flex items-center">
                            <img
                                src={item.picture}
                                alt={item.name}
                                className="mr-2 h-12 w-12 rounded object-cover"
                            />
                            <span>{item.name}</span>
                        </div>
                        <span>{item.price * item.quantity} kr</span>
                    </div>
                ))}
                {!pickup && (
                    <div className="flex justify-between text-gray-600">
                        <span>Delivery</span>
                        <span>{deliveryFee} kr</span>
                    </div>
                )}
                <div className="flex justify-between text-sm text-gray-500">
                    <span>VAT included (25%)</span>
                    <span>{moms.toFixed(2)} kr</span>
                </div>
                <div className="mt-2 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{total} kr</span>
                </div>
                {submitError && (
                    <p className="mt-2 text-sm text-red-600">{submitError}</p>
                )}
                <button
                    className="mt-4 w-full rounded-lg bg-green-600 p-3 text-white disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={handlePay}
                    disabled={isLoading || items.length === 0}
                >
                    {isLoading ? "Processing..." : "Pay"}
                </button>
            </div>
        </div>
    );
}
