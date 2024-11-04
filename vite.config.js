import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { htmlInjectionPlugin } from 'vite-plugin-html-injection';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        htmlInjectionPlugin({
            injections: [
                {
                    name: 'Splash Screen',
                    path: './src/injections/splash-screen.html',
                    injectTo: 'body'
                }
            ]
        })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        port: 8081
    },
    optimizeDeps: { include: ['lodash.throttle', 'lodash.orderby'] },
    test: {
        globals: true,
        environment: 'jsdom'
    }
});
