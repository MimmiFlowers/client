import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent, RefObject } from "react";
import type { WreathDecoration } from "./types";
import {
    DROP_RADIUS,
    STAGE,
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

    const onPointerDown = useCallback(
        (
            decoration: WreathDecoration,
            event: ReactPointerEvent<HTMLButtonElement>,
        ) => {
            if (event.pointerType === "mouse" && event.button !== 0) return;
            startRef.current = {
                code: decoration.code,
                image: decoration.image,
                x: event.clientX,
                y: event.clientY,
                pointerId: event.pointerId,
            };
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
            const rect = svg.getBoundingClientRect();
            const point = {
                x: ((event.clientX - rect.left) / rect.width) * STAGE,
                y: ((event.clientY - rect.top) / rect.height) * STAGE,
            };
            const slot = nearestSlot(
                slotPositions(slotCount, slotRadius(ring)),
                point,
                DROP_RADIUS,
            );
            if (slot !== null) onDrop(slot, start.code);
        };

        const cancel = () => {
            startRef.current = null;
            draggingRef.current = false;
            setGhost(null);
        };

        window.addEventListener("pointermove", move, { passive: false });
        window.addEventListener("pointerup", up);
        window.addEventListener("pointercancel", cancel);
        return () => {
            window.removeEventListener("pointermove", move);
            window.removeEventListener("pointerup", up);
            window.removeEventListener("pointercancel", cancel);
        };
    }, [stageRef, slotCount, ring, onDrop]);

    return { ghost, onPointerDown, consumeDragClick };
};
