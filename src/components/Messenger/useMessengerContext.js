import { hasInjectionContext, inject, provide, reactive, ref, shallowReactive } from 'vue';

const CURRENT_TAB_INJECTION_KEY = '$messengerCurrentAsideTab';
const CURRENT_CONTENT_TAB_INJECTION_KEY = '$messengerCurrentContentTab';
const FILTERS_INJECTION_KEY = '$messengerFilters';

export function createMessengerContext() {
    const currentContentTab = ref(null);

    const currentAsideTab = shallowReactive({
        name: null,
        sort: null
    });

    const filters = reactive({
        object: {
            consultant_ids: []
        },
        company: {
            consultant_ids: []
        },
        user: {
            status: 10
        },
        request: {}
    });

    provide(CURRENT_TAB_INJECTION_KEY, currentAsideTab);
    provide(FILTERS_INJECTION_KEY, filters);
    provide(CURRENT_CONTENT_TAB_INJECTION_KEY, currentContentTab);

    return { currentAsideTab, filters, currentContentTab };
}

export function useMessengerContext() {
    if (hasInjectionContext()) {
        return {
            currentAsideTab: inject(CURRENT_TAB_INJECTION_KEY),
            currentContentTab: inject(CURRENT_CONTENT_TAB_INJECTION_KEY),
            filters: inject(FILTERS_INJECTION_KEY)
        };
    }

    console.warn(
        '[Messenger] Are you trying to use Messenger outside the context of the application'
    );
}
