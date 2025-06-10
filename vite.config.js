import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        react({
            jsxRuntime: 'automatic',
            fastRefresh: true,
            include: ['**/*.jsx', '**/*.js']
        })
      ],
    build: {
        outDir: 'build', // CRA's default build output
    },
    logLevel: 'info',
    server: {
        historyApiFallback: true, // или использовать плагин legacy
    }
});