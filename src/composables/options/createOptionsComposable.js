import { shallowRef, unref } from 'vue';
import { noop } from '@vueuse/core';

export function createOptionsComposable(options, fetcher = noop) {
    const isFetching = shallowRef(false);
    let awaitedPromise = null;

    async function refresh() {
        if (isFetching.value && awaitedPromise != null) {
            await awaitedPromise;
            return unref(options);
        }

        isFetching.value = true;
        await fetcher();
        isFetching.value = false;
    }

    async function getOptions() {
        if (!unref(options)?.length) await refresh();
        return unref(options);
    }

    if (!isFetching.value && !unref(options)?.length) awaitedPromise = refresh();

    return { options, refresh, getOptions, isFetching };
}
