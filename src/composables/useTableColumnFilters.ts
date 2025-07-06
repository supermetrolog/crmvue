import { reactive, Reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { isNullish } from '@/utils/helpers/common/isNullish';

// TODO: Typing

export type TableColumnFilterValue<T = any> = T | null;

export interface useTableColumnFiltersOptions {
    transform?: Record<string, <T>(value: T) => T>;
    prepare?: Record<string, <T>(value: T) => T>;
}

export function useTableColumnFilters(
    template: Reactive<Record<string, TableColumnFilterValue | TableColumnFilterValue[]>>,
    options: useTableColumnFiltersOptions = {}
) {
    const router = useRouter();
    const route = useRoute();

    const filters = reactive({ ...template });

    const { transform = {}, prepare = {} } = options;

    function transformValue(key: string, value: TableColumnFilterValue | TableColumnFilterValue[]) {
        if (transform[key]) return transform[key](value);
        return value;
    }

    function prepareValue(key: string, value: TableColumnFilterValue | TableColumnFilterValue[]) {
        if (isNullish(value)) return value;
        if (prepare[key]) return prepare[key](value);
        return value;
    }

    function confirmFilters() {
        const query = { ...route.query };

        for (const [key, value] of Object.entries(filters)) {
            if (isNullish(value)) delete query[key];
            else query[key] = transformValue(key, value);
        }

        void router.replace({ query });
    }

    watch(
        () => route.query,
        query => {
            for (const key of Object.keys(filters)) {
                filters[key] = prepareValue(key, query[key]) ?? null;
            }
        }
    );

    return {
        confirmFilters,
        filters
    };
}
