import { hasInjectionContext, inject, provide } from 'vue';

const injectionKey = Symbol();

export function createMapPreviewer(params) {
    provide(injectionKey, params);
}

export function useMapPreviewer() {
    if (hasInjectionContext()) {
        return {
            previewInMap: inject(injectionKey)
        };
    } else {
        return {
            previewInMap: () => {}
        };
    }
}
