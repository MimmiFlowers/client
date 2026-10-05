import type { KeyboardEvent, Ref } from "react";
import { useTranslation } from "react-i18next";
import type { WreathOptions } from "./types";
import type { WreathDesignState } from "./wreathReducer";
import { baseImage } from "./wreathArtwork";
import {
    CENTER,
    DECORATION_SIZE,
    STAGE,
    ringForSize,
    slotPositions,
    slotRadius,
} from "./wreathGeometry";

interface Props {
    options: WreathOptions;
    design: WreathDesignState;
    /** Decoration code the customer has picked in the tray, waiting for a slot. */
    armed: string | null;
    selectedSlot: number | null;
    onSlotTap: (slot: number) => void;
    ref?: Ref<SVGSVGElement>;
}

const WreathStage = ({
    options,
    design,
    armed,
    selectedSlot,
    onSlotTap,
    ref,
}: Props) => {
    const { t } = useTranslation();
    const ring = ringForSize(options.sizes, design.sizeCode);
    const base = baseImage(options, design.sizeCode, design.materialCode);
    const band = design.bandCode
        ? options.bands.find((b) => b.code === design.bandCode)
        : undefined;
    const decorationByCode = new Map(
        options.decorations.map((d) => [d.code, d]),
    );
    const points = slotPositions(design.placements.length, slotRadius(ring));
    const half = DECORATION_SIZE / 2;

    const onKey = (slot: number) => (event: KeyboardEvent<SVGGElement>) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onSlotTap(slot);
        }
    };

    return (
        <svg
            ref={ref}
            viewBox={`0 0 ${STAGE} ${STAGE}`}
            /* Drag only exists on desktop; on touch screens the page must scroll over the wreath. */
            className="h-auto w-full touch-manipulation select-none lg:touch-none"
            role="group"
            aria-label={t("wreath.stage_label")}
            data-wreath-stage
        >
            {base && (
                <image
                    href={base}
                    x={CENTER - ring / 2}
                    y={CENTER - ring / 2}
                    width={ring}
                    height={ring}
                />
            )}

            {design.placements.map((code, slot) => {
                const p = points[slot];
                if (!p) return null;
                const decoration = code
                    ? decorationByCode.get(code)
                    : undefined;
                const selected = selectedSlot === slot;
                const target = armed !== null;
                const label = decoration
                    ? t("wreath.slot_filled", {
                          n: slot + 1,
                          name: decoration.name,
                      })
                    : t("wreath.slot_empty", { n: slot + 1 });
                return (
                    <g
                        key={slot}
                        role="button"
                        tabIndex={0}
                        aria-label={label}
                        aria-pressed={selected}
                        data-slot={slot}
                        className="[&:focus-visible>circle]:stroke-ink cursor-pointer outline-none [&:focus-visible>circle]:[stroke-width:3]"
                        onClick={() => onSlotTap(slot)}
                        onKeyDown={onKey(slot)}
                    >
                        {decoration && (
                            <image
                                href={decoration.image}
                                x={p.x - half}
                                y={p.y - half}
                                width={DECORATION_SIZE}
                                height={DECORATION_SIZE}
                            />
                        )}
                        <circle
                            data-export-hide
                            cx={p.x}
                            cy={p.y}
                            r={half + 4}
                            fill={decoration ? "none" : "var(--color-surface)"}
                            fillOpacity={decoration ? undefined : 0.6}
                            stroke={
                                selected
                                    ? "var(--color-ink)"
                                    : decoration
                                      ? "transparent"
                                      : "var(--color-accent-ink)"
                            }
                            strokeWidth={
                                selected ? 2.5 : target && !decoration ? 2 : 1.25
                            }
                            strokeDasharray={
                                decoration || selected ? undefined : "4 4"
                            }
                        />
                        {!decoration && (
                            <text
                                data-export-hide
                                x={p.x}
                                y={p.y + 6}
                                textAnchor="middle"
                                fontSize="20"
                                fontFamily="var(--font-sans)"
                                fill="var(--color-accent-ink)"
                                aria-hidden="true"
                            >
                                +
                            </text>
                        )}
                    </g>
                );
            })}

            {band && (
                <image
                    href={band.image}
                    x={CENTER - 70}
                    y={CENTER - ring / 2 - 22}
                    width={140}
                    height={100}
                />
            )}
        </svg>
    );
};

export default WreathStage;
