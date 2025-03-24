import { computed, ref, watch } from 'vue';

export function useDelayedLoader(value = false, delay = 500) {
    const isLoadingOriginal = ref(value);
    const localeLoading = ref(value);

    let timeout;

    const isLoading = computed({
        get() {
            return localeLoading.value;
        },
        set(value) {
            if (timeout) clearTimeout(timeout);

            isLoadingOriginal.value = value;
        }
    });

    watch(isLoadingOriginal, newValue => {
        if (newValue) {
            localeLoading.value = true;
        } else {
            timeout = setTimeout(() => {
                localeLoading.value = false;
                clearTimeout(timeout);
            }, delay);
        }
    });

    return { isLoading, isLoadingOriginal };
}
