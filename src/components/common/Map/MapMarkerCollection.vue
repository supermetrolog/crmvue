<template>
    <MapClusterer v-model="clusterer"
:grid-size
:max-zoom
:settings
:zoom-on-cluster-click />
    <YandexMapPopupMarker v-if="popup && popupSettings" :settings="popupSettings">
        <slot name="popup" :marker="selectedMarker!" :close="closePopup">
            {{ selectedMarker!.id }}
        </slot>
    </YandexMapPopupMarker>
    <YandexMapHint v-if="hint" hint-property="hint">
        <template #default="{ content }">
            <div class="feature-hint" :class="{ dark: map?.theme === 'dark' }">
                <slot name="hint" :content="content">
                    <div v-html="content"></div>
                </slot>
            </div>
        </template>
    </YandexMapHint>
</template>
<script setup lang="ts">
import { LngLat, YMapMarker } from '@yandex/ymaps3-types';
import type { Feature, YMapClusterer } from '@yandex/ymaps3-types/packages/clusterer';
import { computed, ref, shallowRef, useCssModule, watch } from 'vue';
import { useMapContext } from '@/components/common/Map/useMapContext';
import MapClusterer from '@/components/common/Map/MapClusterer.vue';
import { YandexMapHint, YandexMapPopupMarker } from 'vue-yandex-maps';

const emit = defineEmits<{
    (e: 'select', featureId: string | null): void;
}>();

export type MapCollectionItem = {
    id: string;
    coordinates: LngLat;
    properties?: Record<string, any>;
};

const props = withDefaults(
    defineProps<{
        gridSize?: 2 | 4 | 8 | 16 | 32 | 64 | 128 | 256 | 512;
        zoomOnClusterClick?: boolean;
        maxZoom?: number;
        collection: MapCollectionItem[];
        selectedMarkerId?: string | number | null;
        popup?: boolean;
        hint?: boolean;
    }>(),
    {
        zoomOnClusterClick: true
    }
);

const settings = computed(() => ({
    maxZoom: props.maxZoom ?? (map.value?.zoomRange?.max ?? 13) - 1,
    features: points.value,
    marker: createMarker
}));

const selectedMarker = computed(() => {
    if (props.selectedMarkerId) {
        return props.collection.find(item => item.id === props.selectedMarkerId);
    }

    return null;
});

function onClosePopup() {
    emit('select', null);
}

const popupIsVisible = ref(true);

watch(
    () => props.selectedMarkerId,
    value => {
        if (value) {
            popupIsVisible.value = true;
        }
    }
);

function closePopup() {
    popupIsVisible.value = false;
}

const popupSettings = computed(() => {
    if (selectedMarker.value) {
        return {
            coordinates: selectedMarker.value.coordinates,
            show: popupIsVisible.value,
            onClose: onClosePopup,
            zIndex: 3,
            position: 'right top'
        };
    }

    return null;
});

const { map } = useMapContext();

const clusterer = shallowRef<YMapClusterer | null | undefined>(null);

function createFeature(id: number | string, coordinates: LngLat, properties = {}) {
    return {
        type: 'Feature',
        id,
        geometry: {
            type: 'Point',
            coordinates
        },
        properties
    };
}

const points = computed(() => {
    if (!map.value) return [];

    const groups = new Map<string, MapCollectionItem[]>();

    for (const element of props.collection) {
        const [lng, lat] = element.coordinates;
        const key = `${lng.toFixed(7)},${lat.toFixed(7)}`;

        if (!groups.has(key)) groups.set(key, []);
        groups.get(key)!.push(element);
    }

    const features = [];

    for (const [, items] of groups) {
        if (items.length === 1) {
            const element = items[0];

            features.push(createFeature(element.id, element.coordinates, element.properties));
        } else {
            const N = items.length;
            const baseRadius = 4;
            const radiusMeters = Math.min(30, baseRadius + Math.floor(N / 2));

            for (let i = 0; i < N; i++) {
                const angle = (360 / N) * i;
                const [lng, lat] = items[i].coordinates;
                const coordinates = offsetLngLat([lng, lat], radiusMeters, angle);

                features.push(createFeature(items[i].id, coordinates, items[i].properties));
            }
        }
    }

    return features;
});

const R = 6378137;

function offsetLngLat(
    [lng, lat]: [number, number],
    meters: number,
    bearingDegrees: number
): [number, number] {
    const br = (bearingDegrees * Math.PI) / 180;
    const latRad = (lat * Math.PI) / 180;

    const dx = meters * Math.cos(br);
    const dy = meters * Math.sin(br);

    const dLat = dy / R;
    const dLon = dx / (R * Math.cos(latRad));

    const newLat = lat + (dLat * 180) / Math.PI;
    const newLng = lng + (dLon * 180) / Math.PI;

    return [newLng, newLat];
}

const allMarkers: Map<string, YMapMarker> = new Map();

function updateMarker(feature: Feature) {
    const marker = allMarkers.get(feature.id);

    if (!marker) {
        return;
    }

    marker.element.style.background =
        props.selectedMarkerId === feature.id ? 'rgb(16, 185, 129)' : '';
}

watch(
    () => props.selectedMarkerId,
    (newValue, oldValue) => {
        if (oldValue) {
            const previousFeature = points.value.find(f => f.id === oldValue);

            if (previousFeature) {
                updateMarker(previousFeature);
            }
        }

        if (newValue) {
            const feature = points.value.find(f => f.id === newValue);

            if (feature) {
                updateMarker(feature);
            }
        }
    }
);

const module = useCssModule();

function onClick(feature: Feature) {
    emit('select', feature.id);
}

function createMarker(feature: Feature) {
    const featureCircle = document.createElement('div');

    featureCircle.classList.add(module['feature-circle']);

    if (feature.id == props.selectedMarkerId) {
        featureCircle.style.background = 'rgb(16, 185, 129)';
    }

    const yMapMarker = new window.ymaps3.YMapMarker(
        {
            id: feature.id,
            coordinates: feature.geometry.coordinates,
            onClick: () => onClick(feature),
            position: 'top left-center',
            properties: feature.properties
        },
        featureCircle
    );

    allMarkers.set(feature.id, yMapMarker);

    return yMapMarker;
}
</script>
<style module>
.feature-circle {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 100%;
    background: #fff;
    border: 4px solid #1e97fd;
    width: 32px;
    height: 32px;
    font-size: 12px;
    cursor: pointer;
    overflow: hidden;

    img {
        height: 100%;
        width: 100%;
        object-fit: cover;
    }
}
</style>
<style>
.feature-hint {
    position: absolute;
    max-width: 600px;
    padding: 8px 12px 8px 20px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.9);
    line-height: 16px;
    z-index: -2;
    border: 1px solid rgba(0, 0, 0, 0.2);
    transform: translate(7px, -100%);
    width: max-content;

    &.dark {
        background: rgba(29, 30, 31, 0.9);
        color: #fff;
    }
}
</style>
