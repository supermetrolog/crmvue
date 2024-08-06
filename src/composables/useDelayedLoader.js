import { customRef, shallowRef } from 'vue';

/**
 * Composable для лоадера с задержкой
 * @param {boolean} [value=false] - Начальное значение
 * @param {number} [delay = 500] - Задержка в *мс*
 * @returns {{isLoading: Ref<boolean>, isLoadingOriginal: shallowRef<boolean>}}
 */

export function useDelayedLoader(value = false, delay = 500) {
    const isLoadingOriginal = shallowRef(value);

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
                        clearTimeout(timeout);
                    }, delay);
                }
            }
        };
    });

    return { isLoading, isLoadingOriginal };
}
