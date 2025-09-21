import { onBeforeMount, ref, watch } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import { useRoute, useRouter } from 'vue-router';
import { RequestQueryParams } from '@/api/types';
import { captureException } from '@sentry/vue';

type PaginationConfig = {
    totalCount: number;
    perPage: number;
    pageCount: number;
    currentPage: number;
};

export type UseTableFetchedDataFetcher<T = any> = (query?: RequestQueryParams) => Promise<{
    data: T[] | null;
    pagination: PaginationConfig | null;
}>;

export type UseTableFetchedDataOptions = {
    immediate?: boolean;
};

export function useTableFetchedData<T = any>(
    fetcher: UseTableFetchedDataFetcher<T>,
    options: UseTableFetchedDataOptions = {}
) {
    const { immediate = true } = options;

    const route = useRoute();
    const router = useRouter();

    const isLoading = ref(false);

    const data = ref<T[]>([]);
    const pagination = ref<PaginationConfig | null>(null);

    async function fetchData() {
        isLoading.value = true;

        try {
            const response = await fetcher({ page: route.query.page ?? 1 });

            if (response) {
                data.value = response.data as T[];
                pagination.value = response.pagination;
            }
        } catch (error) {
            captureException(error);
        } finally {
            isLoading.value = false;
        }
    }

    if (immediate) {
        onBeforeMount(fetchData);
    }

    const debouncedFetchData = useDebounceFn(fetchData, 200);

    watch(() => route.query?.page, debouncedFetchData);

    function setNextPage(page: number) {
        void router.replace({ query: { ...route.query, page } });
    }

    return {
        data,
        pagination,
        isLoading,
        fetchData,
        setNextPage
    };
}
