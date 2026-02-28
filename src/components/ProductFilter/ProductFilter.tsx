import { useTranslation } from "react-i18next";

type Props = {
    selected: string[];
    onChange: (filters: string[]) => void;
};

// Available product subgroup filter options
const subgroupOptions = ["favorite", "monobouquets", "birthday", "romantic"];

const ProductFilter = ({ selected, onChange }: Props) => {
    const { t } = useTranslation();

    const toggleFilter = (filter: string) => {
        let updated: string[];
        if (selected.includes(filter)) {
            updated = selected.filter((f) => f !== filter);
        } else {
            updated = [...selected, filter];
        }
        onChange(updated);
    };

    return (
        <div className="mb-4 flex flex-wrap gap-4">
            {subgroupOptions.map((option) => (
                <label
                    key={option}
                    className="flex cursor-pointer items-center gap-2"
                >
                    <input
                        type="checkbox"
                        checked={selected.includes(option)}
                        onChange={() => toggleFilter(option)}
                    />
                    <span className="capitalize">{t(`filter.${option}`)}</span>
                </label>
            ))}
        </div>
    );
};

export default ProductFilter;
