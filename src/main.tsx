import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { CartProvider } from "./contexts/CartContext";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import App from "./App.tsx";
import "./i18n";
import "./index.css";
import hattonMedium from "./assets/fonts/Hatton/PP-Hatton-Medium-500.woff2?url";

// Preload the display face so the serif headline does not swap in late.
const fontPreload = document.createElement("link");
fontPreload.rel = "preload";
fontPreload.as = "font";
fontPreload.type = "font/woff2";
fontPreload.href = hattonMedium;
fontPreload.crossOrigin = "anonymous";
document.head.appendChild(fontPreload);

// Fail fast if required env vars are missing
const requiredEnvVars = ["VITE_API_URL", "VITE_STRIPE_PUBLIC_KEY"] as const;
for (const key of requiredEnvVars) {
    if (import.meta.env[key] === undefined) {
        throw new Error(
            `Missing required environment variable: ${key}. ` +
                "Check your .env file for the current Vite mode.",
        );
    }
}

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ErrorBoundary>
            <BrowserRouter>
                <CartProvider>
                    <App />
                </CartProvider>
            </BrowserRouter>
        </ErrorBoundary>
    </StrictMode>,
);
