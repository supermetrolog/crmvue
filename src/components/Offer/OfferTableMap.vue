<template>
    <div @click="onClickMap" class="offer-table-map" :class="{ opened: mapIsOpened }">
        <AnimationTransition :speed="0.4">
            <div v-if="!mapIsOpened" class="offer-table-map__actions">
                <UiButtonIcon
                    @click.stop.prevent="decreaseZoom"
                    :disabled="isLoading"
                    icon="fa-solid fa-minus"
                    color="white"
                    rect
                    class="offer-table-map__action"
                    label="Отдалить"
                />
                <UiButtonIcon
                    @click.stop.prevent="increaseZoom"
                    :disabled="isLoading"
                    icon="fa-solid fa-plus"
                    color="white"
                    rect
                    class="offer-table-map__action"
                    label="Приблизить"
                />
            </div>
        </AnimationTransition>
        <MapContainer
            ref="map"
            v-model="mapInstance"
            :zoom
            :controls="mapIsOpened ? undefined : []"
            :behaviors="mapIsOpened ? undefined : []"
            :loading-position="mapIsOpened ? 'left' : 'left top'"
            :loading="isLoading"
            class="offer-table-map__container"
        >
            <MapMarkerCollection
                @select="selectMarker"
                :collection="preparedMarkers"
                :grid-size="64"
                :selected-marker-id="selectedMarkerId"
                :popup="mapIsOpened"
                :hint="mapIsOpened"
            >
                <template #popup="{ close }">
                    <div class="objects-map__popup">
                        <Spinner v-if="objectIsLoading" center class="absolute-center" />
                        <ObjectMapPopup v-else-if="selectedMarker" @close="close" :object />
                    </div>
                </template>
                <template #hint="{ content }">
                    <ObjectMapHint v-if="content" :hint="content" />
                </template>
            </MapMarkerCollection>
            <MapContainerControls position="top left">
                <MapSelectionBehavior
                    @selected="selectPolygon"
                    @removed="clearPolygon"
                    :coordinates="polygon"
                />
            </MapContainerControls>
        </MapContainer>
        <div class="offer-table-map__footer">
            <AnimationTransition :speed="0.3" appear>
                <UiButton
                    v-if="mapIsOpened"
                    @click.stop="toggleButton"
                    color="white"
                    center
                    class="offer-table-map__button"
                    icon="fa-solid fa-caret-up"
                >
                    Свернуть карту
                </UiButton>
                <UiButton
                    v-else
                    @click.stop="toggleButton"
                    color="white"
                    center
                    class="offer-table-map__button"
                    icon="fa-solid fa-map-location-dot"
                    :disabled="isLoading"
                >
                    <span v-if="isLoading || !isLoaded">Поиск объектов..</span>
                    <span v-else-if="count">Показать {{ countLabel }} на карте</span>
                    <span v-else>Показать {{ countLabel }} на карте</span>
                </UiButton>
            </AnimationTransition>
        </div>
    </div>
</template>
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import api from '@/api/api';
import { computed, onMounted, ref, shallowRef, useTemplateRef, watch } from 'vue';
import { plural } from '@/utils/plural';
import { useDebounceFn } from '@vueuse/core';
import { singleToArrayByKeys } from '@/utils/helpers/object/singleToArrayByKeys';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish';
import UiButton from '@/components/common/UI/UiButton.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';
import MapMarkerCollection from '@/components/common/Map/MapMarkerCollection.vue';
import MapContainer from '@/components/common/Map/MapContainer.vue';
import { LngLat, YMap } from '@yandex/ymaps3-types';
import MapContainerControls from '@/components/common/Map/MapContainerControls.vue';
import MapSelectionBehavior from '@/components/common/Map/Behavior/MapSelectionBehavior.vue';
import ObjectMapPopup, { ObjectMapMarker } from '@/components/ObjectMapPopup/ObjectMapPopup.vue';
import ObjectMapHint, { ObjectMapMarkerHint } from '@/components/ObjectMapHint/ObjectMapHint.vue';
import Spinner from '@/components/common/Spinner.vue';
import { useAsync } from '@/composables/useAsync';
import { getBoundsFromCoords } from 'vue-yandex-maps';

const route = useRoute();

const props = defineProps<{
    currentFolder?: number;
    center?: LngLat;
    zoom?: number;
}>();

const isLoading = ref(false);
const isLoaded = ref(false);

const offers = shallowRef<ObjectMapMarker[]>([]);
const count = ref(0);

const countLabel = computed(() => plural(count.value, '%d объект', '%d объекта', '%d объектов'));

const formKeysOnlyArray = [
    'purposes',
    'class',
    'gates',
    'region',
    'direction',
    'district_moscow',
    'object_type',
    'floor_types',
    'cian_regions'
];

