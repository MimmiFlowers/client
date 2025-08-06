import { Link } from "react-router";
import type { BreadcrumbProps } from "../../types/types";

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
    return (
        <nav className="w-[85%] text-lg text-black-700 flex space-x-2 mt-8 mx-4">
            {items.map((item, idx) => (
                <div key={idx} className="flex items-center space-x-1">
                    {item.to ? (
                        <Link to={item.to} className="hover:underline text-black-600">
                            {item.label}
                        </Link>
                    ) : (
                        <span className="font-semibold text-gray-900">{item.label}</span>
                    )}
                    {idx < items.length - 1 && <span>/</span>}
                </div>
            ))}
        </nav>
    );
};

export default Breadcrumb;
