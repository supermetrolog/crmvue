import { hasInjectionContext, inject, provide, reactive, shallowReactive } from 'vue';
import { useAuth } from '@/composables/useAuth.js';

const CURRENT_TAB_INJECTION_KEY = '$messengerCurrentTab';
const FILTERS_INJECTION_KEY = '$messengerFilters';

export function createMessengerContext() {
    const { currentUserId } = useAuth();

    const currentTab = shallowReactive({
        name: null,
        sort: null
    });

    const filters = reactive({
        object: {
            consultant_ids: [currentUserId.value]
        },
        company: {
            consultant_ids: [currentUserId.value]
        },
        user: {
            status: 10
        }
    });

    provide(CURRENT_TAB_INJECTION_KEY, currentTab);
    provide(FILTERS_INJECTION_KEY, filters);

    return { currentTab, filters };
}

export function useMessengerContext() {
    if (hasInjectionContext()) {
        return {
            currenTab: inject(CURRENT_TAB_INJECTION_KEY),
            filters: inject(FILTERS_INJECTION_KEY)
        };
    }

    console.warn(
        '[Messenger] Are you trying to use Messenger outside the context of the application'
    );
}
