import { computed, ref, toValue, watch } from 'vue';
import {
    createSharedComposable,
    MaybeRefOrGetter,
    SharedComposableReturn,
    useLocalStorage
} from '@vueuse/core';
import { CacheItem, createCacheKey } from '@/services/cache';
import { isNullish } from '@/utils/helpers/common/isNullish';

export interface UseCachedRefOptions {
    ttl?: number | null;
}

const register = new Map<string, SharedComposableReturn>();

function createCachedRef<T>(
    cacheKey: string,
    initial: MaybeRefOrGetter<T>,
    options: UseCachedRefOptions = {}
) {
    return createSharedComposable(() => {
        const store = useLocalStorage<CacheItem<T> | null>(createCacheKey(cacheKey), {
            data: toValue(initial),
            timestamp: Date.now()
        });

        const value = ref<T>(store.value?.data ?? (toValue(initial) as T));

        function isExpired(item: CacheItem<T> | null) {
            if (!item) return true;

            if (isNullish(options.ttl)) return false;

            return item.timestamp + options.ttl < Date.now();
        }

        function save(val: T) {
            value.value = val;

            store.value = {
                timestamp: Date.now(),
                data: val
            };
        }

        watch(
            store,
            v => {
                if (!v) return;

                if (!isExpired(v)) {
                    value.value = v.data;
                }
            },
            { immediate: true }
        );

        return computed<T>({
            get: () => value.value,
            set: save
        });
    });
}

export function useCachedRef<T>(
    cacheKey: string,
    initial: MaybeRefOrGetter<T>,
    options: UseCachedRefOptions = {}
) {
    if (register.has(cacheKey)) {
        return register.get(cacheKey)!();
    }

    const storage = createCachedRef(cacheKey, initial, options);

    register.set(cacheKey, storage);

    return storage();
}
