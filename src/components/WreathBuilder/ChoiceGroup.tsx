export interface Choice {
    code: string;
    name: string;
    image?: string;
    /** e.g. "35 cm · 8 spots" */
    meta?: string;
    /** e.g. "+49 kr" or "Included" */
    priceLabel: string;
}

interface Props {
    label: string;
    /** Shared radio-group name; must be unique within the page. */
    name: string;
    choices: Choice[];
    value: string | null;
    onChange: (code: string) => void;
    /**
     * cards: the desktop grid. segmented / chips: the compact phone rows under
     * the wreath (name + meta buttons, or a sideways-scrolling row of round chips).
     */
    variant?: "cards" | "segmented" | "chips";
    /** Compact variants only: shown right of the visible label, e.g. "35 cm". */
    valueLabel?: string;
}

const SELECTED =
    "peer-checked:border-ink peer-checked:ring-primary/50 peer-checked:ring-4 peer-focus-visible:outline-ink peer-not-checked:hover:border-ink-soft peer-focus-visible:outline peer-focus-visible:outline-[1.5px] peer-focus-visible:outline-offset-3";

/*
 * Real radios: the browser gives us arrow-key roving, form semantics and the
 * checked state for free. The card is a sibling *after* the input so Tailwind's
 * peer-* variants (a `~` combinator) can reach it from the label.
 */
const ChoiceGroup = ({
    label,
    name,
    choices,
    value,
    onChange,
    variant = "cards",
    valueLabel,
}: Props) => {
    const compact = variant !== "cards";
    const items = choices.map((choice) => {
        const checked = choice.code === value;
        const input = (
            <input
                type="radio"
                name={name}
                value={choice.code}
                checked={checked}
                onChange={() => onChange(choice.code)}
                className="peer sr-only"
            />
        );

        if (variant === "segmented") {
            return (
                <label key={choice.code} className="cursor-pointer">
                    {input}
                    <span
                        className={`bg-surface border-line-strong flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-xl border px-2 py-2 text-center transition-[border-color,box-shadow] duration-300 ${SELECTED}`}
                    >
                        <span className="text-caption font-medium">
                            {choice.name}
                        </span>
                        {choice.meta && (
                            <span className="text-muted text-label">
                                {choice.meta}
                            </span>
                        )}
                    </span>
                </label>
            );
        }

        if (variant === "chips") {
            return (
                <label key={choice.code} className="shrink-0 cursor-pointer">
                    {input}
                    <span
                        className={`bg-surface border-line-strong flex min-h-12 items-center gap-2 rounded-full border py-1 pr-3.5 whitespace-nowrap transition-[border-color,box-shadow] duration-300 ${
                            choice.image ? "pl-1" : "pl-3.5"
                        } ${SELECTED}`}
                    >
                        {choice.image && (
                            <img
                                src={choice.image}
                                alt=""
                                className="bg-blush-deep h-9.5 w-9.5 rounded-full object-cover"
                            />
                        )}
                        <span className="text-caption">{choice.name}</span>
                        <span className="price text-muted text-label">
                            {choice.priceLabel}
                        </span>
                    </span>
                </label>
            );
        }

        return (
            <label key={choice.code} className="cursor-pointer">
                {input}
                <span
                    className={`bg-surface border-line-strong flex min-h-11 flex-col items-start gap-2 rounded-xl border p-3 text-left transition-[border-color,box-shadow] duration-300 ${SELECTED}`}
                >
                    {choice.image && (
                        <img
                            src={choice.image}
                            alt=""
                            className="h-14 w-14 object-contain"
                        />
                    )}
                    <span className="text-body-sm leading-tight">
                        {choice.name}
                    </span>
                    {choice.meta && (
                        <span className="text-muted text-label">
                            {choice.meta}
                        </span>
                    )}
                    <span className="price text-ink-soft text-label">
                        {choice.priceLabel}
                    </span>
                </span>
            </label>
        );
    });

    return (
        // min-w-0: a fieldset is min-content wide by default, which the chip row would stretch.
        <fieldset className="min-w-0">
            {compact ? (
                <legend className="mb-2.5 flex w-full items-baseline justify-between gap-4">
                    <span className="text-muted text-label font-medium tracking-[0.16em] uppercase">
                        {label}
                    </span>
                    {valueLabel && (
                        <span className="text-ink-soft text-caption">
                            {valueLabel}
                        </span>
                    )}
                </legend>
            ) : (
                <legend className="sr-only">{label}</legend>
            )}
            {variant === "segmented" ? (
                <div className="grid grid-cols-3 gap-2">{items}</div>
            ) : variant === "chips" ? (
                /* Phones: bleeds to the screen edge so chips scroll out from under the gutter.
                   From sm: the column is narrower than the screen, so no bleed. */
                <div className="-mx-5 flex [scrollbar-width:none] gap-2 overflow-x-auto px-5 py-1 sm:-mx-1 sm:px-1 [&::-webkit-scrollbar]:hidden">
                    {items}
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {items}
                </div>
            )}
        </fieldset>
    );
};

export default ChoiceGroup;
