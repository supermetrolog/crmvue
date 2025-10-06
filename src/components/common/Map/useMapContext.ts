import { ComputedRef, inject, InjectionKey, provide, ShallowRef } from 'vue';
import { LngLatBounds, YMap } from '@yandex/ymaps3-types';
import { YandexMapSettings } from 'vue-yandex-maps';

export type MapContext = {
    map: ShallowRef<YMap | null>;
    settings: ComputedRef<YandexMapSettings>;
    setBounds: (bounds: LngLatBounds) => void;
};

const key: InjectionKey<MapContext> = Symbol('MapContext');

export function createMapContext(config: MapContext) {
    provide(key, config);
}

export function useMapContext() {
    return inject(key)!;
}
