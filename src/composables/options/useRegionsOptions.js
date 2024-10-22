import { createOptionsComposable } from '@/composables/options/createOptionsComposable.js';
import { useStore } from 'vuex';
import { computed } from 'vue';

export function useRegionsOptions() {
    const store = useStore();

    const {
        options: regionsOptions,
        getOptions: getRegionsOptions,
        refresh: refreshRegionsOptions,
        isFetching
    } = createOptionsComposable(
        computed(() => store.getters.REGION_LIST),
        () => store.dispatch('FETCH_REGION_LIST')
    );

    return {
        regionsOptions,
        getRegionsOptions,
        refreshRegionsOptions,
        isFetching
    };
}
