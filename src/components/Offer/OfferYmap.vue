<template>
    <YandexMapView
        ref="map"
        @selectionDone="$emit('selectionDone')"
        @removedDone="$emit('removedDone')"
        @updated="$emit('updated')"
        @objectClick="objectClickHandler"
        @clusterClick="clusterClickHandler"
        :settings="$options.ymapOptions.settings"
        :styles="styles"
        :controls="$options.ymapOptions.controls"
        :behaviors="['drag', 'scrollZoom', 'multiTouch', 'selection']"
        :polygon-coordinates="polygonCoordinates"
    >
        <YandexMapMarker
            v-for="offer in list"
            :key="offer.id"
            ref="markers"
            :marker-id="offer.id"
            :coords="[offer.latitude, offer.longitude]"
            :hint-content="offer.address"
        />
        <OfferObject :offer-ids="offerIds" />
    </YandexMapView>
</template>

<script>
import YandexMapView from '@/components/common/YandexMap/YandexMapView.vue';
import YandexMapMarker from '@/components/common/YandexMap/YandexMapMarker.vue';
import OfferObject from '@/components/Offer/OfferObject.vue';

export default {
    name: 'OfferYmap',
    components: {
        OfferObject,
        YandexMapMarker,
        YandexMapView
    },
    props: {
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
        }
    },
    data() {
        return {
            offerIds: []
        };
    },
    ymapOptions: {
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
    },
    methods: {
        getMarkerColor(offer) {
            if (offer.test_only == 1) {
                return 'grey';
            }
            return '#00a1fe';
        },
        getFooter(offer) {
            let template = `<a href="${this.getOfferUrl(offer)}" target="_blank" class="photo">
              <div class="image-container">
                <img src="${offer.thumb}" alt="image" />
              </div>
            </a>`;
            return template;
        },
        getClass(offer) {
            if (offer.status != 1) {
                return 'passive';
            }
            return '';
        },

        objectClickHandler(objectID) {
            this.offerIds = [objectID];
        },
        clusterClickHandler(clusterId) {
            return clusterId;
        },
        getOfferUrl(offer) {
            return this.$url.complex(offer.complex_id);
        }
    }
};
</script>

<style></style>
