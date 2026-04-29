import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useCart } from "../../contexts/CartContext";
import { FREE_DELIVERY_THRESHOLD, DELIVERY_FEE } from "../../contexts/CartContext";
import { loadStripe } from "@stripe/stripe-js";
import { Link } from "react-router";
import api from "../../api/api";
import { isAxiosError } from "axios";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormErrors {
    [key: string]: string;
}

/* ── Reusable styled input ── */
function FormInput({
    id,
    label,
    value,
    onChange,
    error,
    disabled,
    type = "text",
    min,
}: {
    id: string;
    label: string;
    value: string;
    onChange: (v: string) => void;
    error?: string;
    disabled?: boolean;
    type?: string;
    min?: string;
}) {
    return (
        <div>
            <label
                htmlFor={id}
                className="mb-1.5 block text-xs font-medium tracking-wide text-gray-500 uppercase"
            >
                {label}
            </label>
            <input
                id={id}
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                min={min}
                className={`w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-gray-900 transition-all duration-200 outline-none placeholder:text-gray-300 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400 ${
                    error
                        ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                        : "border-gray-200 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/30"
                }`}
                placeholder={label}
            />
            {error && (
                <p className="mt-1 text-xs text-red-500" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}

/* ── Toggle switch ── */
function Toggle({
    checked,
    onChange,
    label,
}: {
    checked: boolean;
    onChange: (v: boolean) => void;
    label: string;
}) {
    return (
        <label className="flex cursor-pointer items-center gap-3">
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                onClick={() => onChange(!checked)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ${
                    checked ? "bg-[var(--color-accent)]" : "bg-gray-200"
                }`}
            >
                <span
                    className={`pointer-events-none inline-block h-4 w-4 translate-y-0.5 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ${
                        checked ? "translate-x-4.5" : "translate-x-0.5"
                    }`}
                />
            </button>
            <span className="text-sm text-gray-700">{label}</span>
        </label>
    );
}

/* ── Section header with step number ── */
function SectionHeader({ step, title }: { step: number; title: string }) {
    return (
        <div className="mb-5 flex items-center gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)]/40 text-xs font-semibold text-gray-700">
                {step}
            </span>
            <h2 className="text-base font-semibold tracking-wide text-gray-900 uppercase">
                {title}
            </h2>
        </div>
    );
}

export default function CheckoutPage() {
    const { items, increase, decrease, removeItem } = useCart();
    const { t, i18n } = useTranslation();

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
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [submitError, setSubmitError] = useState("");

    const subtotal = useMemo(
        () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        [items],
    );
    const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
    const total = subtotal + deliveryFee;
    const moms = Math.round(total * 0.25);

    const needsRecipient = !orderForMyself;

    const validate = (): FormErrors => {
        const errs: FormErrors = {};

        if (!customer.firstName.trim())
            errs.customerFirstName = t("checkout.errors.first_name");
        if (!customer.lastName.trim())
            errs.customerLastName = t("checkout.errors.last_name");
        if (!customer.phone.trim())
            errs.customerPhone = t("checkout.errors.phone");
        if (!customer.email.trim()) {
            errs.customerEmail = t("checkout.errors.email_required");
        } else if (!EMAIL_RE.test(customer.email)) {
            errs.customerEmail = t("checkout.errors.email_invalid");
        }

        if (needsRecipient) {
            if (!recipient.firstName.trim())
                errs.recipientFirstName = t(
                    "checkout.errors.recipient_first_name",
                );
            if (!recipient.lastName.trim())
                errs.recipientLastName = t(
                    "checkout.errors.recipient_last_name",
                );
            if (!recipient.phone.trim())
                errs.recipientPhone = t("checkout.errors.recipient_phone");
        }

        if (!recipient.address.trim())
            errs.recipientAddress = t("checkout.errors.delivery_address");

        // Date and time are always required
        if (!recipient.date)
            errs.recipientDate = t("checkout.errors.delivery_date");
        if (!recipient.time)
            errs.recipientTime = t("checkout.errors.delivery_time");

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
                orderID: "placeholder",
                locale: i18n.language,
                customer,
                recipient: {
                    ...(needsRecipient
                        ? {
                              firstName: recipient.firstName,
                              lastName: recipient.lastName,
                              phone: recipient.phone,
                          }
                        : {
                              firstName: customer.firstName,
                              lastName: customer.lastName,
                              phone: customer.phone,
                          }),
                    address: recipient.address,
                    date: recipient.date,
                    time: recipient.time,
                },
                pickup: false,
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

            const response = await api.post("/stripe/create_checkout_session", {
                items: itemsForStripe,
                orderData,
            });
            const session = response.data;

            const result = await stripe.redirectToCheckout({
                sessionId: session.session.id,
            });

            if (result.error) {
                setSubmitError(
                    result.error.message ||
                        t("checkout.errors.payment_redirect"),
                );
            }
        } catch (error) {
            if (isAxiosError(error)) {
                setSubmitError(
                    error.response?.data?.detail ||
                        t("checkout.errors.checkout_session"),
                );
            } else {
                setSubmitError(t("checkout.errors.unexpected"));
            }
        } finally {
            setIsLoading(false);
        }
    };

    const tomorrowISO =
        new Date(Date.now() + 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0] ?? "";

    /* ── Empty cart state ── */
    if (items.length === 0) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
                <title>{t("seo.checkout_title")}</title>
                <svg
                    className="mb-6 h-16 w-16 text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                </svg>
                <p className="mb-2 text-lg font-medium text-gray-700">
                    {t("checkout.empty_cart")}
                </p>
                <p className="mb-6 text-sm text-gray-400">
                    {t("checkout.empty_cart_hint")}
                </p>
                <Link
                    to="/Catalog"
                    className="rounded-full bg-gray-900 px-8 py-2.5 text-sm font-medium tracking-wider text-white uppercase transition-opacity duration-300 hover:opacity-80"
                >
                    {t("checkout.browse_catalog")}
                </Link>
            </div>
        );
    }

    return (
        <div className="mx-auto w-[95%] py-8 sm:w-[90%] md:w-[85%] lg:w-[80%]">
            <title>{t("seo.checkout_title")}</title>

            {/* Page title */}
            <h1 className="mb-8 text-center text-xl font-light tracking-[0.15em] text-gray-900 uppercase sm:text-2xl">
                {t("checkout.page_title")}
            </h1>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
                {/* ── LEFT: Form sections ── */}
                <div className="space-y-6 lg:col-span-3">
                    {/* Step 1: Customer info */}
                    <section className="rounded-2xl bg-white/70 p-6 backdrop-blur-sm sm:p-8">
                        <SectionHeader
                            step={1}
                            title={t("checkout.customer_title")}
                        />

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <FormInput
                                id="customer-firstName"
                                label={t("checkout.first_name")}
                                value={customer.firstName}
                                onChange={(v) =>
                                    setCustomer({ ...customer, firstName: v })
                                }
                                error={errors.customerFirstName}
                            />
                            <FormInput
                                id="customer-lastName"
                                label={t("checkout.last_name")}
                                value={customer.lastName}
                                onChange={(v) =>
                                    setCustomer({ ...customer, lastName: v })
                                }
                                error={errors.customerLastName}
                            />
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <FormInput
                                id="customer-phone"
                                label={t("checkout.phone")}
                                value={customer.phone}
                                onChange={(v) =>
                                    setCustomer({ ...customer, phone: v })
                                }
                                error={errors.customerPhone}
                            />
                            <FormInput
                                id="customer-email"
                                label={t("checkout.email")}
                                value={customer.email}
                                onChange={(v) =>
                                    setCustomer({ ...customer, email: v })
                                }
                                error={errors.customerEmail}
                            />
                        </div>

                        {/* Toggles */}
                        <div className="mt-6 space-y-3 border-t border-gray-100 pt-5">
                            <Toggle
                                checked={orderForMyself}
                                onChange={setOrderForMyself}
                                label={t("checkout.order_for_myself")}
                            />
                        </div>
                    </section>

                    {/* Step 2: Delivery / Recipient info */}
                    <section className="rounded-2xl bg-white/70 p-6 backdrop-blur-sm sm:p-8">
                        <SectionHeader
                            step={2}
                            title={t("checkout.recipient_title")}
                        />

                        {/* Recipient name & phone — hidden when ordering for yourself */}
                        {needsRecipient && (
                            <>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <FormInput
                                        id="recipient-firstName"
                                        label={t("checkout.first_name")}
                                        value={recipient.firstName}
                                        onChange={(v) =>
                                            setRecipient({
                                                ...recipient,
                                                firstName: v,
                                            })
                                        }
                                        error={errors.recipientFirstName}
                                    />
                                    <FormInput
                                        id="recipient-lastName"
                                        label={t("checkout.last_name")}
                                        value={recipient.lastName}
                                        onChange={(v) =>
                                            setRecipient({
                                                ...recipient,
                                                lastName: v,
                                            })
                                        }
                                        error={errors.recipientLastName}
                                    />
                                </div>

                                <div className="mt-4">
                                    <FormInput
                                        id="recipient-phone"
                                        label={t("checkout.phone")}
                                        value={recipient.phone}
                                        onChange={(v) =>
                                            setRecipient({
                                                ...recipient,
                                                phone: v,
                                            })
                                        }
                                        error={errors.recipientPhone}
                                    />
                                </div>
                            </>
                        )}

                        {/* Delivery address */}
                        <div className={needsRecipient ? "mt-4" : ""}>
                            <FormInput
                                id="recipient-address"
                                label={t("checkout.delivery_address")}
                                value={recipient.address}
                                onChange={(v) =>
                                    setRecipient({
                                        ...recipient,
                                        address: v,
                                    })
                                }
                                error={errors.recipientAddress}
                            />
                        </div>

                        {/* Date & Time — always visible */}
                        <div
                            className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2"
                        >
                            <FormInput
                                id="recipient-date"
                                label={t("checkout.delivery_date")}
                                value={recipient.date}
                                onChange={(v) =>
                                    setRecipient({ ...recipient, date: v })
                                }
                                error={errors.recipientDate}
                                type="date"
                                min={tomorrowISO}
                            />
                            <div>
                                <label
                                    htmlFor="recipient-time"
                                    className="mb-1.5 block text-xs font-medium tracking-wide text-gray-500 uppercase"
                                >
                                    {t("checkout.delivery_time")}
                                </label>
                                <input
                                    id="recipient-time"
                                    type="time"
                                    value={recipient.time}
                                    onChange={(e) => {
                                        const hourStr =
                                            e.target.value.split(":")[0];
                                        const hour = hourStr
                                            ? parseInt(hourStr)
                                            : NaN;
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
                                                recipientTime: t(
                                                    "checkout.delivery_time_range",
                                                ),
                                            }));
                                        }
                                    }}
                                    className={`w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-gray-900 transition-all duration-200 outline-none ${
                                        errors.recipientTime
                                            ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                                            : "border-gray-200 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/30"
                                    }`}
                                />
                                {errors.recipientTime && (
                                    <p
                                        className="mt-1 text-xs text-red-500"
                                        role="alert"
                                    >
                                        {errors.recipientTime}
                                    </p>
                                )}
                                <p className="mt-1 text-[11px] text-gray-400">
                                    {t("checkout.delivery_time_range")}
                                </p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* ── RIGHT: Order summary (sticky) ── */}
                <aside className="lg:col-span-2">
                    <div className="sticky top-20 rounded-2xl bg-white/70 p-6 backdrop-blur-sm sm:p-8">
                        <h2 className="mb-5 text-base font-semibold tracking-wide text-gray-900 uppercase">
                            {t("checkout.cart_title")}
                        </h2>

                        {/* Cart items */}
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-3">
                                    <img
                                        src={item.picture}
                                        alt={item.name}
                                        className="h-16 w-16 shrink-0 rounded-lg object-cover"
                                    />
                                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                                        <div className="flex items-start justify-between gap-2">
                                            <p className="truncate text-sm font-medium text-gray-900">
                                                {item.name}
                                            </p>
                                            <button
                                                onClick={() =>
                                                    removeItem(item.id)
                                                }
                                                className="shrink-0 cursor-pointer text-gray-300 transition-colors hover:text-gray-500"
                                                aria-label={`Remove ${item.name}`}
                                            >
                                                <svg
                                                    className="h-4 w-4"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth={1.5}
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M6 18L18 6M6 6l12 12"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() =>
                                                        decrease(item.id)
                                                    }
                                                    className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-gray-200 text-xs text-gray-500 transition-colors hover:border-gray-400 hover:text-gray-700"
                                                    aria-label="Decrease quantity"
                                                >
                                                    -
                                                </button>
                                                <span className="min-w-[1.25rem] text-center text-sm text-gray-700">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        increase(item.id)
                                                    }
                                                    className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-gray-200 text-xs text-gray-500 transition-colors hover:border-gray-400 hover:text-gray-700"
                                                    aria-label="Increase quantity"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <span className="text-sm font-medium text-gray-900">
                                                {item.price * item.quantity} kr
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Totals */}
                        <div className="mt-6 space-y-2 border-t border-gray-100 pt-5">
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>{t("checkout.subtotal")}</span>
                                <span>{subtotal} kr</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>{t("checkout.delivery")}</span>
                                <span>
                                    {subtotal >= FREE_DELIVERY_THRESHOLD
                                        ? t("cart.free_delivery")
                                        : `${deliveryFee} kr`}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-400">
                                <span>{t("checkout.vat_included")}</span>
                                <span>{moms.toFixed(2)} kr</span>
                            </div>
                            <div className="flex justify-between border-t border-gray-100 pt-3 text-base font-semibold text-gray-900">
                                <span>{t("checkout.total")}</span>
                                <span>{total} kr</span>
                            </div>
                        </div>

                        {/* Error */}
                        {submitError && (
                            <div
                                className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600"
                                role="alert"
                            >
                                {submitError}
                            </div>
                        )}

                        {/* Pay button */}
                        <button
                            className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-gray-900 py-3.5 text-sm font-medium tracking-wider text-white uppercase transition-opacity duration-300 hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
                            onClick={handlePay}
                            disabled={isLoading || items.length === 0}
                        >
                            {isLoading ? (
                                <>
                                    <svg
                                        className="h-4 w-4 animate-spin"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                        />
                                    </svg>
                                    {t("checkout.processing")}
                                </>
                            ) : (
                                <>
                                    <svg
                                        className="h-4 w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={1.5}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                        />
                                    </svg>
                                    {t("checkout.pay")}
                                </>
                            )}
                        </button>

                        {/* Trust signal */}
                        <p className="mt-4 text-center text-[11px] text-gray-400">
                            <svg
                                className="mr-1 inline h-3 w-3"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                />
                            </svg>
                            {t("checkout.secure_payment")}
                        </p>
                    </div>
                </aside>
            </div>
        </div>
    );
}
