import { useEffect, useRef } from "react";

const FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Modal overlay behaviour: Escape closes, Tab is trapped inside the panel,
 * page scroll is locked, and focus returns to the opener on close.
 */
export function useOverlay<T extends HTMLElement>(
    open: boolean,
    onClose: () => void,
) {
    const panelRef = useRef<T>(null);
    const onCloseRef = useRef(onClose);
    onCloseRef.current = onClose;

    useEffect(() => {
        if (!open) return;

        const opener = document.activeElement as HTMLElement | null;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const focusFirst = window.setTimeout(() => {
            panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
        }, 60);

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onCloseRef.current();
                return;
            }
            if (e.key !== "Tab" || !panelRef.current) return;

            const focusable =
                panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE);
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (!first || !last) return;

            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            window.clearTimeout(focusFirst);
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = previousOverflow;
            opener?.focus?.();
        };
    }, [open]);

    return panelRef;
}
