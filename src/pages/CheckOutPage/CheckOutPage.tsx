import { useState, useMemo } from "react";
import { useCart } from "../../contexts/CartContext";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

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

    const subtotal = useMemo(
        () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        [items],
    );
    const deliveryFee = pickup ? 0 : 99;
    const total = subtotal + deliveryFee;
    const moms = total * 0.25;

    const apiUrl = import.meta.env.VITE_API_URL;

    const handlePay = async () => {
        try {
            const stripe = await stripePromise;
            if (!stripe) return;

            const orderID = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

            const orderData = {
                orderID,
                customer,
                recipient: pickup ? null : recipient,
                pickup,
                orderForMyself,
                items,
                subtotal,
                deliveryFee,
                total,
                moms,
            };

            const itemsForStripe = [
                ...items.map((item) => ({
                    name: item.name,
                    price: Number(item.price) * 100,
                    quantity: item.quantity,
                })),
                ...(!pickup
                    ? [
                          {
                              name: "Delivery Fee",
                              price: deliveryFee * 100,
                              quantity: 1,
                          },
                      ]
                    : []),
            ];

            console.log("Order Data:", orderData);

            console.log(
                "Data:",
                JSON.stringify({ items: itemsForStripe, orderData: orderData }),
            );

            const response = await axios.post(
                `${apiUrl}/stripe/create_checkout_session`,
                JSON.stringify({ items: itemsForStripe, orderData: orderData }),
                { headers: { "Content-Type": "application/json" } },
            );
            const session = response.data;

            const result = await stripe.redirectToCheckout({
                sessionId: session.session.id,
            });

            if (result.error) {
                alert(result.error.message);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error(
                    "Request Error:",
                    error.response?.data || error.message,
                );
            } else {
                console.error("Error:", error);
            }
        }
    };

    return (
        <div className="grid grid-cols-3 gap-6 p-6">
            {/* Customer Info */}
            <div className="rounded-xl bg-white p-4 shadow-lg">
                <h2 className="mb-4 text-xl font-bold">
                    Information of the customer
                </h2>
                {["firstName", "lastName", "phone", "email"].map((field) => (
                    <input
                        key={field}
                        className="mb-2 w-full border p-2"
                        placeholder={field}
                        value={(customer as any)[field]}
                        onChange={(e) =>
                            setCustomer({
                                ...customer,
                                [field]: e.target.value,
                            })
                        }
                    />
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
                {["firstName", "lastName", "phone"].map((field) => (
                    <input
                        key={field}
                        className="mb-2 w-full border p-2"
                        placeholder={field}
                        disabled={orderForMyself || pickup}
                        value={(recipient as any)[field]}
                        onChange={(e) =>
                            setRecipient({
                                ...recipient,
                                [field]: e.target.value,
                            })
                        }
                    />
                ))}
                <input
                    className="mb-2 w-full border p-2"
                    placeholder="Delivery address"
                    disabled={pickup}
                    value={recipient.address}
                    onChange={(e) =>
                        setRecipient({ ...recipient, address: e.target.value })
                    }
                />
                <label className="mb-2 block">Delivery date</label>
                <input
                    type="date"
                    className="mb-2 w-full border p-2"
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
                <label className="mb-2 block">Time of delivery</label>
                <input
                    type="time"
                    className="w-full border p-2"
                    value={recipient.time}
                    onChange={(e) => {
                        const hour = parseInt(e.target.value.split(":")[0]);
                        if (hour >= 8 && hour <= 22)
                            setRecipient({
                                ...recipient,
                                time: e.target.value,
                            });
                        else alert("Delivery time is only from 08:00 to 22:00");
                    }}
                />
            </div>

            {/* Cart Summary */}
            <div className="rounded-xl bg-white p-4 shadow-lg">
                <h2 className="mb-4 text-xl font-bold">Cart</h2>
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
                <button
                    className="mt-4 w-full rounded-lg bg-green-600 p-3 text-white"
                    onClick={handlePay}
                >
                    Pay
                </button>
            </div>
        </div>
    );
}
