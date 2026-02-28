import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import viteCompression from "vite-plugin-compression";

export default defineConfig({
    base: "/",
    plugins: [
        react(),
        tailwindcss(),
        viteCompression({ algorithm: "gzip", threshold: 1024 }),
        viteCompression({ algorithm: "brotliCompress", threshold: 1024 }),
    ],
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    react: ["react", "react-dom", "react-router"],
                    stripe: ["@stripe/stripe-js"],
                    i18n: ["i18next", "react-i18next", "i18next-browser-languagedetector"],
                },
            },
        },
    },
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: ["./src/test/setup.ts"],
    },
});
