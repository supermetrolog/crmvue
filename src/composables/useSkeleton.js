import { shallowRef, watch } from 'vue';

export function useSkeleton(list, options = {}) {
    const lastElementsCount = shallowRef(options.defaultCounts ?? 5);

    watch(
        () => list.value.length,
        value => {
            lastElementsCount.value = Math.min(value, 5) || 1;
        }
    );

    return { lastElementsCount };
}
