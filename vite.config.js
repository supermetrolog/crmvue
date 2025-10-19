import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { htmlInjectionPlugin } from 'vite-plugin-html-injection';
import pkg from './package.json';
import ElementPlus from 'unplugin-element-plus/vite';

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
        }),
        ElementPlus({
            defaultLocale: 'ru'
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
    },
    define: {
        __APP_VERSION__: JSON.stringify(pkg.version)
    }
});
