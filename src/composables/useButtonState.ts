import { ref } from 'vue';
import { useTimeoutFn } from '@vueuse/core';
import { ButtonState } from '@/components/common/UI/UiButton.vue';

export function useButtonState(defaultState: ButtonState = 'idle') {
    const state = ref<ButtonState>(defaultState);

    function loading() {
        state.value = 'loading';
    }

    function success() {
        state.value = 'success';

        useTimeoutFn(() => {
            idle();
        }, 2000);
    }

    function error() {
        state.value = 'error';

        useTimeoutFn(() => {
            idle();
        }, 2000);
    }

    function idle() {
        state.value = 'idle';
    }

    return {
        loading,
        success,
        error,
        idle,
        state
    };
}
