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
        <div className="flex flex-wrap gap-4 mb-4">
            {subgroupOptions.map((option) => (
                <label key={option} className="flex items-center gap-2 cursor-pointer">
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
