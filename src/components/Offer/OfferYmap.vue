<template>
    <YandexMapView
        @mounted="$emit('mounted')"
        @selectionDone="$emit('selection-done', $event)"
        @removedDone="$emit('removed-done', $event)"
        @updated="$emit('updated', $event)"
        @objectClick="selectOffers"
        @cluster-click="onClickCluster"
        :class="{ loading: loading }"
        :settings="yandexMapOptions.settings"
        :styles="styles"
        :controls="yandexMapOptions.controls"
        :behaviors="['drag', 'scrollZoom', 'multiTouch', 'selection']"
        :polygon-coordinates="polygonCoordinates"
    >
        <YandexMapLoader :show="loading" label="Поиск объектов на карте.." />
        <YandexMapMarker
            v-for="offer in list"
            :key="offer.id"
            :marker-id="offer.id"
            :coords="[offer.latitude, offer.longitude]"
            :hint-content="offer.address"
            :balloon-content-body="getFooter(offer)"
        />
        <OfferObject :search-type :offer-ids="offers" />
    </YandexMapView>
</template>
<script setup>
import YandexMapView from '@/components/common/YandexMap/YandexMapView.vue';
import YandexMapMarker from '@/components/common/YandexMap/YandexMapMarker.vue';
import OfferObject from '@/components/Offer/OfferObject.vue';
import { ref, watch } from 'vue';
import { getLinkComplex } from '@/utils/url.js';
import YandexMapLoader from '@/components/common/YandexMap/YandexMapLoader.vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.ts';
import { captureMessage } from '@sentry/vue';

const yandexMapOptions = {
    settings: {
        apiKey: import.meta.env.VITE_VUE_APP_YANDEX_MAP_KEY,
        lang: 'ru_RU',
        coordorder: 'latlong',
        enterprise: false,
        version: '2.1'
    },
    styles: {
        height: '75vh',
        width: '100%'
    },
    controls: [
        'geolocationControl',
        'searchControl',
        'trafficControl',
        'typeSelector',
        'zoomControl',
        'rulerControl'
    ]
};

defineEmits(['selection-done', 'removed-done', 'updated', 'mounted']);
const props = defineProps({
    list: {
        type: Array,
        required: true
    },
    polygonCoordinates: {
        type: Array,
        default: () => []
    },
    styles: {
        type: Object,
        default: () => {
            return {
                height: '75vh',
                width: '100%'
            };
        }
    },
    loading: {
        type: Boolean,
        default: false
    },
    selected: [Object, Number]
});

const offers = ref([]);

const getOfferUrl = offer => getLinkComplex(offer.complex_id);

const getFooter = offer => {
    return `<a href="${getOfferUrl(offer)}" target="_blank" class="photo">
              <div class="image-container">
                <img src="${offer.thumb}" alt="image" />
              </div>
            </a>`;
};

// TODO: Сделать лучше превью

const searchType = ref('offers');

function isObject(object) {
    return isNotNullish(object.morph) && object.morph === 'c_industry';
}

function selectOffers(objectId) {
    const object = props.list.find(element => element.id === objectId);

    if (!object) return;

    if (isObject(object)) {
        searchType.value = 'objects';
    } else {
        searchType.value = 'offers';
    }

    offers.value = [objectId];
}

function selectObjects(objectIds) {
    const objects = props.list.filter(element => objectIds.includes(Number(element.id)));

    if (objects.length > 0) {
        searchType.value = 'offers';
        offers.value = objects.map(el => el.id);
    }
}

watch(
    () => props.selected,
    value => {
        if (isNotNullish(value)) selectOffers(value);
    },
    { immediate: true }
);

// cluster

function onClickCluster(clusterId, objectManager, event) {
    const currentZoom = objectManager.getMap().getZoom();
    const currentZoomRange = objectManager.getMap().zoomRange?.getCurrent() ?? [0, 21];

    if (currentZoom >= currentZoomRange[1]) {
        const clusterManager = event.currentTarget;
        const cluster = clusterManager.getById(clusterId);

        if (!cluster) {
            captureMessage(`Cluster with id "${clusterId}" not found`);
            return;
        }

        const features = cluster.features;

        if (features?.length > 1) {
            selectObjects(features.map(feature => feature.id));
        }
    }
}
</script>
