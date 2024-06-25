import { useIntersection } from '@/composables/useIntersection.js';

export const vIntersection = {
    mounted(el, binding) {
        if (typeof binding.value === 'function') useIntersection(el, binding.value);
        else if (binding.value !== null) useIntersection(el, ...binding.value);
    }
};
