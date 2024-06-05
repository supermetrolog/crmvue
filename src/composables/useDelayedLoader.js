import { customRef, ref } from 'vue';

export function useDelayedLoader(value = false, delay = 500) {
    const isLoadingOriginal = ref(value);

    const isLoading = customRef((track, trigger) => {
        let timeout;
        return {
            get() {
                track();
                return value;
            },
            set(newValue) {
                clearTimeout(timeout);
                isLoadingOriginal.value = newValue;

                if (newValue) {
                    value = true;
                    trigger();
                } else {
                    timeout = setTimeout(() => {
                        value = false;
                        trigger();
                    }, delay);
                }
            }
        };
    });

    return { isLoading, isLoadingOriginal };
}
