import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { CartProvider } from "./contexts/CartContext";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import App from "./App.tsx";
import "./i18n";
import "./index.css";

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
