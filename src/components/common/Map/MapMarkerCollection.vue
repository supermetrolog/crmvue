<template>
    <MapClusterer v-model="clusterer"
:grid-size
:max-zoom
:settings
:zoom-on-cluster-click />
</template>
<script setup lang="ts">
import { LngLat, YMapMarker } from '@yandex/ymaps3-types';
import type { Feature, YMapClusterer } from '@yandex/ymaps3-types/packages/clusterer';
import { computed, shallowRef, useCssModule, watch } from 'vue';
import { useMapContext } from '@/components/common/Map/useMapContext';
import MapClusterer from '@/components/common/Map/MapClusterer.vue';
import { isString } from '@/utils/helpers/string/isString';

const emit = defineEmits<{
    (e: 'select', featureId: string): void;
}>();

export type MapCollectionItem = {
    id: string;
    coordinates: LngLat;
    title?: string | null;
};

const props = withDefaults(
    defineProps<{
        gridSize?: 2 | 4 | 8 | 16 | 32 | 64 | 128 | 256 | 512;
        zoomOnClusterClick?: boolean;
        maxZoom?: number;
        collection: MapCollectionItem[];
        selectedMarkerId?: string | number;
    }>(),
    {
        zoomOnClusterClick: true
    }
);

const settings = computed(() => ({
    maxZoom: props.maxZoom,
    features: points.value,
    marker: createMarker
}));

const { map } = useMapContext();

const clusterer = shallowRef<YMapClusterer | null>(null);

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

            features.push({
                type: 'Feature',
                id: element.id,
                geometry: {
                    type: 'Point',
                    coordinates: element.coordinates
                },
                properties: {
                    title: element.title
                }
            });
        } else {
            const N = items.length;
            const baseRadius = 4;
            const radiusMeters = Math.min(30, baseRadius + Math.floor(N / 2));

            for (let i = 0; i < N; i++) {
                const angle = (360 / N) * i;
                const [lng, lat] = items[i].coordinates;
                const coordinates = offsetLngLat([lng, lat], radiusMeters, angle);

                features.push({
                    type: 'Feature',
                    id: items[i].id,
                    geometry: {
                        type: 'Point',
                        coordinates: coordinates
                    },
                    properties: {
                        title: items[i].title
                    }
                });
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

    if (isString(feature.properties?.title)) {
        featureCircle.title = feature.properties.title as string;
    }

    if (feature.id == props.selectedMarkerId) {
        featureCircle.style.background = 'rgb(16, 185, 129)';
    }

    const yMapMarker = new window.ymaps3.YMapMarker(
        {
            id: feature.id,
            coordinates: feature.geometry.coordinates,
            onClick: () => onClick(feature),
            position: 'top left-center'
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
