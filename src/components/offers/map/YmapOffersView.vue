<template>
  <Ymap
    :settings="$options.ymapOptions.settings"
    :styles="$options.ymapOptions.styles"
    :behaviors="['drag', 'scrollZoom', 'multiTouch', 'selection']"
    ref="map"
  >
    <YmapMarker
      v-for="offer in list"
      :key="offer.complex_id"
      :marker-id="offer.complex_id"
      :coords="[offer.latitude, offer.longitude]"
      :use-html-in-layout="true"
      :balloon="{
        header: 'ID: ' + offer.complex_id,
        body: offer.address,
        footer: getFooter(offer),
      }"
      :icon="{ color: getMarkerColor(offer) }"
      :cluster-name="1"
    />
  </Ymap>
</template>

<script>
import Ymap from "@/components/common/ymap/Ymap";
import { ymapMarker as YmapMarker } from "vue-yandex-maps";
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
      height: "200px",
      width: "100%",
    },
  },
  methods: {
    getMarkerColor(offer) {
      if (offer.test_only == 1) {
        return "grey";
      }
      return "red";
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
  watch: {
    list: {
      handler() {
        this.$refs.map.reRender();
      },
      deep: true,
    },
  },
};
</script>

<style>
</style>