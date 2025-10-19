import {
    ComputedRef,
    inject,
    InjectionKey,
    provide,
    reactive,
    readonly,
    Ref,
    ref,
    shallowRef,
    ShallowRef
} from 'vue';
import { type BehaviorType, LngLatBounds, YMap, YMapLocationRequest } from '@yandex/ymaps3-types';
import { YandexMapSettings } from 'vue-yandex-maps';
import { MapTheme } from '@/components/common/Map/MapContainer.vue';

export type MapContext = {
    map: ShallowRef<YMap | null>;
    settings: ComputedRef<YandexMapSettings>;
    bounds: Readonly<ShallowRef<LngLatBounds | null>>;
    setBounds: (value: LngLatBounds) => void;
    loading: Readonly<Ref<boolean>>;
    setLoading: (value: boolean) => void;
    theme: Readonly<Ref<MapTheme>>;
    setTheme: (value: MapTheme) => void;
    setLocation: (value: YMapLocationRequest) => void;
    behaviorStates: Partial<Record<BehaviorType, boolean>>;
    setBehaviorState: (behavior: BehaviorType, state: boolean) => void;
};

export type MapContextConfig = {
    map: ShallowRef<YMap | null>;
    settings: ComputedRef<YandexMapSettings>;
    bounds?: LngLatBounds;
    loading?: boolean;
    theme?: MapTheme;
};

const key: InjectionKey<MapContext> = Symbol('MapContext');

export function createMapContext(config: MapContextConfig) {
    const bounds = shallowRef<LngLatBounds | null>(config.bounds ?? null);

    function setBounds(value: LngLatBounds) {
        bounds.value = value;
    }

    const loading = ref(config.loading ?? false);

    function setLoading(value: boolean) {
        loading.value = value;
    }

    const theme = ref<MapTheme>(config.theme ?? 'dark');

    function setTheme(value: MapTheme) {
        theme.value = value;
    }

    function setLocation(value: YMapLocationRequest) {
        if (config.map.value) {
            config.map.value.setLocation(value);
        }
    }

    const behaviorStates = reactive<Partial<Record<BehaviorType, boolean>>>({});

    function setBehaviorState(behavior: BehaviorType, state: boolean) {
        behaviorStates[behavior] = state;
    }

    const context = {
        map: config.map,
        settings: config.settings,
        bounds: readonly(bounds),
        setBounds,
        loading: readonly(loading),
        setLoading,
        theme: readonly(theme),
        setTheme,
        setLocation,
        behaviorStates,
        setBehaviorState
    } as MapContext;

    provide(key, context);

    return context;
}

export function useMapContext() {
    return inject(key)!;
}
