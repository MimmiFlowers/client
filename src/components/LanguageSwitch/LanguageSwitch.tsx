import { useTranslation } from "react-i18next";

const LANGUAGES = ["en", "sv"] as const;

const LanguageSwitch = ({
    className = "",
    size = "sm",
}: {
    className?: string;
    /** "lg" in the burger menu, where it is a primary touch control. */
    size?: "sm" | "lg";
}) => {
    const { i18n } = useTranslation();
    const current = i18n.resolvedLanguage;

    return (
        <div
            className={`flex items-center font-medium tracking-[0.18em] ${size === "lg" ? "text-body-sm" : "text-label"} ${className}`}
        >
            {LANGUAGES.map((lng, i) => {
                const active = current === lng;
                return (
                    <span key={lng} className="flex items-center">
                        {i > 0 && (
                            <span className="mx-2 h-3 w-px bg-line-strong" />
                        )}
                        <button
                            type="button"
                            onClick={() => i18n.changeLanguage(lng)}
                            aria-pressed={active}
                            className={`min-h-11 cursor-pointer uppercase ${size === "lg" ? "min-w-11 px-2" : "px-1"} transition-colors duration-300 ${
                                active
                                    ? "text-ink"
                                    : "text-muted hover:text-ink"
                            }`}
                        >
                            <span
                                className={`border-b pb-0.5 transition-colors duration-300 ${
                                    active ? "border-ink" : "border-transparent"
                                }`}
                            >
                                {lng}
                            </span>
                        </button>
                    </span>
                );
            })}
        </div>
    );
};

export default LanguageSwitch;
