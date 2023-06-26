<template>
  <Ymap
    :settings="$options.ymapOptions.settings"
    :styles="styles"
    :controls="$options.ymapOptions.controls"
    :behaviors="['drag', 'scrollZoom', 'multiTouch', 'selection']"
    :polygonCoordinates="polygonCoordinates"
    @selectionDone="$emit('selectionDone')"
    @removedDone="$emit('removedDone')"
    @updated="$emit('updated')"
    @objectClick="objectClickHandler"
    @clusterClick="clusterClickHandler"
    ref="map"
  >
    <YmapMarker
      v-for="offer in list"
      :key="offer.id"
      :marker-id="offer.id"
      :coords="[offer.latitude, offer.longitude]"
      :hintContent="offer.address"
      ref="markers"
    />
    <ObjectView :offerIds="offerIds" />
  </Ymap>
</template>

<script>
import Ymap from "@/components/common/ymap/Ymap";
import YmapMarker from "@/components/common/ymap/YmapMarker";
import ObjectView from "@/components/offers/map/ObjectView.vue";
export default {
  name: "YmapOffersView",
  components: {
    ObjectView,
    Ymap,
    YmapMarker,
  },
  data() {
    return {
      offerIds: [],
    }
  },
  props: {
    list: {
      type: Array,
      required: true,
    },
    polygonCoordinates: {
      type: Array,
      default: () => [],
    },
    
    styles: {
      type: Object,
      default: () => {
        return {
          height: "75vh",
          width: "100%",
        }
      },
    }
  },
  ymapOptions: {
    settings: {
      apiKey: "59572809-066b-46d5-9e5d-269a65751b84",
      lang: "ru_RU",
      coordorder: "latlong",
      enterprise: false,
      version: "2.1",
    },
    styles: {
      height: "75vh",
      width: "100%",
    },
    controls: [
      "geolocationControl",
      "searchControl",
      "trafficControl",
      "typeSelector",
      "zoomControl",
      "rulerControl",
    ],
  },
  methods: {
    getMarkerColor(offer) {
      if (offer.test_only == 1) {
        return "grey";
      }
      return "#00a1fe";
    },
    getFooter(offer) {
      let template = `<a href="${this.getOfferUrl(
        offer
      )}" target="_blank" class="photo">
              <div class="image-container">
                <img src="${offer.thumb}" alt="image" />
              </div>
            </a>`;
      return template;
    },
    getClass(offer) {
      if (offer.status != 1) {
        return "passive";
      }
      return "";
    },
    
    objectClickHandler(objectID) {
      this.offerIds = [objectID];
    },
    clusterClickHandler(clusterId) {
			return clusterId;
    },
    getOfferUrl(offer) {
      return this.$apiUrlHelper.generator().objectUrl(offer.complex_id);
    },
  },
};
</script>

<style>
</style>