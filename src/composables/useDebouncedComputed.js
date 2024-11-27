import { computed } from 'vue';
import { debounce } from '@/utils/common/debounce.js';

export function useDebouncedComputed(original, delay = 500) {
    return computed({
        set: debounce(function (value) {
            original.value = value;
        }, delay),
        get() {
            return original.value;
        }
    });
}
