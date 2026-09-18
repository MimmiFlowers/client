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
    choices: Choice[];
    value: string | null;
    onChange: (code: string) => void;
}

const ChoiceGroup = ({ label, choices, value, onChange }: Props) => (
    <div
        role="radiogroup"
        aria-label={label}
        className="grid grid-cols-2 gap-3 sm:grid-cols-3"
    >
        {choices.map((choice) => {
            const checked = choice.code === value;
            return (
                <button
                    key={choice.code}
                    type="button"
                    role="radio"
                    aria-checked={checked}
                    onClick={() => onChange(choice.code)}
                    className={`bg-surface flex min-h-11 cursor-pointer flex-col items-start gap-2 rounded-xl border p-3 text-left transition-[border-color,box-shadow] duration-300 ${
                        checked
                            ? "border-ink ring-primary/50 ring-4"
                            : "border-line-strong hover:border-ink-soft"
                    }`}
                >
                    {choice.image && (
                        <img
                            src={choice.image}
                            alt=""
                            className="h-14 w-14 object-contain"
                        />
                    )}
                    <span className="text-[15px] leading-tight">
                        {choice.name}
                    </span>
                    {choice.meta && (
                        <span className="text-muted text-xs">
                            {choice.meta}
                        </span>
                    )}
                    <span className="price text-ink-soft text-xs">
                        {choice.priceLabel}
                    </span>
                </button>
            );
        })}
    </div>
);

export default ChoiceGroup;
