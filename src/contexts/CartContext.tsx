import { createContext, useContext, useEffect, useState } from "react";

export interface CartItem {
    id: string;
    name: string;
    picture: string;
    price: number;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    increase: (id: string) => void;
    decrease: (id: string) => void;
    count: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>(() => {
        const stored = localStorage.getItem('cartItems');
        return stored ? JSON.parse(stored) : [];
    });

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(items));
    }, [items]);

    const addItem = (item: CartItem) => {
        setItems(prev => {
            const existing = prev.find(p => p.id === item.id);
            if (existing) {
                return prev.map(p => p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p);
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    const removeItem = (id: string) => {
        setItems(prev => prev.filter(p => p.id !== id));
    };

    const increase = (id: string) => {
        setItems(prev =>
            prev.map(p => p.id === id ? { ...p, quantity: p.quantity + 1 } : p)
        );
    };

    const decrease = (id: string) => {
        setItems(prev =>
            prev.map(p => p.id === id ? { ...p, quantity: p.quantity - 1 } : p)
                .filter(p => p.quantity > 0)
        );
    };

    const count = items.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, increase, decrease, count }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used within CartProvider");
    return ctx;
};