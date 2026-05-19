import { Link } from "react-router";
import type { BreadcrumbProps } from "../../types/types";

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
    return (
        <nav
            aria-label="Breadcrumb"
            className="mx-auto mt-6 flex w-[95%] flex-wrap items-center gap-1.5 text-sm text-[var(--color-fg-soft)] sm:w-[90%] sm:text-base md:mt-8 md:w-[75%]"
        >
            {items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                    {idx > 0 && (
                        <svg
                            className="h-3.5 w-3.5 flex-shrink-0 text-[var(--color-muted)]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    )}
                    {item.to ? (
                        <Link
                            to={item.to}
                            className="transition-colors duration-200 hover:text-black hover:underline"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="font-medium text-[var(--color-fg)]">
                            {item.label}
                        </span>
                    )}
                </div>
            ))}
        </nav>
    );
};

export default Breadcrumb;
