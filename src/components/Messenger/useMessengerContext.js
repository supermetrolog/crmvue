import { hasInjectionContext, inject, provide, shallowReactive } from 'vue';

const CURRENT_TAB_INJECTION_KEY = '$messengerCurrentTab';

export function createMessengerContext() {
    const currentTab = shallowReactive({
        name: null,
        sort: null
    });

    provide(CURRENT_TAB_INJECTION_KEY, currentTab);

    return { currentTab };
}

export function useMessengerContext() {
    if (hasInjectionContext()) {
        return {
            currenTab: inject(CURRENT_TAB_INJECTION_KEY)
        };
    }

    console.warn(
        '[Messenger] Are you trying to use Messenger outside the context of the application'
    );
}
