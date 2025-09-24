import axios from "axios";
import i18next from "i18next";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const lang = (i18next.language || "en").slice(0, 2);
  if (config.headers) {
    config.headers['Accept-Language'] = lang;
  }
  return config;
});

const reloadCallbacks: Array<() => void> = [];

i18next.on("languageChanged", () => {
  console.log("Язык сменился, повторяем запросы...");
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