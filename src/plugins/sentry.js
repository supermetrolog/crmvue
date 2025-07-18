import {
    browserProfilingIntegration,
    browserTracingIntegration,
    dedupeIntegration,
    init,
    isInitialized,
    replayIntegration
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
                browserProfilingIntegration(),
                replayIntegration({
                    maskAllText: true,
                    blockAllMedia: true
                })
            ],
            skipBrowserExtensionCheck: true,

            replaysOnErrorSampleRate: 1.0,
            replaysSessionSampleRate: 0.1
        });

        console.warn('[Sentry] Sentry initialized');
    } else {
        console.warn('[Sentry] Skip Sentry initialization in dev mode');
    }
}
