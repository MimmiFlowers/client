import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { useTranslation } from "react-i18next";
import { CheckIcon, ChevronDownIcon } from "../Icons/Icons";
import { sortOptions } from "./filterOptions";

type Props = {
    id: string;
    /** id of the visible (or sr-only) label element. */
    labelId: string;
    value: string;
    onChange: (sort: string) => void;
    /**
     * "field": full-width underlined control (desktop sidebar).
     * "inline": compact right-aligned text (mobile toolbar), panel opens to the left.
     */
    variant?: "field" | "inline";
    className?: string;
};

/**
 * Sort picker styled like the filter options (marker + label rows; the
 * marker is round because only one sort can be active),
 * built as a WAI-ARIA select-only combobox: button + listbox, focus moves to
 * the list while open and returns to the button on close.
 */
export const SortSelect = ({
    id,
    labelId,
    value,
    onChange,
    variant = "field",
    className = "",
}: Props) => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const selectedIndex = Math.max(
        0,
        sortOptions.findIndex((o) => o.value === value),
    );
    const [active, setActive] = useState(selectedIndex);
    const rootRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const listId = `${id}-list`;
    const optionId = (i: number) => `${id}-option-${i}`;

    const openList = (index = selectedIndex) => {
        setActive(index);
        setOpen(true);
    };

    const close = (returnFocus = true) => {
        setOpen(false);
        if (returnFocus) buttonRef.current?.focus();
    };

    const choose = (index: number) => {
        const option = sortOptions[index];
        if (option) onChange(option.value);
        close();
    };

    useEffect(() => {
        if (!open) return;
        listRef.current?.focus();
        const onPointerDown = (event: PointerEvent) => {
            if (!rootRef.current?.contains(event.target as Node)) close(false);
        };
        document.addEventListener("pointerdown", onPointerDown);
        return () => document.removeEventListener("pointerdown", onPointerDown);
    }, [open]);

    const onButtonKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
        if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
            event.preventDefault();
            openList();
        }
    };

    const onListKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
        const last = sortOptions.length - 1;
        switch (event.key) {
            case "ArrowDown":
                event.preventDefault();
                setActive((i) => Math.min(last, i + 1));
                break;
            case "ArrowUp":
                event.preventDefault();
                setActive((i) => Math.max(0, i - 1));
                break;
            case "Home":
                event.preventDefault();
                setActive(0);
                break;
            case "End":
                event.preventDefault();
                setActive(last);
                break;
            case "Enter":
            case " ":
                event.preventDefault();
                choose(active);
                break;
            case "Escape":
                event.preventDefault();
                close();
                break;
            case "Tab":
                close(false);
                break;
        }
    };

    const selected = sortOptions[selectedIndex];

    return (
        <div ref={rootRef} className={`relative ${className}`}>
            <button
                ref={buttonRef}
                id={id}
                type="button"
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-controls={listId}
                aria-labelledby={`${labelId} ${id}`}
                onClick={() => (open ? close() : openList())}
                onKeyDown={onButtonKeyDown}
                className={`flex min-h-11 cursor-pointer items-center gap-2 text-ink transition-colors outline-none ${
                    variant === "field"
                        ? `w-full justify-between border-b text-body-sm focus-visible:border-ink ${
                              open ? "border-ink" : "border-line-strong"
                          }`
                        : "ml-auto text-caption"
                }`}
            >
                {selected && t(selected.key)}
                <ChevronDownIcon
                    className={`h-4 w-4 shrink-0 transition-transform duration-300 ease-luxe ${
                        open ? "rotate-180" : ""
                    }`}
                />
            </button>

            {open && (
                <ul
                    ref={listRef}
                    id={listId}
                    role="listbox"
                    tabIndex={-1}
                    aria-labelledby={labelId}
                    aria-activedescendant={optionId(active)}
                    onKeyDown={onListKeyDown}
                    className={`absolute top-full z-40 mt-2 w-max min-w-full animate-fade rounded-xl border border-line bg-surface py-2 shadow-soft outline-none ${
                        variant === "inline" ? "right-0" : "left-0"
                    }`}
                >
                    {sortOptions.map((option, i) => {
                        const isSelected = i === selectedIndex;
                        return (
                            <li
                                key={option.value}
                                id={optionId(i)}
                                role="option"
                                aria-selected={isSelected}
                                onMouseEnter={() => setActive(i)}
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => choose(i)}
                                className={`flex min-h-11 cursor-pointer items-center gap-3 px-4 text-body-sm whitespace-nowrap transition-colors duration-200 ${
                                    i === active ? "bg-blush" : ""
                                } ${isSelected ? "text-ink" : "text-ink-soft"}`}
                            >
                                <span
                                    className={`flex h-[1.1rem] w-[1.1rem] shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
                                        isSelected
                                            ? "border-ink bg-ink text-blush"
                                            : "border-line-strong"
                                    }`}
                                >
                                    {isSelected && (
                                        <CheckIcon
                                            className="h-3 w-3"
                                            strokeWidth={2}
                                        />
                                    )}
                                </span>
                                {t(option.key)}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default SortSelect;
