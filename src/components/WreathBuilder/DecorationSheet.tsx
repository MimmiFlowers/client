import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { useOverlay } from "../../hooks/useOverlay";
import { CloseIcon, TrashIcon } from "../Icons/Icons";
import type { WreathDecoration } from "./types";

interface Props {
    open: boolean;
    /** 0-based slot being edited; kept while closing so the panel can slide out intact. */
    slot: number | null;
    /** Decoration code currently in that slot, or null when it is empty. */
    current: string | null;
    decorations: WreathDecoration[];
    onPick: (code: string) => void;
    onRemove: () => void;
    onClose: () => void;
}

const kr = (n: number) => `${n.toLocaleString("sv-SE")} kr`;

/**
 * Decoration picker for one slot. Bottom sheet on phones and tablets, a
 * centred dialog from lg: up. The grid scrolls inside the panel, so it holds
 * any number of decorations.
 */
const DecorationSheet = ({
    open,
    slot,
    current,
    decorations,
    onPick,
    onRemove,
    onClose,
}: Props) => {
    const { t } = useTranslation();
    const panelRef = useOverlay<HTMLDivElement>(open, onClose);
    const placed = current
        ? decorations.find((d) => d.code === current)
        : undefined;
    const n = (slot ?? 0) + 1;

    return createPortal(
        <div
            className={`fixed inset-0 z-50 flex items-end justify-center lg:items-center lg:p-8 ${
                open ? "" : "pointer-events-none"
            }`}
            inert={!open}
        >
            <div
                className={`bg-ink/30 ease-luxe absolute inset-0 transition-opacity duration-500 ${
                    open ? "opacity-100" : "opacity-0"
                }`}
                onClick={onClose}
                aria-hidden="true"
            />

            <div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="decoration-sheet-title"
                className={`bg-surface shadow-lift ease-drawer relative flex max-h-[85svh] w-full flex-col rounded-t-3xl transition-[transform,opacity,visibility] duration-500 lg:max-w-2xl lg:rounded-2xl ${
                    open
                        ? "visible translate-y-0 lg:opacity-100"
                        : "invisible translate-y-full lg:translate-y-4 lg:opacity-0"
                }`}
            >
                <div className="shrink-0 px-5 pt-2.5 sm:px-8 lg:pt-6">
                    <div
                        className="bg-line-strong mx-auto mb-3 h-1 w-10 rounded-full lg:hidden"
                        aria-hidden="true"
                    />
                    <div className="flex items-center justify-between">
                        <h2
                            id="decoration-sheet-title"
                            className="font-display text-subtitle font-medium"
                        >
                            {t("wreath.pick_title", { n })}
                        </h2>
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label={t("wreath.close_picker")}
                            className="text-ink ease-luxe -mr-2.5 flex h-11 w-11 cursor-pointer items-center justify-center transition-transform duration-500 hover:rotate-90"
                        >
                            <CloseIcon className="h-6 w-6" />
                        </button>
                    </div>

                    {placed && (
                        <div className="bg-blush mt-3 flex items-center gap-3 rounded-xl px-3 py-2.5">
                            <img
                                src={placed.image}
                                alt=""
                                className="h-10 w-10 shrink-0 object-contain"
                            />
                            <p className="min-w-0 flex-1 text-caption">
                                {placed.name}
                                <span className="text-muted block text-label">
                                    {t("wreath.placed_here", {
                                        price: placed.price.toLocaleString(
                                            "sv-SE",
                                        ),
                                    })}
                                </span>
                            </p>
                            <button
                                type="button"
                                onClick={onRemove}
                                aria-label={t("wreath.remove_from_slot", {
                                    name: placed.name,
                                    n,
                                })}
                                className="border-danger text-danger hover:bg-danger hover:text-surface inline-flex h-11 shrink-0 cursor-pointer items-center gap-2 rounded-full border-[1.5px] px-4 text-button font-medium tracking-[0.1em] uppercase transition-colors"
                            >
                                <TrashIcon className="h-4 w-4" />
                                {t("wreath.remove")}
                            </button>
                        </div>
                    )}

                    <p className="text-muted mt-4 mb-2.5 text-label font-medium tracking-[0.16em] uppercase">
                        {placed ? t("wreath.swap_label") : t("wreath.pick_label")}
                    </p>
                </div>

                <ul className="grid grid-cols-3 gap-2.5 overflow-y-auto overscroll-contain px-5 pt-1 pb-[max(1.75rem,env(safe-area-inset-bottom))] sm:grid-cols-4 sm:px-8 lg:pb-8">
                    {decorations.map((decoration) => {
                        const isCurrent = decoration.code === current;
                        return (
                            <li key={decoration.code}>
                                <button
                                    type="button"
                                    aria-current={isCurrent || undefined}
                                    onClick={() => onPick(decoration.code)}
                                    className={`bg-surface flex w-full cursor-pointer flex-col items-center gap-1 rounded-xl border px-1.5 pt-3 pb-2.5 transition-[border-color,box-shadow,transform] duration-300 active:scale-[0.97] ${
                                        isCurrent
                                            ? "border-ink ring-primary/50 ring-4"
                                            : "border-line-strong hover:border-ink-soft"
                                    }`}
                                >
                                    <img
                                        src={decoration.image}
                                        alt=""
                                        className="h-13 w-13 object-contain"
                                    />
                                    <span className="text-center text-caption leading-tight">
                                        {decoration.name}
                                    </span>
                                    <span className="price text-muted text-label">
                                        {kr(decoration.price)}
                                    </span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>,
        document.body,
    );
};

export default DecorationSheet;
