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
}

/*
 * Real radios: the browser gives us arrow-key roving, form semantics and the
 * checked state for free. The card is a sibling *after* the input so Tailwind's
 * peer-* variants (a `~` combinator) can reach it from the label.
 */
const ChoiceGroup = ({ label, name, choices, value, onChange }: Props) => (
    <fieldset>
        <legend className="sr-only">{label}</legend>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {choices.map((choice) => {
                const checked = choice.code === value;
                return (
                    <label key={choice.code} className="cursor-pointer">
                        <input
                            type="radio"
                            name={name}
                            value={choice.code}
                            checked={checked}
                            onChange={() => onChange(choice.code)}
                            className="peer sr-only"
                        />
                        <span className="bg-surface border-line-strong peer-not-checked:hover:border-ink-soft peer-checked:border-ink peer-checked:ring-primary/50 peer-focus-visible:outline-ink flex min-h-11 flex-col items-start gap-2 rounded-xl border p-3 text-left transition-[border-color,box-shadow] duration-300 peer-checked:ring-4 peer-focus-visible:outline peer-focus-visible:outline-[1.5px] peer-focus-visible:outline-offset-3">
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
            })}
        </div>
    </fieldset>
);

export default ChoiceGroup;
