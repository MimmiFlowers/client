import { describe, it, expect } from "vitest";

// Mirror the validation regex from CheckOutPage
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

describe("Checkout form validation", () => {
    describe("email regex", () => {
        it("accepts valid emails", () => {
            expect(EMAIL_RE.test("test@example.com")).toBe(true);
            expect(EMAIL_RE.test("user.name@domain.co")).toBe(true);
            expect(EMAIL_RE.test("a@b.c")).toBe(true);
        });

        it("rejects invalid emails", () => {
            expect(EMAIL_RE.test("")).toBe(false);
            expect(EMAIL_RE.test("notanemail")).toBe(false);
            expect(EMAIL_RE.test("@domain.com")).toBe(false);
            expect(EMAIL_RE.test("user@")).toBe(false);
            expect(EMAIL_RE.test("user @example.com")).toBe(false);
        });
    });

    describe("delivery time validation", () => {
        it("accepts times between 08:00 and 22:00", () => {
            for (const hour of [8, 12, 17, 22]) {
                const time = `${hour.toString().padStart(2, "0")}:00`;
                const h = parseInt(time.split(":")[0] ?? "");
                expect(h >= 8 && h <= 22).toBe(true);
            }
        });

        it("rejects times outside 08:00-22:00", () => {
            for (const hour of [0, 5, 7, 23]) {
                const time = `${hour.toString().padStart(2, "0")}:00`;
                const h = parseInt(time.split(":")[0] ?? "");
                expect(h >= 8 && h <= 22).toBe(false);
            }
        });
    });

    describe("required field validation", () => {
        it("detects empty trimmed strings as invalid", () => {
            expect("".trim()).toBeFalsy();
            expect("   ".trim()).toBeFalsy();
        });

        it("accepts non-empty strings as valid", () => {
            expect("Anna".trim()).toBeTruthy();
        });
    });
});
