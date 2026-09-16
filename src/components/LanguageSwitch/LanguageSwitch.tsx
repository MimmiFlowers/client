import { useTranslation } from "react-i18next";

const LANGUAGES = ["en", "sv"] as const;

const LanguageSwitch = ({ className = "" }: { className?: string }) => {
    const { i18n } = useTranslation();

    return (
        <div
            className={`flex items-center text-[11px] font-medium tracking-[0.18em] ${className}`}
        >
            {LANGUAGES.map((lng, i) => (
                <span key={lng} className="flex items-center">
                    {i > 0 && <span className="mx-2 h-3 w-px bg-line-strong" />}
                    <button
                        type="button"
                        onClick={() => i18n.changeLanguage(lng)}
                        aria-pressed={i18n.language === lng}
                        className={`min-h-11 cursor-pointer px-1 uppercase transition-colors duration-300 ${
                            i18n.language === lng
                                ? "text-ink"
                                : "text-muted hover:text-ink"
                        }`}
                    >
                        {lng}
                    </button>
                </span>
            ))}
        </div>
    );
};

export default LanguageSwitch;
