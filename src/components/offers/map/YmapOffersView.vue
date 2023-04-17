<template>
  <Ymap
    :settings="$options.ymapOptions.settings"
    :styles="$options.ymapOptions.styles"
    :controls="$options.ymapOptions.controls"
    :behaviors="['drag', 'scrollZoom', 'multiTouch', 'selection']"
    :polygonCoordinates="polygonCoordinates"
    @selectionDone="$emit('selectionDone')"
    @removedDone="$emit('removedDone')"
    @updated="$emit('updated')"
    ref="map"
  >
    <YmapMarker
      v-for="offer in list"
      :key="offer.id"
      :marker-id="offer.id"
      :coords="[offer.latitude, offer.longitude]"
      :balloonContentBody="offer.address"
      :balloonContentHeader="'ID: ' + offer.complex_id"
      :balloonContentFooter="getFooter(offer)"
      :hintContent="offer.address"
      ref="markers"
    />
  </Ymap>
</template>

<script>
import Ymap from "@/components/common/ymap/Ymap";
import YmapMarker from "@/components/common/ymap/YmapMarker";
export default {
  name: "YmapOffersView",
  components: {
    Ymap,
    YmapMarker,
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
    getOfferUrl(offer) {
      return this.$apiUrlHelper.generator().objectUrl(offer.complex_id);
    },
  },
};
</script>

<style>
</style>