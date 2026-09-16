import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useCart } from "../../contexts/CartContext";
import { FREE_DELIVERY_THRESHOLD, DELIVERY_FEE } from "../../contexts/CartContext";
import { loadStripe } from "@stripe/stripe-js";
import { Link } from "react-router";
import api from "../../api/api";
import {
    AlertIcon,
    ArrowRightIcon,
    BagIcon,
    ChevronDownIcon,
    CloseIcon,
    FlowerOutline,
    LockIcon,
    MinusIcon,
    PlusIcon,
} from "../../components/Icons/Icons";
import { isAxiosError } from "axios";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormErrors {
    [key: string]: string;
}

const inputClass = (error?: string) =>
    `h-13 w-full rounded-xl border bg-surface px-4 text-[16px] text-ink transition-[border-color,box-shadow] duration-300 outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
        error
            ? "border-danger focus:ring-4 focus:ring-danger/10"
            : "border-field hover:border-ink-soft focus:border-ink focus:ring-4 focus:ring-primary/50"
    }`;

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
    autoComplete,
    inputMode,
}: {
    id: string;
    label: string;
    value: string;
    onChange: (v: string) => void;
    error?: string;
    disabled?: boolean;
    type?: string;
    min?: string;
    autoComplete?: string;
    inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
    return (
        <div>
            <label
                htmlFor={id}
                className="mb-2 block text-[11px] font-medium tracking-[0.16em] text-ink-soft uppercase"
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
                autoComplete={autoComplete}
                inputMode={inputMode}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${id}-error` : undefined}
                className={inputClass(error)}
            />
            {error && (
                <p
                    id={`${id}-error`}
                    className="mt-2 flex items-center gap-1.5 text-[13px] text-danger"
                    role="alert"
                >
                    <AlertIcon className="h-3.5 w-3.5 shrink-0" />
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
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className="flex min-h-11 w-full cursor-pointer items-center justify-between gap-4 text-left"
        >
            <span className="text-[15px] text-ink">{label}</span>
            <span
                className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-300 ${
                    checked ? "bg-ink" : "bg-line-strong"
                }`}
            >
                <span
                    className={`inline-block h-5 w-5 rounded-full bg-surface shadow-soft transition-transform duration-500 ease-luxe ${
                        checked ? "translate-x-6" : "translate-x-1"
                    }`}
                />
            </span>
        </button>
    );
}

