<template>
    <MapContainer
        style="height: 75vh; width: 100%"
        mini-map
        :loading
        loading-position="left"
        class="objects-map"
    >
        <MapContainerControls position="bottom right">
            <MapMiniMapBehavior />
        </MapContainerControls>
        <MapContainerControls position="top left">
            <MapSelectionBehavior
                @selected="$emit('select-polygon', $event)"
                @removed="$emit('clear-polygon')"
                :coordinates="polygon"
            />
        </MapContainerControls>
        <MapMarkerCollection
            @select="selectMarker"
            :collection="preparedMarkers"
            :grid-size="64"
            :selected-marker-id="selectedMarkerId"
            popup
            hint
        >
            <template #popup="{ close }">
                <div class="objects-map__popup">
                    <Spinner v-if="objectIsLoading" center class="absolute-center" />
                    <ObjectMapPopup
                        v-else-if="selectedMarker"
                        @close="close"
                        :object
                        :marker="selectedMarker"
                    />
                </div>
            </template>
            <template #hint="{ content }">
                <ObjectMapHint v-if="content" :hint="content" />
            </template>
        </MapMarkerCollection>
    </MapContainer>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import MapContainer from '@/components/common/Map/MapContainer.vue';
import MapContainerControls from '@/components/common/Map/MapContainerControls.vue';
import MapMiniMapBehavior from '@/components/common/Map/Behavior/MapMiniMapBehavior.vue';
import MapMarkerCollection from '@/components/common/Map/MapMarkerCollection.vue';
import MapSelectionBehavior from '@/components/common/Map/Behavior/MapSelectionBehavior.vue';
import ObjectMapPopup, { ObjectMapMarker } from '@/components/ObjectMapPopup/ObjectMapPopup.vue';
import api from '@/api/api.js';
import { useAsync } from '@/composables/useAsync';
import { LngLat } from '@yandex/ymaps3-types';
import Spinner from '@/components/common/Spinner.vue';
import ObjectMapHint, { ObjectMapMarkerHint } from '@/components/ObjectMapHint/ObjectMapHint.vue';

defineEmits<{
    (e: 'select-polygon', polygon: LngLat[]): void;
    (e: 'clear-polygon'): void;
}>();

const props = withDefaults(
    defineProps<{
        markers: ObjectMapMarker[];
        polygon?: LngLat[];
        loading?: boolean;
    }>(),
    { polygon: () => [] }
);

function createHint(marker: ObjectMapMarker): ObjectMapMarkerHint {
    return {
        visual_id: marker.visual_id,
        address: marker.address,
        class: marker.class,
        is_land: marker.is_land,
        area_building: marker.area_building,
        test_only: marker.test_only
    };
}

const preparedMarkers = computed(() =>
    props.markers.map(marker => ({
        id: String(marker.id),
        coordinates: [marker.longitude, marker.latitude],
        properties: {
            hint: createHint(marker)
        }
    }))
);

const selectedMarkerId = ref<string | number | null>(null);

const selectedMarker = computed(() => {
    if (selectedMarkerId.value) {
        return props.markers.find(element => element.id == selectedMarkerId.value);
    }

    return null;
});

function selectMarker(markerId: string | null) {
    if (!markerId) {
        selectedMarkerId.value = null;
        return;
    }

    const object = props.markers.find(element => element.id === Number(markerId));

    if (!object) {
        selectedMarkerId.value = null;

        return;
    }

    searchObject(object);

    selectedMarkerId.value = markerId;
}

const {
    isLoading: objectIsLoading,
    execute: searchObject,
    data: object
} = useAsync(async obj => {
    const response = await api.object.search({ id: obj.object_id, expand: 'company,miniOffers' });
    return response.data?.length ? response.data[0] : null;
});
</script>
<style lang="scss">
.objects-map {
    &__popup {
        min-height: 280px;
        min-width: 240px;
        max-width: 380px;
    }
}
</style>
