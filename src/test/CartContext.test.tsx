import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { CartProvider, useCart } from "../contexts/CartContext";
import type { CartItem } from "../contexts/CartContext";
import type { ReactNode } from "react";

const wrapper = ({ children }: { children: ReactNode }) => (
    <CartProvider>{children}</CartProvider>
);

const makeItem = (overrides: Partial<CartItem> = {}): CartItem => ({
    id: "prod-1",
    name: "Rose Bouquet",
    picture: "https://img/rose.jpg",
    price: 299,
    quantity: 1,
    ...overrides,
});

describe("CartContext", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it("starts with an empty cart", () => {
        const { result } = renderHook(() => useCart(), { wrapper });
        expect(result.current.items).toEqual([]);
        expect(result.current.count).toBe(0);
    });

    it("adds an item to the cart", () => {
        const { result } = renderHook(() => useCart(), { wrapper });
        act(() => result.current.addItem(makeItem()));
        expect(result.current.items).toHaveLength(1);
        expect(result.current.items[0]!.name).toBe("Rose Bouquet");
        expect(result.current.count).toBe(1);
    });

    it("increases quantity when adding duplicate item", () => {
        const { result } = renderHook(() => useCart(), { wrapper });
        act(() => result.current.addItem(makeItem()));
        act(() => result.current.addItem(makeItem()));
        expect(result.current.items).toHaveLength(1);
        expect(result.current.items[0]!.quantity).toBe(2);
    });

    it("respects the item.quantity property when adding", () => {
        const { result } = renderHook(() => useCart(), { wrapper });
        act(() => result.current.addItem(makeItem({ quantity: 5 })));
        expect(result.current.items[0]!.quantity).toBe(5);
    });

    it("caps quantity at MAX_ITEM_QTY (99)", () => {
        const { result } = renderHook(() => useCart(), { wrapper });
        act(() => result.current.addItem(makeItem({ quantity: 100 })));
        expect(result.current.items[0]!.quantity).toBe(99);
    });

    it("removes an item from the cart", () => {
        const { result } = renderHook(() => useCart(), { wrapper });
        act(() => result.current.addItem(makeItem()));
        act(() => result.current.removeItem("prod-1"));
        expect(result.current.items).toHaveLength(0);
    });

    it("increases item quantity", () => {
        const { result } = renderHook(() => useCart(), { wrapper });
        act(() => result.current.addItem(makeItem()));
        act(() => result.current.increase("prod-1"));
        expect(result.current.items[0]!.quantity).toBe(2);
    });

    it("decreases item quantity", () => {
        const { result } = renderHook(() => useCart(), { wrapper });
        act(() => result.current.addItem(makeItem({ quantity: 3 })));
        act(() => result.current.decrease("prod-1"));
        expect(result.current.items[0]!.quantity).toBe(2);
    });

    it("removes item when quantity decreases to zero", () => {
        const { result } = renderHook(() => useCart(), { wrapper });
        act(() => result.current.addItem(makeItem({ quantity: 1 })));
        act(() => result.current.decrease("prod-1"));
        expect(result.current.items).toHaveLength(0);
    });

    it("clears all items", () => {
        const { result } = renderHook(() => useCart(), { wrapper });
        act(() => result.current.addItem(makeItem({ id: "a" })));
        act(() => result.current.addItem(makeItem({ id: "b" })));
        act(() => result.current.clearItems());
        expect(result.current.items).toHaveLength(0);
    });

    it("persists cart to localStorage", () => {
        const { result } = renderHook(() => useCart(), { wrapper });
        act(() => result.current.addItem(makeItem()));
        const stored = JSON.parse(localStorage.getItem("cartItems")!);
        expect(stored.items).toHaveLength(1);
        expect(stored.updatedAt).toBeTypeOf("number");
    });

    it("restores cart from localStorage", () => {
        const cart = {
            items: [makeItem()],
            updatedAt: Date.now(),
        };
        localStorage.setItem("cartItems", JSON.stringify(cart));
        const { result } = renderHook(() => useCart(), { wrapper });
        expect(result.current.items).toHaveLength(1);
    });

    it("handles corrupted localStorage gracefully", () => {
        localStorage.setItem("cartItems", "{invalid json");
        const { result } = renderHook(() => useCart(), { wrapper });
        expect(result.current.items).toEqual([]);
    });

    it("expires cart after TTL", () => {
        const cart = {
            items: [makeItem()],
            updatedAt: Date.now() - 8 * 24 * 60 * 60 * 1000, // 8 days ago
        };
        localStorage.setItem("cartItems", JSON.stringify(cart));
        const { result } = renderHook(() => useCart(), { wrapper });
        expect(result.current.items).toEqual([]);
    });

    it("supports legacy format (plain array)", () => {
        localStorage.setItem("cartItems", JSON.stringify([makeItem()]));
        const { result } = renderHook(() => useCart(), { wrapper });
        expect(result.current.items).toHaveLength(1);
    });

    it("throws when useCart is used outside CartProvider", () => {
        expect(() => {
            renderHook(() => useCart());
        }).toThrow("useCart must be used within CartProvider");
    });

    it("keeps two different custom wreaths as separate lines", () => {
        const { result } = renderHook(() => useCart(), { wrapper });
        act(() =>
            result.current.addItem(
                makeItem({
                    id: "wreath-a",
                    name: "Custom wreath",
                    designID: "a",
                    details: ["Small 25 cm · Fir"],
                }),
            ),
        );
        act(() =>
            result.current.addItem(
                makeItem({
                    id: "wreath-b",
                    name: "Custom wreath",
                    designID: "b",
                    details: ["Large 45 cm · Moss"],
                }),
            ),
        );
        expect(result.current.items).toHaveLength(2);
        expect(result.current.items[0]!.designID).toBe("a");
        expect(result.current.items[1]!.details).toEqual([
            "Large 45 cm · Moss",
        ]);
    });

    // The app mints a new designID per add, so this pins the reducer rule
    // (lines merge by id), not a user flow.
    it("merges cart lines by id, including wreath lines", () => {
        const { result } = renderHook(() => useCart(), { wrapper });
        const wreath = makeItem({ id: "wreath-a", designID: "a" });
        act(() => result.current.addItem(wreath));
        act(() => result.current.addItem(wreath));
        expect(result.current.items).toHaveLength(1);
        expect(result.current.items[0]!.quantity).toBe(2);
    });

    it("round-trips wreath fields through localStorage", () => {
        localStorage.setItem(
            "cartItems",
            JSON.stringify({
                items: [
                    makeItem({
                        id: "wreath-a",
                        designID: "a",
                        details: ["x", "y"],
                    }),
                ],
                updatedAt: Date.now(),
            }),
        );
        const { result } = renderHook(() => useCart(), { wrapper });
        expect(result.current.items[0]!.designID).toBe("a");
        expect(result.current.items[0]!.details).toEqual(["x", "y"]);
    });
});
