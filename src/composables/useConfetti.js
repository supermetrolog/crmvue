import { shallowRef } from 'vue';
import { useMobile } from '@/composables/useMobile.js';
import { tryOnUnmounted } from '@vueuse/core';

const isVisible = shallowRef(false);
const _duration = shallowRef(3500);
let timeout = null;

function confetti(duration = 3500) {
    const isMobile = useMobile();
    if (isMobile) return;

    isVisible.value = true;
    _duration.value = duration;

    timeout = setTimeout(
        () => () => {
            isVisible.value = false;
            clearTimeout(timeout);
        },
        duration
    );
}

export function useConfetti() {
    tryOnUnmounted(() => {
        isVisible.value = false;
        clearTimeout(timeout);
    });

    return { isVisible, confetti, duration: _duration };
}
