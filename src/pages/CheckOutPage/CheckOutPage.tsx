import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useCart } from "../../contexts/CartContext";
import { loadStripe } from "@stripe/stripe-js";
import api from "../../api/api";
import { isAxiosError } from "axios";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormErrors {
    [key: string]: string;
}

export default function CheckoutPage() {
    const { items } = useCart();
    const { t } = useTranslation();

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

        if (!customer.firstName.trim()) errs.customerFirstName = t("checkout.errors.first_name");
        if (!customer.lastName.trim()) errs.customerLastName = t("checkout.errors.last_name");
        if (!customer.phone.trim()) errs.customerPhone = t("checkout.errors.phone");
        if (!customer.email.trim()) {
            errs.customerEmail = t("checkout.errors.email_required");
        } else if (!EMAIL_RE.test(customer.email)) {
            errs.customerEmail = t("checkout.errors.email_invalid");
        }

        const needsRecipient = !pickup && !orderForMyself;
        if (needsRecipient) {
            if (!recipient.firstName.trim()) errs.recipientFirstName = t("checkout.errors.recipient_first_name");
            if (!recipient.lastName.trim()) errs.recipientLastName = t("checkout.errors.recipient_last_name");
            if (!recipient.phone.trim()) errs.recipientPhone = t("checkout.errors.recipient_phone");
            if (!recipient.address.trim()) errs.recipientAddress = t("checkout.errors.delivery_address");
            if (!recipient.date) errs.recipientDate = t("checkout.errors.delivery_date");
            if (!recipient.time) errs.recipientTime = t("checkout.errors.delivery_time");
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

            const orderData = {
                orderID: "placeholder", // Server generates the real orderID
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
                setSubmitError(result.error.message || t("checkout.errors.payment_redirect"));
            }
        } catch (error) {
            if (isAxiosError(error)) {
                setSubmitError(
                    error.response?.data?.detail || t("checkout.errors.checkout_session"),
                );
            } else {
                setSubmitError(t("checkout.errors.unexpected"));
            }
        } finally {
            setIsLoading(false);
        }
    };

    const customerFields = [
        { key: "firstName", label: t("checkout.first_name"), errorKey: "customerFirstName", id: "customer-firstName" },
        { key: "lastName", label: t("checkout.last_name"), errorKey: "customerLastName", id: "customer-lastName" },
        { key: "phone", label: t("checkout.phone"), errorKey: "customerPhone", id: "customer-phone" },
        { key: "email", label: t("checkout.email"), errorKey: "customerEmail", id: "customer-email" },
    ] as const;

    const recipientFields = [
        { key: "firstName", label: t("checkout.first_name"), errorKey: "recipientFirstName", id: "recipient-firstName" },
        { key: "lastName", label: t("checkout.last_name"), errorKey: "recipientLastName", id: "recipient-lastName" },
        { key: "phone", label: t("checkout.phone"), errorKey: "recipientPhone", id: "recipient-phone" },
    ] as const;

    return (
        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3">
            {/* Customer Info */}
            <div className="rounded-xl bg-white p-4 shadow-lg">
                <h2 className="mb-4 text-xl font-bold">
                    {t("checkout.customer_title")}
                </h2>
                {customerFields.map(({ key, label, errorKey, id }) => (
                    <div key={key}>
                        <label htmlFor={id} className="mb-1 block text-sm font-medium">
                            {label}
                        </label>
                        <input
                            id={id}
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
                            <p className="mb-2 text-xs text-red-600" role="alert">{errors[errorKey]}</p>
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
                    {t("checkout.order_for_myself")}
                </label>
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        checked={pickup}
                        onChange={(e) => setPickup(e.target.checked)}
                        className="mr-2"
                    />
                    {t("checkout.pickup_myself")}
                </label>
                {pickup && (
                    <p className="mt-2 text-sm text-gray-500">
                        {t("checkout.pickup_address")}
                    </p>
                )}
            </div>

            {/* Recipient Info */}
            <div className="rounded-xl bg-white p-4 shadow-lg">
                <h2 className="mb-4 text-xl font-bold">
                    {t("checkout.recipient_title")}
                </h2>
                {recipientFields.map(({ key, label, errorKey, id }) => (
                    <div key={key}>
                        <label htmlFor={id} className="mb-1 block text-sm font-medium">
                            {label}
                        </label>
                        <input
                            id={id}
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
                            <p className="mb-2 text-xs text-red-600" role="alert">{errors[errorKey]}</p>
                        )}
                    </div>
                ))}
                <div>
                    <label htmlFor="recipient-address" className="mb-1 block text-sm font-medium">
                        {t("checkout.delivery_address")}
                    </label>
                    <input
                        id="recipient-address"
                        className={`mb-1 w-full border p-2 ${errors.recipientAddress ? "border-red-500" : ""}`}
                        placeholder={t("checkout.delivery_address")}
                        disabled={pickup}
                        value={recipient.address}
                        onChange={(e) =>
                            setRecipient({ ...recipient, address: e.target.value })
                        }
                    />
                    {errors.recipientAddress && (
                        <p className="mb-2 text-xs text-red-600" role="alert">{errors.recipientAddress}</p>
                    )}
                </div>
                <label htmlFor="recipient-date" className="mb-2 block text-sm font-medium">
                    {t("checkout.delivery_date")}
                </label>
                <div>
                    <input
                        id="recipient-date"
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
                        <p className="mb-2 text-xs text-red-600" role="alert">{errors.recipientDate}</p>
                    )}
                </div>
                <label htmlFor="recipient-time" className="mb-2 block text-sm font-medium">
                    {t("checkout.delivery_time")}
                </label>
                <div>
                    <input
                        id="recipient-time"
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
                                    recipientTime: t("checkout.delivery_time_range"),
                                }));
                            }
                        }}
                    />
                    {errors.recipientTime && (
                        <p className="mt-1 text-xs text-red-600" role="alert">{errors.recipientTime}</p>
                    )}
                </div>
            </div>

            {/* Cart Summary */}
            <div className="rounded-xl bg-white p-4 shadow-lg">
                <h2 className="mb-4 text-xl font-bold">{t("checkout.cart_title")}</h2>
                {items.length === 0 && (
                    <p className="mb-4 text-gray-500">{t("checkout.empty_cart")}</p>
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
                        <span>{t("checkout.delivery")}</span>
                        <span>{deliveryFee} kr</span>
                    </div>
                )}
                <div className="flex justify-between text-sm text-gray-500">
                    <span>{t("checkout.vat_included")}</span>
                    <span>{moms.toFixed(2)} kr</span>
                </div>
                <div className="mt-2 flex justify-between text-lg font-bold">
                    <span>{t("checkout.total")}</span>
                    <span>{total} kr</span>
                </div>
                {submitError && (
                    <p className="mt-2 text-sm text-red-600" role="alert">{submitError}</p>
                )}
                <button
                    className="mt-4 w-full rounded-lg bg-green-600 p-3 text-white disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={handlePay}
                    disabled={isLoading || items.length === 0}
                >
                    {isLoading ? t("checkout.processing") : t("checkout.pay")}
                </button>
            </div>
        </div>
    );
}
