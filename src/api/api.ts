import axios from "axios";
import i18next from "i18next";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 15_000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Send the active UI language on every request so the server can
// return localised content (e.g. product descriptions).
api.interceptors.request.use((config) => {
    const lang = (i18next.language || "en").slice(0, 2);
    if (config.headers) {
        config.headers["Accept-Language"] = lang;
    }
    return config;
});

// Global error interceptor — log unexpected errors and surface a
// consistent message for network failures and 5xx responses.
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (!error.response) {
            // Network error (timeout, DNS, CORS, etc.)
            console.error("Network error:", error.message);
        } else if (error.response.status >= 500) {
            console.error(
                `Server error ${error.response.status}:`,
                error.response.data,
            );
        }
        return Promise.reject(error);
    },
);

// --- Language-change reload callbacks ---
// Components that fetch data can register a callback to refetch when
// the UI language changes (so server returns localised content).
const reloadCallbacks: Array<() => void> = [];

i18next.on("languageChanged", () => {
    reloadCallbacks.forEach((cb) => cb());
});

export const registerReloadOnLanguageChange = (callback: () => void) => {
    reloadCallbacks.push(callback);

    return () => {
        const index = reloadCallbacks.indexOf(callback);
        if (index > -1) reloadCallbacks.splice(index, 1);
    };
};

export default api;
