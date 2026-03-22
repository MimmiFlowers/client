import { createContext, useContext, useEffect, useState } from "react";

export interface CartItem {
    id: string;
    name: string;
    picture: string;
    price: number;
    quantity: number;
}

interface StoredCart {
    items: CartItem[];
    updatedAt: number;
}

interface CartContextType {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    increase: (id: string) => void;
    decrease: (id: string) => void;
    count: number;
    clearItems: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Cart expires after 7 days of inactivity
const CART_TTL_MS = 7 * 24 * 60 * 60 * 1000;

// Delivery fee constants — shared across CartDropdown & CheckOutPage
export const FREE_DELIVERY_THRESHOLD = 999;
export const DELIVERY_FEE = 99;

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const MAX_ITEM_QTY = 99;

    const [items, setItems] = useState<CartItem[]>(() => {
        try {
            const stored = localStorage.getItem("cartItems");
            if (!stored) return [];

            const parsed: unknown = JSON.parse(stored);

            // Support legacy format (plain array) and new format (object with updatedAt)
            if (Array.isArray(parsed)) return parsed;

            const cart = parsed as StoredCart;
            if (!cart.items || !Array.isArray(cart.items)) return [];

            // Expire cart if stale
            if (Date.now() - cart.updatedAt > CART_TTL_MS) {
                localStorage.removeItem("cartItems");
                return [];
            }

            return cart.items;
        } catch {
            return [];
        }
    });

    useEffect(() => {
        const cart: StoredCart = { items, updatedAt: Date.now() };
        localStorage.setItem("cartItems", JSON.stringify(cart));
    }, [items]);

    const addItem = (item: CartItem) => {
        setItems((prev) => {
            const existing = prev.find((p) => p.id === item.id);
            if (existing) {
                const newQty = Math.min(
                    existing.quantity + (item.quantity || 1),
                    MAX_ITEM_QTY,
                );
                return prev.map((p) =>
                    p.id === item.id ? { ...p, quantity: newQty } : p,
                );
            }
            return [
                ...prev,
                { ...item, quantity: Math.min(item.quantity || 1, MAX_ITEM_QTY) },
            ];
        });
    };

    const removeItem = (id: string) => {
        setItems((prev) => prev.filter((p) => p.id !== id));
    };

    const increase = (id: string) => {
        setItems((prev) =>
            prev.map((p) =>
                p.id === id
                    ? { ...p, quantity: Math.min(p.quantity + 1, MAX_ITEM_QTY) }
                    : p,
            ),
        );
    };

    const decrease = (id: string) => {
        setItems((prev) =>
            prev
                .map((p) =>
                    p.id === id ? { ...p, quantity: p.quantity - 1 } : p,
                )
                .filter((p) => p.quantity > 0),
        );
    };

    const count = items.reduce((acc, item) => acc + item.quantity, 0);

    const clearItems = () => setItems([]);

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                increase,
                decrease,
                count,
                clearItems,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used within CartProvider");
    return ctx;
};
