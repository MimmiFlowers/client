type Props = {
    selected: string[];
    onChange: (filters: string[]) => void;
};

const subgroupOptions = ["favorite", "monobouquets", "birthday", "romantic"]; // твои сабгруппы

const ProductFilter = ({ selected, onChange }: Props) => {
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
                    <span className="capitalize">{option}</span>
                </label>
            ))}
        </div>
    );
};

export default ProductFilter;
