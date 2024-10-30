import { useStore } from 'vuex';
import { computed } from 'vue';
import { createOptionsComposable } from '@/composables/options/createOptionsComposable.js';

export function useProductRangesOptions() {
    const store = useStore();

    const {
        options: productRangesOptions,
        getOptions: getProductRangeOptions,
        refresh: refreshProductRangesOptions,
        isFetching
    } = createOptionsComposable(
        computed(() => store.getters.COMPANY_PRODUCT_RANGE_LIST),
        () => store.dispatch('FETCH_COMPANY_PRODUCT_RANGE_LIST')
    );

    return {
        productRangesOptions,
        refreshProductRangesOptions,
        getProductRangeOptions,
        isFetching
    };
}
