import { useStore } from 'vuex';
import { computed } from 'vue';
import { createOptionsComposable } from '@/composables/options/createOptionsComposable.js';

export function useBanksOptions() {
    const store = useStore();

    const {
        options: banksOptions,
        getOptions: getBanksOptions,
        refresh: refreshBanksOptions,
        isFetching
    } = createOptionsComposable(
        computed(() => store.getters.COMPANY_IN_THE_BANK_LIST),
        () => store.dispatch('FETCH_COMPANY_IN_THE_BANK_LIST')
    );

    return {
        banksOptions,
        getBanksOptions,
        refreshBanksOptions,
        isFetching
    };
}
