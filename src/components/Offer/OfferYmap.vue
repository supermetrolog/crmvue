<template>
    <MapContainer :style="styles" mini-map :loading>
        <MapContainerControls position="bottom right">
            <MapMiniMapBehavior />
        </MapContainerControls>
        <!--        <MapContainerControls position="top left">-->
        <!--            <MapSelectionBehavior-->
        <!--                @selected="$emit('selection-done', $event)"-->
        <!--                @removed="$emit('removed-done')"-->
        <!--                :coordinates="polygonCoordinates"-->
        <!--                :options="{-->
        <!--                    accuracy: 3-->
        <!--                }"-->
        <!--            />-->
        <!--        </MapContainerControls>-->
        <MapMarkerCollection
            @select="selectOffers"
            :collection="markers"
            :grid-size="64"
            :selected-marker-id="selectedOfferId"
        />
        <MapDrawer v-model:open="drawerIsOpen" :width="400" height="100%">
            <OfferObject @close="drawerIsOpen = false" :search-type :offer-ids="offers" />
        </MapDrawer>
    </MapContainer>
</template>
<script setup>
import { computed, ref, watch } from 'vue';
import { getLinkComplex, getLinkOffer } from '@/utils/url.js';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.ts';
import { toNumberFormat } from '@/utils/formatters/number.js';
import MapContainer from '@/components/common/Map/MapContainer.vue';
import MapContainerControls from '@/components/common/Map/MapContainerControls.vue';
import MapMiniMapBehavior from '@/components/common/Map/Behavior/MapMiniMapBehavior.vue';
import MapMarkerCollection from '@/components/common/Map/MapMarkerCollection.vue';
import OfferObject from '@/components/Offer/OfferObject.vue';
import MapDrawer from '@/components/common/Map/MapDrawer.vue';

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

const markers = computed(() =>
    props.list.map(offer => ({
        id: String(offer.id),
        coordinates: [offer.longitude, offer.latitude],
        title: offer.address,
        preview: offer.thumb
    }))
);

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

const drawerIsOpen = ref(false);
const selectedOfferId = ref(null);

function selectOffers(objectId) {
    const object = props.list.find(element => element.id === Number(objectId));

    if (!object) return;

    selectedOfferId.value = objectId;

    if (isObject(object)) {
        searchType.value = 'objects';
    } else {
        searchType.value = 'offers';
    }

    offers.value = [objectId];

    drawerIsOpen.value = true;
}

watch(
    () => props.selected,
    value => {
        if (isNotNullish(value)) {
            selectOffers(value);
        }
    },
    { immediate: true }
);
</script>
