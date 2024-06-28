import { computed, ref, watch } from 'vue';
import { toValue, tryOnScopeDispose, unrefElement } from '@vueuse/core';

export function useIntersection(target, callback, options = {}) {
    const { root, rootMargin = '0px', threshold = 0.1, immediate = true } = options;

    const targets = computed(() => {
        const _target = toValue(target);
        return (Array.isArray(_target) ? _target : [_target])
            .map(unrefElement)
            .filter(value => value !== null);
    });

    let cleanup = () => {};
    const isActive = ref(immediate);

    const stopWatch = watch(
        () => [targets.value, unrefElement(root), isActive.value],
        ([targets, root]) => {
            cleanup();
            if (!isActive.value) return;
            if (!targets.length) return;

            const observer = new IntersectionObserver(callback, {
                root: unrefElement(root),
                rootMargin,
                threshold
            });

            targets.forEach(el => el && observer.observe(el));

            cleanup = () => {
                observer.disconnect();
                cleanup = () => {};
            };
        },
        { immediate, flush: 'post' }
    );

    const stop = () => {
        cleanup();
        stopWatch();
        isActive.value = false;
    };

    tryOnScopeDispose(stop);

    return {
        isActive,
        pause() {
            cleanup();
            isActive.value = false;
        },
        resume() {
            isActive.value = true;
        },
        stop
    };
}
