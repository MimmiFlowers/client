import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent, RefObject } from "react";
import type { WreathDecoration } from "./types";
import {
    DROP_RADIUS,
    nearestSlot,
    slotPositions,
    slotRadius,
} from "./wreathGeometry";

export interface DragGhost {
    code: string;
    image: string;
    x: number;
    y: number;
}

interface DragStart {
    code: string;
    image: string;
    x: number;
    y: number;
    pointerId: number;
}

const DRAG_THRESHOLD_PX = 8;

/**
 * Drag a tray decoration onto the stage. Works for mouse, pen and touch
 * (tray buttons use `touch-none`). A movement under 8px stays a tap, which the
 * button's onClick handles; a real drag suppresses that click via consumeDragClick().
 *
 * Contract: the stage must be rendered with its natural aspect (no forced
 * height); the ghost is rendered by the page as `fixed` with
 * `pointer-events-none`; `onDrop` may change identity freely.
 */
export const useDragToSlot = (
    stageRef: RefObject<SVGSVGElement | null>,
    slotCount: number,
    ring: number,
    onDrop: (slot: number, code: string) => void,
) => {
    const [ghost, setGhost] = useState<DragGhost | null>(null);
    const startRef = useRef<DragStart | null>(null);
    const draggingRef = useRef(false);
    const endedDragRef = useRef(false);
    const onDropRef = useRef(onDrop);

    useEffect(() => {
        onDropRef.current = onDrop;
    }, [onDrop]);

    const onPointerDown = useCallback(
        (
            decoration: WreathDecoration,
            event: ReactPointerEvent<HTMLButtonElement>,
        ) => {
            // A second simultaneous pointer must not hijack the drag in flight.
            if (startRef.current) return;
            if (event.pointerType === "mouse" && event.button !== 0) return;
            startRef.current = {
                code: decoration.code,
                image: decoration.image,
                x: event.clientX,
                y: event.clientY,
                pointerId: event.pointerId,
            };
            // A drag that ended over the stage sends its click to a common
            // ancestor, so consumeDragClick() never runs — clear the flag here
            // or the next tray tap is swallowed.
            endedDragRef.current = false;
            draggingRef.current = false;
        },
        [],
    );

    const consumeDragClick = useCallback(() => {
        const ended = endedDragRef.current;
        endedDragRef.current = false;
        return ended;
    }, []);

    useEffect(() => {
        const move = (event: PointerEvent) => {
            const start = startRef.current;
            if (!start || event.pointerId !== start.pointerId) return;
            if (!draggingRef.current) {
                if (
                    Math.hypot(
                        event.clientX - start.x,
                        event.clientY - start.y,
                    ) < DRAG_THRESHOLD_PX
                )
                    return;
                draggingRef.current = true;
            }
            event.preventDefault();
            setGhost({
                code: start.code,
                image: start.image,
                x: event.clientX,
                y: event.clientY,
            });
        };

        const up = (event: PointerEvent) => {
            const start = startRef.current;
            if (!start || event.pointerId !== start.pointerId) return;
            startRef.current = null;
            if (!draggingRef.current) return; // plain tap → onClick handles it
            draggingRef.current = false;
            endedDragRef.current = true;
            setGhost(null);
            const svg = stageRef.current;
            if (!svg) return;
            // The CTM maps client pixels to the viewBox exactly, whatever the
            // element's own box does.
            const ctm = svg.getScreenCTM();
            if (!ctm) return;
            const pt = new DOMPoint(
                event.clientX,
                event.clientY,
            ).matrixTransform(ctm.inverse());
            const slot = nearestSlot(
                slotPositions(slotCount, slotRadius(ring)),
                { x: pt.x, y: pt.y },
                DROP_RADIUS,
            );
            if (slot !== null) onDropRef.current(slot, start.code);
        };

        const cancel = () => {
            startRef.current = null;
            draggingRef.current = false;
            setGhost(null);
        };

        window.addEventListener("pointermove", move, { passive: false });
        window.addEventListener("pointerup", up);
        window.addEventListener("pointercancel", cancel);
        // The pointer can be released outside the window; blur is the only hint.
        window.addEventListener("blur", cancel);
        return () => {
            window.removeEventListener("pointermove", move);
            window.removeEventListener("pointerup", up);
            window.removeEventListener("pointercancel", cancel);
            window.removeEventListener("blur", cancel);
        };
    }, [stageRef, slotCount, ring]);

    return { ghost, onPointerDown, consumeDragClick };
};
