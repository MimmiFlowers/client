import { Link } from "react-router";
import type { BreadcrumbProps } from "../../types/types";

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
    return (
        <nav className="text-black-700 mx-4 mt-8 flex w-[85%] space-x-2 text-lg">
            {items.map((item, idx) => (
                <div key={idx} className="flex items-center space-x-1">
                    {item.to ? (
                        <Link
                            to={item.to}
                            className="text-black-600 hover:underline"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="font-semibold text-gray-900">
                            {item.label}
                        </span>
                    )}
                    {idx < items.length - 1 && <span>/</span>}
                </div>
            ))}
        </nav>
    );
};

export default Breadcrumb;
