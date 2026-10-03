import type { PointerEvent } from "react";
import { useTranslation } from "react-i18next";
import type { WreathDecoration } from "./types";

interface Props {
    decorations: WreathDecoration[];
    armed: string | null;
    onArm: (code: string | null) => void;
    onPointerDown: (
        decoration: WreathDecoration,
        event: PointerEvent<HTMLButtonElement>,
    ) => void;
    /** True when the click that follows a drag should be ignored (mouse drags still fire click). */
    consumeDragClick: () => boolean;
}

const DecorationTray = ({
    decorations,
    armed,
    onArm,
    onPointerDown,
    consumeDragClick,
}: Props) => {
    const { t } = useTranslation();
    return (
        <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {decorations.map((decoration) => {
                const pressed = armed === decoration.code;
                return (
                    <li key={decoration.code}>
                        <button
                            type="button"
                            aria-pressed={pressed}
                            onPointerDown={(event) =>
                                onPointerDown(decoration, event)
                            }
                            onClick={() => {
                                if (consumeDragClick()) return;
                                onArm(pressed ? null : decoration.code);
                            }}
                            className={`bg-surface flex w-full cursor-grab touch-none flex-col items-center gap-1.5 rounded-xl border p-3 transition-[border-color,box-shadow] duration-300 select-none active:cursor-grabbing ${
                                pressed
                                    ? "border-ink ring-primary/50 ring-4"
                                    : "border-line-strong hover:border-ink-soft"
                            }`}
                        >
                            <img
                                src={decoration.image}
                                alt=""
                                draggable={false}
                                className="h-12 w-12 object-contain"
                            />
                            <span className="text-center text-caption leading-tight">
                                {decoration.name}
                            </span>
                            <span className="price text-ink-soft text-label">
                                {t("wreath.each", {
                                    price: decoration.price.toLocaleString(
                                        "sv-SE",
                                    ),
                                })}
                            </span>
                        </button>
                    </li>
                );
            })}
        </ul>
    );
};

export default DecorationTray;
