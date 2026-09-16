import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import type { BreadcrumbProps } from "../../types/types";

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
    const { t } = useTranslation();

    return (
        <nav aria-label={t("nav.breadcrumb")} className="container-luxe pt-6 md:pt-10">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-medium tracking-[0.16em] text-muted uppercase">
                {items.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                        {idx > 0 && (
                            <span className="text-line-strong" aria-hidden="true">
                                /
                            </span>
                        )}
                        {item.to ? (
                            <Link
                                to={item.to}
                                className="py-1 transition-colors duration-300 hover:text-ink"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span aria-current="page" className="py-1 text-ink">
                                {item.label}
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};

export default Breadcrumb;
