import { useStore } from 'vuex';
import { computed } from 'vue';
import { createOptionsComposable } from '@/composables/options/createOptionsComposable.js';

export function useCompanyGroupsOptions() {
    const store = useStore();

    const {
        options: companyGroupsOptions,
        getOptions: getCompanyGroupsOptions,
        refresh: refreshCompanyGroupsOptions,
        isFetching
    } = createOptionsComposable(
        computed(() => store.getters.COMPANY_GROUP_LIST),
        () => store.dispatch('FETCH_COMPANY_GROUP_LIST')
    );

    return {
        companyGroupsOptions,
        refreshCompanyGroupsOptions,
        getCompanyGroupsOptions,
        isFetching
    };
}
