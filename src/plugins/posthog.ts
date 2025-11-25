import posthog, { PostHog } from 'posthog-js';
import { __DEV__ } from '@/const/const';
import { App, inject, InjectionKey } from 'vue';

const injectionKey: InjectionKey<PostHog> = Symbol();

export function initPostHog(app: App) {
    const instance = posthog.init(import.meta.env.VITE_VUE_APP_POSTHOG_API_KEY, {
        api_host: import.meta.env.VITE_VUE_APP_POSTHOG_API_HOST,
        defaults: '2025-05-24',
        person_profiles: 'identified_only',
        capture_exceptions: false,
        capture_pageview: false,
        capture_performance: {
            web_vitals: false,
            network_timing: true
        },
        debug: __DEV__,
        before_send: captured => {
            if (__DEV__) {
                return null;
            }

            return captured;
        }
    });

    app.provide(injectionKey, instance);
}

export function usePostHog() {
    return inject(injectionKey)!;
}
