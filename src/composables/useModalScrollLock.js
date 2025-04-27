import { createSharedComposable } from '@vueuse/core';

export const useModalScrollLock = createSharedComposable(() => {
    let modalCount = 0;

    function lockScroll() {
        modalCount++;

        if (modalCount === 1) {
            document.body.classList.add('is-modal');
        }
    }

    function unlockScroll() {
        modalCount = Math.max(0, modalCount - 1);

        if (modalCount === 0) {
            document.body.classList.remove('is-modal');
        }
    }

    return {
        lockScroll,
        unlockScroll
    };
});
