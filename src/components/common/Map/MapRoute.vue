<template>
    <template v-if="route">
        <YandexMapFeature
            v-for="line in route.lines"
            :key="line.id"
            :settings="{
                geometry: {
                    type: 'LineString',
                    coordinates: line.coordinates
                },
                style: routeLineStyle
            }"
        />
        <MapMarker
            v-for="point in points"
            :key="point.id"
            :coordinates="point.coords"
            :static-hint
            :title="point.title"
            :subtitle="point.subtitle"
            :color="point.color"
        />
        <MapContainerControls position="bottom left">
            <YandexMapControlButton>Расстояние: {{ route.distance }}</YandexMapControlButton>
            <YandexMapControlButton>Время в пути: {{ route.duration }}</YandexMapControlButton>
        </MapContainerControls>
    </template>
</template>
<script setup lang="ts">
import { getLocationFromBounds, YandexMapControlButton, YandexMapFeature } from 'vue-yandex-maps';
import MapMarker, { MarkerColor } from '@/components/common/Map/MapMarker.vue';
import { DrawingStyle, LngLat } from '@yandex/ymaps3-types';
import { getRoute, MapRoute } from '@/services/map/route';
import MapContainerControls from '@/components/common/Map/MapContainerControls.vue';
import { shallowRef, watch } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import { useMapContext } from '@/components/common/Map/useMapContext';

export type MapWayPoint = {
    id: number | string;
    title?: string;
    subtitle?: string;
    coords: LngLat;
    color?: MarkerColor;
};

const props = defineProps<{
    points: MapWayPoint[];
    staticHint?: boolean;
}>();

const routeLineStyle: DrawingStyle = {
    fillRule: 'nonzero',
    fill: '#333',
    fillOpacity: 0.9,
    stroke: [
        {
            width: 6,
            color: '#007afce6'
        },
        {
            width: 10,
            color: '#fff'
        }
    ]
};

const { map, setLoading } = useMapContext();

const route = shallowRef<MapRoute | null>(null);

async function fetchRoute() {
    const points = props.points.map(point => point.coords);

    return await getRoute([props.start, ...points]);
}

async function buildRoute() {
    if (!map.value || props.points.length < 1) {
        return;
    }

    setLoading(true);

    route.value = null;

    const fetchedRoute = await fetchRoute();

    if (!fetchedRoute) {
        setLoading(false);
        return;
    }

    route.value = fetchedRoute;

    if (fetchedRoute.bounds) {
        const location = await getLocationFromBounds({
            bounds: fetchedRoute.bounds,
            map: map.value
        });

        map.value.setLocation({
            center: location.center,
            zoom: Math.floor(location.zoom),
            duration: 300
        });
    }

    setLoading(false);
}

const runBuildRoute = useDebounceFn(buildRoute, 500);

watch(
    () => props.points,
    () => {
        console.log([...props.points]);
        runBuildRoute();
    },
    { immediate: true, deep: true }
);

watch(
    map,
    value => {
        if (value) {
            runBuildRoute();
        }
    },
    { immediate: true }
);
</script>