const fetchOffers = useDebounceFn(async () => {
    isLoading.value = true;

    const query = {
        ...route.query,
        type_id: [2, 3],
        fields: 'latitude,longitude,address,complex_id,status,test_only,id,area_building,object_id,original_id,is_land,object_type,visual_id,class',
        objectsOnly: 1,
        page: 1,
        noWith: 1,
        'per-page': 0
    };

    delete query.page;
    delete query.sort;

    singleToArrayByKeys(query, formKeysOnlyArray);

    if (isNotNullish(props.currentFolder)) {
        query.folder_ids = [props.currentFolder];
    }

    if (query.polygon) {
        query.polygon = query.polygon.join(',');
    }

    const response = await api.offers.searchMap(query);

    if (Array.isArray(response.data)) {
        offers.value = response.data;
        count.value = response.pagination?.totalCount;
    }

    isLoaded.value = true;
    isLoading.value = false;
}, 100);

const preparedQuery = computed(() => {
    const q = { ...route.query };

    delete q.page;
    delete q.sort;

    if (props.currentFolder) {
        q.folder_ids = [props.currentFolder];
    }

    return JSON.stringify(q);
});

watch(preparedQuery, () => fetchOffers());

onMounted(fetchOffers);

const map = useTemplateRef('map');

function increaseZoom() {
    if (map.value) {
        map.value.increaseZoom();
    }
}

function decreaseZoom() {
    if (map.value) {
        map.value.decreaseZoom();
    }
}

// toggle map

const mapIsOpened = ref(false);

function toggleButton() {
    mapIsOpened.value = !mapIsOpened.value;
}

function onClickMap() {
    if (!mapIsOpened.value) {
        mapIsOpened.value = true;
    }
}

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

const preparedMarkers = computed(() => {
    if (mapIsOpened.value) {
        return offers.value.map(offer => ({
            id: String(offer.id),
            coordinates: [offer.longitude, offer.latitude] as LngLat,
            properties: {
                hint: createHint(offer)
            }
        }));
    }

    return offers.value.map(offer => ({
        id: String(offer.id),
        coordinates: [offer.longitude, offer.latitude] as LngLat
    }));
});

const selectedMarkerId = ref<string | number | null>(null);

const selectedMarker = computed(() => {
    if (selectedMarkerId.value) {
        return offers.value.find(element => element.id == selectedMarkerId.value);
    }

    return null;
});

function selectMarker(markerId: string | null) {
    if (!markerId) {
        selectedMarkerId.value = null;
        return;
    }

    if (markerId === selectedMarkerId.value) {
        selectedMarkerId.value = null;
        return;
    }

    const object = offers.value.find(element => element.id === Number(markerId));

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

const polygon = computed(() => {
    if (route.query.polygon && Array.isArray(route.query.polygon)) {
        return route.query.polygon.map(element => element.split(','));
    }

    return [];
});

const router = useRouter();

function selectPolygon(polygon: LngLat[]) {
    const query = { ...route.query, polygon };

    router.replace({ query });
}

function clearPolygon() {
    const query = { ...route.query };

    if (query.polygon) {
        delete query.polygon;

        router.replace({ query });
    }
}

const mapInstance = shallowRef<YMap | null>(null);

function normalizeMapBounds() {
    if (preparedMarkers.value.length > 1) {
        const bounds = getBoundsFromCoords(preparedMarkers.value.map(marker => marker.coordinates));

        mapInstance.value?.setLocation({ bounds, duration: 1000 });

        return;
    }
}

watch(
    () => offers.value.length,
    value => {
        if (value > 0) {
            normalizeMapBounds();
        }
    }
);
</script>
<style lang="scss">
.offer-table-map {
    height: 130px;
    border-radius: 10px;
    overflow: hidden;
    position: relative;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    transition: height 0.5s ease;
    will-change: height;
    cursor: pointer;

    &__footer {
        position: absolute;
        display: block;
        left: 20px;
        right: 20px;
        bottom: 20px;
    }

    &__button {
        width: 100%;
        box-shadow:
            0 1px 3px rgba(0, 0, 0, 0.05),
            0 4px 30px rgba(0, 0, 0, 0.1);
    }

    &__container {
        height: 710px;
        touch-action: none;
        pointer-events: none;

        .ymap-container {
            border: none;
        }
    }

    &__actions {
        position: absolute;
        top: 10px;
        right: 20px;
        z-index: 1;
        display: flex;
        gap: 5px;
    }

    &__action {
        box-shadow:
            0 1px 3px rgba(0, 0, 0, 0.05),
            0 4px 30px rgba(0, 0, 0, 0.1);
    }

    &.opened {
        height: 700px;
        cursor: default;

        .offer-table-map {
            &__container {
                pointer-events: unset;
            }

            &__footer {
                opacity: 0.2;
                transition: opacity 0.5s ease;
                will-change: opacity;

                &:hover {
                    opacity: 1;
                }
            }
        }
    }
}
</style>