/* ── Section header with step number ── */
function SectionHeader({ step, title }: { step: number; title: string }) {
    const { t } = useTranslation();

    return (
        <div className="mb-8 flex items-baseline gap-4 border-b border-line pb-5">
            <span
                className="price font-display text-[2.5rem] leading-none text-accent-ink"
                aria-hidden="true"
            >
                0{step}
            </span>
            <h2 className="font-display text-2xl leading-tight sm:text-3xl">
                <span className="sr-only">
                    {t("checkout.step_of", { step })}:{" "}
                </span>
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
        const firstError = Object.keys(validationErrors)[0];
        if (firstError) {
            // "customerFirstName" -> "#customer-firstName"; the pay button can be far below.
            const fieldId = firstError.replace(
                /^(customer|recipient)(\w)/,
                (_, group: string, c: string) => `${group}-${c.toLowerCase()}`,
            );
            document.getElementById(fieldId)?.focus();
            return;
        }

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

    const summaryItems = (
        <ul className="divide-y divide-line">
            {items.map((item) => (
                <li key={item.id} className="flex gap-4 py-4 first:pt-0">
                    <img
                        src={item.picture}
                        alt=""
                        className="h-20 w-16 shrink-0 rounded-[2px] bg-blush-deep object-cover"
                    />
                    <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-3">
                            <p className="font-display text-[17px] leading-tight">
                                {item.name}
                            </p>
                            <button
                                type="button"
                                onClick={() => removeItem(item.id)}
                                className="-mt-3 -mr-3 flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center text-muted transition-colors hover:text-danger"
                                aria-label={`${t("cart.remove")} ${item.name}`}
                            >
                                <CloseIcon className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="mt-auto flex items-center justify-between pt-2">
                            <div className="flex h-8 items-center rounded-full border border-line-strong">
                                <button
                                    type="button"
                                    onClick={() => decrease(item.id)}
                                    className="flex h-full w-8 cursor-pointer items-center justify-center text-ink-soft hover:text-ink"
                                    aria-label={t("cart.decrease", {
                                        name: item.name,
                                    })}
                                >
                                    <MinusIcon className="h-3 w-3" />
                                </button>
                                <span className="price w-5 text-center text-[13px]">
                                    {item.quantity}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => increase(item.id)}
                                    className="flex h-full w-8 cursor-pointer items-center justify-center text-ink-soft hover:text-ink"
                                    aria-label={t("cart.increase", {
                                        name: item.name,
                                    })}
                                >
                                    <PlusIcon className="h-3 w-3" />
                                </button>
                            </div>
                            <span className="price text-sm">
                                {(item.price * item.quantity).toLocaleString(
                                    "sv-SE",
                                )}{" "}
                                kr
                            </span>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );

    const formatKr = (n: number) => `${n.toLocaleString("sv-SE")} kr`;

    /* ── Empty cart state ── */
    if (items.length === 0) {
        return (
            <div className="container-luxe flex min-h-[65dvh] flex-col items-center justify-center py-16 text-center">
                <title>{t("seo.checkout_title")}</title>
                <FlowerOutline className="h-20 w-20" />
                <h1 className="mt-8 font-display text-4xl sm:text-5xl">
                    {t("checkout.empty_cart")}
                </h1>
                <p className="mt-3 max-w-xs text-[15px] text-ink-soft">
                    {t("checkout.empty_cart_hint")}
                </p>
                <Link
                    to="/Catalog"
                    className="group mt-10 inline-flex h-14 items-center gap-5 rounded-full bg-ink pr-2 pl-7 text-[12px] font-medium tracking-[0.18em] text-blush uppercase active:scale-[0.98]"
                >
                    {t("checkout.browse_catalog")}
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-ink transition-transform duration-500 ease-luxe group-hover:translate-x-1">
                        <ArrowRightIcon className="h-4 w-4" />
                    </span>
                </Link>
            </div>
        );
    }

    return (
        <div className="container-luxe pt-8 md:pt-12">
            <title>{t("seo.checkout_title")}</title>

            <h1 className="animate-rise font-display text-[3rem] leading-none font-medium tracking-[-0.03em] sm:text-7xl">
                {t("checkout.page_title")}
            </h1>

            {/* Mobile: collapsible summary */}
            <details className="group mt-8 rounded-2xl border border-line bg-surface lg:hidden">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 [&::-webkit-details-marker]:hidden">
                    <span className="flex items-center gap-2 text-[13px] text-ink">
                        <BagIcon className="h-4 w-4" />
                        {t("checkout.show_summary")}
                        <ChevronDownIcon className="h-4 w-4 transition-transform duration-300 group-open:rotate-180" />
                    </span>
                    <span className="price font-display text-xl">
                        {formatKr(total)}
                    </span>
                </summary>
                <div className="border-t border-line px-5 py-5">{summaryItems}</div>
            </details>

            <div className="mt-8 grid grid-cols-1 gap-10 md:mt-12 lg:grid-cols-12 lg:gap-16">
                {/* ── LEFT: Form sections ── */}
                <div className="space-y-14 lg:col-span-7">
                    <section>
                        <SectionHeader
                            step={1}
                            title={t("checkout.customer_title")}
                        />

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <FormInput
                                id="customer-firstName"
                                label={t("checkout.first_name")}
                                value={customer.firstName}
                                onChange={(v) =>
                                    setCustomer({ ...customer, firstName: v })
                                }
                                error={errors.customerFirstName}
                                autoComplete="given-name"
                            />
                            <FormInput
                                id="customer-lastName"
                                label={t("checkout.last_name")}
                                value={customer.lastName}
                                onChange={(v) =>
                                    setCustomer({ ...customer, lastName: v })
                                }
                                error={errors.customerLastName}
                                autoComplete="family-name"
                            />
                            <FormInput
                                id="customer-phone"
                                label={t("checkout.phone")}
                                value={customer.phone}
                                onChange={(v) =>
                                    setCustomer({ ...customer, phone: v })
                                }
                                error={errors.customerPhone}
                                type="tel"
                                autoComplete="tel"
                            />
                            <FormInput
                                id="customer-email"
                                label={t("checkout.email")}
                                value={customer.email}
                                onChange={(v) =>
                                    setCustomer({ ...customer, email: v })
                                }
                                error={errors.customerEmail}
                                inputMode="email"
                                autoComplete="email"
                            />
                        </div>

                        <div className="mt-6 rounded-xl bg-blush-deep/60 px-5 py-2">
                            <Toggle
                                checked={orderForMyself}
                                onChange={setOrderForMyself}
                                label={t("checkout.order_for_myself")}
                            />
                        </div>
                    </section>

                    <section>
                        <SectionHeader
                            step={2}
                            title={t("checkout.recipient_title")}
                        />

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            {needsRecipient && (
                                <>
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
                                    <div className="sm:col-span-2">
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
                                            type="tel"
                                        />
                                    </div>
                                </>
                            )}

                            <div className="sm:col-span-2">
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
                                    autoComplete="street-address"
                                />
                            </div>

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
                                    className="mb-2 block text-[11px] font-medium tracking-[0.16em] text-ink-soft uppercase"
                                >
                                    {t("checkout.delivery_time")}
                                </label>
                                <input
                                    id="recipient-time"
                                    type="time"
                                    value={recipient.time}
                                    aria-invalid={Boolean(errors.recipientTime)}
                                    aria-describedby="recipient-time-hint"
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
                                    className={inputClass(errors.recipientTime)}
                                />
                                {errors.recipientTime ? (
                                    <p
                                        id="recipient-time-hint"
                                        className="mt-2 flex items-center gap-1.5 text-[13px] text-danger"
                                        role="alert"
                                    >
                                        <AlertIcon className="h-3.5 w-3.5 shrink-0" />
                                        {errors.recipientTime}
                                    </p>
                                ) : (
                                    <p
                                        id="recipient-time-hint"
                                        className="mt-2 text-[13px] text-muted"
                                    >
                                        {t("checkout.delivery_time_range")}
                                    </p>
                                )}
                            </div>
                        </div>
                    </section>
                </div>

                {/* ── RIGHT: Order summary (sticky) ── */}
                <aside className="lg:col-span-5">
                    <div className="rounded-[1.75rem] bg-surface p-6 shadow-soft sm:p-8 lg:sticky lg:top-36">
                        <h2 className="hidden font-display text-2xl lg:block">
                            {t("checkout.cart_title")}
                        </h2>
                        <div className="hidden lg:mt-6 lg:block">
                            {summaryItems}
                        </div>

                        <dl className="space-y-2.5 text-sm lg:mt-6 lg:border-t lg:border-line lg:pt-6">
                            <div className="flex justify-between text-ink-soft">
                                <dt>{t("checkout.subtotal")}</dt>
                                <dd className="price">{formatKr(subtotal)}</dd>
                            </div>
                            <div className="flex justify-between text-ink-soft">
                                <dt>{t("checkout.delivery")}</dt>
                                <dd className="price">
                                    {subtotal >= FREE_DELIVERY_THRESHOLD
                                        ? t("cart.free_delivery")
                                        : formatKr(deliveryFee)}
                                </dd>
                            </div>
                            <div className="flex justify-between text-muted">
                                <dt>{t("checkout.vat_included")}</dt>
                                <dd className="price">{moms.toFixed(2)} kr</dd>
                            </div>
                            <div className="flex items-baseline justify-between border-t border-line pt-4">
                                <dt className="eyebrow text-ink">
                                    {t("checkout.total")}
                                </dt>
                                <dd className="price font-display text-3xl">
                                    {formatKr(total)}
                                </dd>
                            </div>
                        </dl>

                        {submitError && (
                            <div
                                className="mt-5 flex gap-2.5 rounded-xl bg-danger/8 px-4 py-3 text-sm text-danger"
                                role="alert"
                            >
                                <AlertIcon className="mt-0.5 h-4 w-4 shrink-0" />
                                {submitError}
                            </div>
                        )}

                        <button
                            type="button"
                            className="mt-6 flex h-14 w-full cursor-pointer items-center justify-center gap-3 rounded-full bg-ink text-[12px] font-medium tracking-[0.18em] text-blush uppercase transition-[background-color,transform] duration-300 hover:bg-ink-soft active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                            onClick={handlePay}
                            disabled={isLoading || items.length === 0}
                            aria-busy={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="h-4 w-4 animate-spin rounded-full border-[1.5px] border-blush/30 border-t-blush" />
                                    {t("checkout.processing")}
                                </>
                            ) : (
                                <>
                                    <LockIcon className="h-4 w-4" />
                                    {t("checkout.pay")}
                                </>
                            )}
                        </button>

                        <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-muted">
                            <LockIcon className="h-3.5 w-3.5" />
                            {t("checkout.secure_payment")}
                        </p>
                    </div>
                </aside>
            </div>
        </div>
    );
}
