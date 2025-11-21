<template>
    <UiModal
        v-slot="{ close: closeModal }"
        v-model:visible="isOpened"
        @closed="cleanup"
        class="modal-previewer"
        title="Просмотр объекта на карте"
        :width="1400"
        :min-height="400"
        :z-index="4001"
    >
        <UiField v-if="isNotFound">Объект не найден..</UiField>
        <MapContainer v-model="map" style="height: 80vh; width: 100%" :loading="isLoading">
            <MapContainerControls position="bottom right">
                <MapMiniMapBehavior />
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
                    <div class="offer-table-map-popup">
                        <Spinner v-if="objectIsLoading" center class="absolute-center" />
                        <ObjectMapPopup
                            v-else-if="object && selectedMarkerId"
                            @close="close"
                            @chat-opened="closeModal"
                            :object
                        />
                    </div>
                </template>
                <template #hint="{ content }">
                    <ObjectMapHint v-if="content" :hint="content" />
                </template>
            </MapMarkerCollection>
            <template v-if="targetMarker">
                <MapMarker
                    @click="selectMarker(targetMarker.id)"
                    :coordinates="targetMarker.coords"
                    static-hint
                    :title="targetMarker.title"
                    :subtitle="targetMarker.subtitle"
                    color="red"
                />
                <YandexMapPopupMarker v-if="targetPopupSettings" :settings="targetPopupSettings">
                    <div class="offer-table-map-popup">
                        <Spinner v-if="objectIsLoading" center class="absolute-center" />
                        <ObjectMapPopup
                            v-else-if="object && selectedMarkerId"
                            @close="closeTargetPopup"
                            @chat-opened="closeModal"
                            :object
                        />
                    </div>
                </YandexMapPopupMarker>
            </template>
        </MapContainer>
    </UiModal>
</template>
<script setup lang="ts">
import { computed, nextTick, ref, shallowRef, watch } from 'vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import api from '@/api/api.js';
import UiField from '@/components/common/UI/UiField.vue';
import MapMarkerCollection, {
    MapCollectionItem
} from '@/components/common/Map/MapMarkerCollection.vue';
import MapContainerControls from '@/components/common/Map/MapContainerControls.vue';
import MapMiniMapBehavior from '@/components/common/Map/Behavior/MapMiniMapBehavior.vue';
import ObjectMapPopup, { ObjectMapMarker } from '@/components/ObjectMapPopup/ObjectMapPopup.vue';
import Spinner from '@/components/common/Spinner.vue';
import ObjectMapHint, { ObjectMapMarkerHint } from '@/components/ObjectMapHint/ObjectMapHint.vue';
import MapContainer from '@/components/common/Map/MapContainer.vue';
import { useAsync } from '@/composables/useAsync';
import MapMarker from '@/components/common/Map/MapMarker.vue';
import { objectOptions } from '@/const/options/object.options';
import { getBoundsFromCoords, YandexMapPopupMarker } from 'vue-yandex-maps';
import { YMap } from '@yandex/ymaps3-types';

const isOpened = ref(false);
const isLoading = ref(false);
const isNotFound = ref(false);

const markers = ref<ObjectMapMarker[]>([]);

// markers

function createHint(marker: ObjectMapMarker): ObjectMapMarkerHint {
    return {
        visual_id: marker.visual_id,
        address: marker.address,
        class: marker.class,
        is_land: marker.is_land,
        area_building: marker.area_building,
        test_only: marker.test_only,
        offer_state: marker.offer_state
    };
}

const preparedMarkers = computed(() => {
    const filtered = targetMarkerId.value
        ? markers.value.filter(marker => marker.object_id !== targetMarkerId.value)
        : markers.value;

    return filtered.map(
        element =>
            ({
                id: String(element.id),
                coordinates: [element.longitude, element.latitude],
                properties: {
                    hint: createHint(element)
                }
            }) as MapCollectionItem
    );
});

const selectedMarkerId = ref<string | number | null>(null);

