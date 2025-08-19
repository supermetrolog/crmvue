import {
    browserProfilingIntegration,
    browserTracingIntegration,
    dedupeIntegration,
    init,
    isInitialized
} from '@sentry/vue';
import router from '@/router/index.js';

export function initSentry(app) {
    if (isInitialized()) {
        console.warn('[Sentry] Sentry already initialized');
        return;
    }

    if (import.meta.env.PROD) {
        init({
            app,
            dsn: import.meta.env.VITE_VUE_APP_GLITCH_DSN,
            integrations: [
                browserTracingIntegration({ router }),
                dedupeIntegration(),
                browserProfilingIntegration()
            ],
            skipBrowserExtensionCheck: true,
            ignoreErrors: ['canceled', 'Request failed with status code 401', 'Network Error']
        });

        console.warn('[Sentry] Sentry initialized');
    } else {
        console.warn('[Sentry] Skip Sentry initialization in dev mode');
    }
}
