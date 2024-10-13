import { tryOnBeforeMount, tryOnScopeDispose, useDebounceFn } from '@vueuse/core';
import { shallowRef, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export function useQuerySearch(key = 'all', delay = 500) {
    const querySearch = shallowRef(null);

    const route = useRoute();
    const router = useRouter();

    const querySearchHandler = value => {
        const query = { ...route.query };
        delete query.page;

        if (value?.length) query[key] = value;
        else delete query[key];

        router.replace({ query });
    };

    const debouncedQuerySearchHandler = useDebounceFn(querySearchHandler, delay);
    const stop = watch(querySearch, debouncedQuerySearchHandler);

    tryOnScopeDispose(stop);
    tryOnBeforeMount(() => {
        if (route.query[key]) querySearch.value = route.query[key];
    });

    return {
        querySearch
    };
}
