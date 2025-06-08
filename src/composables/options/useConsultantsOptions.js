import { useStore } from 'vuex';
import { computed } from 'vue';
import { createOptionsComposable } from '@/composables/options/createOptionsComposable.js';
import { createSharedComposable } from '@vueuse/core';

export const useConsultantsOptions = createSharedComposable(() => {
    const store = useStore();

    const {
        options: consultantsOptions,
        getOptions: getConsultantsOptions,
        refresh: refreshConsultantsOptions,
        isFetching
    } = createOptionsComposable(
        computed(() => store.getters.CONSULTANT_LIST),
        () => store.dispatch('FETCH_CONSULTANT_LIST')
    );

    return {
        consultantsOptions,
        refreshConsultantsOptions,
        getConsultantsOptions,
        isFetching
    };
});
