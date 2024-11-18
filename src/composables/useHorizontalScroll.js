import { toValue, tryOnMounted, useEventListener } from '@vueuse/core';
import { computed, ref } from 'vue';

export function useHorizontalScroll(element) {
    const internalX = ref(0);

    const x = computed({
        get() {
            return internalX.value;
        },
        set(value) {
            scrollTo(value);
        }
    });

    /**
     * @param {HTMLElement} _element
     */
    function updateState(_element) {
        internalX.value = _element.scrollLeft;
    }

    function scrollTo(value) {
        /**
         * @type {HTMLElement}
         */
        const _element = toValue(element);

        if (!_element) return;

        _element.scrollTo({
            left: toValue(value)
        });

        updateState(_element);
    }

    function onScrollEndHandler() {
        const _element = toValue(element);
        if (_element) updateState(_element);
    }

    function onMouseWheelHandler(event) {
        const to = internalX.value + event.deltaY;

        scrollTo(to);
    }

    useEventListener(element, 'wheel', onMouseWheelHandler);
    useEventListener(element, 'scrollend', onScrollEndHandler);

    function scrollToStart() {
        scrollTo(0);
    }

    tryOnMounted(() => {
        const _element = toValue(element);
        if (_element) updateState(_element);
    });

    return {
        x,
        scrollTo,
        scrollToStart
    };
}
