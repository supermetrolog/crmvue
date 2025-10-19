<template>
    <OfferTableMap
        @select-polygon="selectPolygon"
        @clear-polygon="clearPolygon"
        :objects
        :polygon
        :count
        :center
        :zoom
        :loading
        :selection="false"
    />
</template>
<script setup lang="ts">
import { LngLat } from '@yandex/ymaps3-types';
import { ObjectMapMarker } from '@/components/ObjectMapPopup/ObjectMapPopup.vue';
import OfferTableMap from '@/components/Offer/OfferTableMap.vue';

defineProps<{
    center?: LngLat;
    zoom?: number;
    objects: ObjectMapMarker[];
    selectedObjects: object[];
    currentObjects: object[];
    count?: number;
    loading?: boolean;
}>();

function selectPolygon(coords: LngLat[]) {
    // TODO: Сделать полигоны
}

function clearPolygon() {}

const polygon = undefined;

// TODO: Внедрить selectedObjects и currentObjects отображение
</script>
