<template>
    <div class="ymap position-relative">
        <YandexMap v-model="instance" :settings style="width: 100%; height: 100%">
            <YandexMapDefaultSatelliteLayer v-if="currentLayer === 'satellite'" />
            <YandexMapDefaultSchemeLayer v-else />
            <YandexMapDefaultFeaturesLayer />
            <YandexMapControls v-if="zoomIsEnabled" :settings="{ position: 'right' }">
                <YandexMapZoomControl />
            </YandexMapControls>
            <YandexMapControls
                v-if="geolocationIsEnabled || fullscreenIsEnabled"
                :settings="{ position: controlsPosition }"
            >
                <MapLayerControl v-if="layersIsEnabled" v-model="currentLayer" />
                <YandexMapGeolocationControl v-if="geolocationIsEnabled" />
                <MapFullScreenControl v-if="fullscreenIsEnabled" />
                <MapThemeControl v-if="themeIsEnabled" v-model="currentTheme" />
            </YandexMapControls>
            <YandexMapControls :settings="{ position: loadingPosition }">
                <YandexMapSpinner v-if="loading || contextLoading" :settings="spinnerSettings" />
            </YandexMapControls>
            <slot />
        </YandexMap>
    </div>
</template>
<script setup lang="ts">
import {
    YandexMap,
    YandexMapControls,
    YandexMapDefaultFeaturesLayer,
    YandexMapDefaultSatelliteLayer,
    YandexMapDefaultSchemeLayer,
    YandexMapGeolocationControl,
    YandexMapSettings,
    YandexMapSpinner,
    YandexMapZoomControl
} from 'vue-yandex-maps';
import { computed, ref } from 'vue';
import type {
    BehaviorType,
    LngLat,
    LngLatBounds,
    YMap,
    YMapControlsProps
} from '@yandex/ymaps3-types';
import MapFullScreenControl from '@/components/common/Map/Control/MapFullScreenControl.vue';
import MapThemeControl from '@/components/common/Map/Control/MapThemeControl.vue';
import { getFromLocalstorage } from '@/services/localStorage';
import MapLayerControl from '@/components/common/Map/Control/MapLayerControl.vue';
import { createMapContext } from '@/components/common/Map/useMapContext';

export type MapType = 'map' | 'satellite';
export type MapTheme = 'light' | 'dark';

export type MapControlKey = 'zoom' | 'geolocation' | 'fullscreen' | 'layers' | 'theme';

const props = withDefaults(
    defineProps<{
        center?: LngLat;
        zoom?: number;
        type?: MapType;
        behaviors?: BehaviorType[];
        bounds?: LngLatBounds;
        theme?: MapTheme;
        loading?: boolean;
        controls?: MapControlKey[];
        controlsPosition?: YMapControlsProps['position'];
        loadingPosition?: YMapControlsProps['position'];
    }>(),
    {
        center: () => [37.619346417968764, 55.75554289958026], // moscow
        zoom: 8,
        type: 'map',
        theme: getFromLocalstorage('ui:prefer:map-theme', 'dark') ?? 'dark',
        controls: () => ['zoom', 'geolocation', 'fullscreen', 'layers', 'theme'],
        controlsPosition: 'top right',
        loadingPosition: 'top left'
    }
);

const instance = defineModel<YMap | null>({ default: null });

const settings = computed<YandexMapSettings>(() => ({
    location: {
        center: props.center,
        zoom: currentZoom.value,
        bounds: contextBounds.value
    },
    behaviors: props.behaviors,
    theme: contextTheme.value
}));

const {
    bounds: contextBounds,
    loading: contextLoading,
    theme: contextTheme
} = createMapContext({
    map: instance,
    settings,
    bounds: props.bounds,
    loading: props.loading,
    theme: props.theme
});

// controls

const controlSet = computed(() => new Set(props.controls));

const zoomIsEnabled = computed(() => controlSet.value.has('zoom'));
const geolocationIsEnabled = computed(() => controlSet.value.has('geolocation'));
const fullscreenIsEnabled = computed(() => controlSet.value.has('fullscreen'));
const layersIsEnabled = computed(() => controlSet.value.has('layers'));
const themeIsEnabled = computed(() => controlSet.value.has('theme'));

// layers

const currentLayer = ref<MapType>(props.type);

const currentZoom = ref<number>(props.zoom);

function increaseZoom() {
    currentZoom.value++;
}

function decreaseZoom() {
    currentZoom.value--;
}

defineExpose({
    increaseZoom,
    decreaseZoom
});

// spinner

const spinnerSettings = {
    lines: 12,
    length: 7,
    width: 4,
    radius: 8,
    corners: 1,
    speed: 1,
    color: '#969696',
    fadeColor: 'transparent',
    animation: 'spinner-line-fade-default',
    direction: 1
} as const;
</script>
<style>
:deep(svg) {
    max-width: initial;
    height: initial;
}

.ymaps3--drawer-control-content > div {
    height: 100%;
}

.ymaps3x0--marker-layer {
    z-index: 1 !important;
}

.ymaps3--drawer-control-container {
    z-index: 1001 !important;
}
</style>