function selectMarker(markerId: string | null) {
    if (!markerId) {
        selectedMarkerId.value = null;
        return;
    }

    if (markerId === selectedMarkerId.value) {
        selectedMarkerId.value = null;
        return;
    }

    searchObject(object);

    selectedMarkerId.value = markerId;
}

async function fetchObjectMarkers(objectIds: number[]) {
    isLoading.value = true;

    try {
        const response = await api.offers.searchMap({
            object_ids: objectIds,
            type_id: [2, 3],
            fields: 'latitude,longitude,address,complex_id,status,test_only,id,area_building,object_id,original_id,is_land,object_type,visual_id,class',
            objectsOnly: 1,
            page: 1,
            noWith: 1,
            'per-page': 0
        });

        if (response.data.length) {
            markers.value.push(...(response.data as ObjectMapMarker[]));
        } else {
            isNotFound.value = true;
        }
    } finally {
        isLoading.value = false;
    }
}

const {
    isLoading: objectIsLoading,
    execute: searchObject,
    data: object
} = useAsync(async obj => {
    const response = await api.object.search({ id: obj.object_id, expand: 'company,miniOffers' });
    return response.data?.length ? response.data[0] : null;
});

// target

const targetMarkerId = ref<number | null>(null);

function createTargetMarker(marker: ObjectMapMarker) {
    let title = `${marker.is_land ? 'Участок' : 'Строение'} #${marker.visual_id}`;

    if (marker.class && marker.class !== '0') {
        title += `, ${objectOptions.class[marker.class]} класс`;
    }

    if (!marker.is_land && marker.area_building) {
        title += `, ${marker.area_building} м<sup>2<sup>`;
    }

    return {
        coords: [marker.longitude, marker.latitude],
        title,
        subtitle: marker.address,
        id: String(targetMarkerId.value)
    };
}

const targetMarker = computed(() => {
    if (targetMarkerId.value) {
        const marker = markers.value.find(marker => marker.object_id == targetMarkerId.value);

        if (marker) {
            return createTargetMarker(marker);
        }
    }

    return null;
});

function closeTargetPopup() {
    selectMarker(null);
}

const targetPopupSettings = computed(() => {
    if (targetMarker.value) {
        return {
            coordinates: targetMarker.value.coords,
            show: Boolean(selectedMarkerId.value && selectedMarkerId.value == targetMarkerId.value),
            zIndex: 3,
            position: 'right top'
        };
    }

    return null;
});

// actions

function cleanup() {
    isLoading.value = false;
    isNotFound.value = false;
    selectedMarkerId.value = null;
    targetMarkerId.value = null;
    markers.value = [];
}

type OpenMapPreviewPayload = {
    objectId?: number;
    objectIds?: number[];
    markers?: {
        id: number | string;
        longitude: number;
        latitude: number;
    }[];
    targetId?: number;
};

function open(payload: OpenMapPreviewPayload) {
    cleanup();

    if (payload.markers?.length) {
        markers.value = payload.markers as ObjectMapMarker[];
    }

    if (payload.objectId) {
        fetchObjectMarkers([payload.objectId]);
    } else if (payload.objectIds) {
        fetchObjectMarkers(payload.objectIds);
    }

    if (payload.targetId) {
        targetMarkerId.value = payload.targetId;
    }

    isOpened.value = true;
}

const map = shallowRef<YMap | null>(null);

function normalizeMapBounds() {
    if (!map.value) {
        return;
    }

    if (markers.value.length > 1) {
        const bounds = getBoundsFromCoords(
            markers.value.map(marker => [marker.longitude, marker.latitude])
        );

        map.value.setLocation({
            bounds: bounds,
            duration: 1000
        });
    } else {
        map.value.setLocation({
            center: [markers.value[0].longitude, markers.value[0].latitude],
            duration: 1000
        });
    }
}

const stopWatch = watch(isLoading, value => {
    if (!value) {
        nextTick(() => {
            if (markers.value) {
                normalizeMapBounds();
            }

            stopWatch();
        });
    }
});

defineExpose({ open });
</script>
<style>
.offer-table-map-popup {
    min-height: 280px;
    min-width: 240px;
    max-width: 380px;
}
</style>
