import { hasInjectionContext, inject, provide } from 'vue';

const TOGGLE_PREVIEWER_INJECTION_KEY = '$openPreviewer';

/**
 * @param {function} params
 */
export function createPreviewer(params) {
    provide(TOGGLE_PREVIEWER_INJECTION_KEY, params);
}

/**
 * @return {{preview: function}|null}
 */
export function usePreviewer() {
    if (hasInjectionContext())
        return {
            preview: inject(TOGGLE_PREVIEWER_INJECTION_KEY)
        };
    else return null;
}
