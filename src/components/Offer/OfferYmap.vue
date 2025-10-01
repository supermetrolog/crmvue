<template>
    <YandexMapContainer
        @mounted="$emit('mounted')"
        @selectionDone="$emit('selection-done', $event)"
        @removedDone="$emit('removed-done', $event)"
        @updated="$emit('updated', $event)"
        @objectClick="selectOffers"
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
            :balloon-content-header="`#${offer.id} - ${offer.address}`"
            :cluster-caption="getOfferClusterCaption(offer)"
        />
        <OfferObject :search-type :offer-ids="offers" />
    </YandexMapContainer>
</template>
<script setup>
import YandexMapContainer from '@/components/common/YandexMap/YandexMapContainer.vue';
import YandexMapMarker from '@/components/common/YandexMap/YandexMapMarker.vue';
import OfferObject from '@/components/Offer/OfferObject.vue';
import { ref, watch } from 'vue';
import { getLinkComplex, getLinkOffer } from '@/utils/url.js';
import YandexMapLoader from '@/components/common/YandexMap/YandexMapLoader.vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.ts';
import { toNumberFormat } from '@/utils/formatters/number.js';

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

function getOfferClusterCaption(offer) {
    return `<a href="${getLinkOffer(offer.complex_id, offer.original_id)}" target="_blank" class="d-flex align-items-start gap-2 text-inherit">
                <img src="${offer.thumb}" alt="image" height="80px" width="110px" class="flex-shrink-0" />
                <div>
                    <p style="white-space: normal" class="font-weight-bold mb-1">#${offer.object_id}</p>
                    <p style="white-space: normal">Площадь пола - <span style="font-weight: 600">${toNumberFormat(offer.area_floor_full)} м^2</span></p>
                </div>
            </a>`;
}

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

watch(
    () => props.selected,
    value => {
        if (isNotNullish(value)) selectOffers(value);
    },
    { immediate: true }
);
</script>
