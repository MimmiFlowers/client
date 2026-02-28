import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import sv from "./locales/sv.json";

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            sv: { translation: sv },
        },
        fallbackLng: "en",
        interpolation: {
            escapeValue: false,
        },
    });

// Keep <html lang="..."> in sync with the active language
i18n.on("languageChanged", (lng: string) => {
    document.documentElement.lang = lng;
});
// Set initial value
document.documentElement.lang = i18n.language || "en";

export default i18n;
