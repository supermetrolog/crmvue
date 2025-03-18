import { computed, toValue } from 'vue';
import { plural } from '@/utils/plural.js';

export function usePlural(num, ...forms) {
    return computed(() => plural(toValue(num), toValue(forms)));
}
