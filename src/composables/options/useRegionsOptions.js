import { createOptionsComposable } from '@/composables/options/createOptionsComposable.js';
import { useStore } from 'vuex';
import { computed } from 'vue';
import { isNumber } from '@/utils/helpers/number/isNumber.js';

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

    async function getClearedRegionsOptions() {
        const regions = await getRegionsOptions();
        return regions.filter(element => isNumber(element.value));
    }

    return {
        regionsOptions,
        getRegionsOptions,
        refreshRegionsOptions,
        isFetching,
        getClearedRegionsOptions
    };
}
