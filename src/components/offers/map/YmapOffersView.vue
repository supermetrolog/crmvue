<template>
  <Ymap
    :settings="$options.ymapOptions.settings"
    :styles="$options.ymapOptions.styles"
    :controls="$options.ymapOptions.controls"
    :behaviors="['drag', 'scrollZoom', 'multiTouch', 'selection']"
    @selectionDone="$emit('selectionDone')"
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
    <!-- <YmapMarker
      v-for="offer in list"
      :key="offer.id"
      :marker-id="offer.id"
      :coords="[offer.latitude, offer.longitude]"
      :use-html-in-layout="true"
      :balloon="{
        header: 'ID: ' + offer.complex_id,
        body: offer.address,
        footer: getFooter(offer),
      }"
      :icon="{
        layout: 'default#imageWithContent',
        imageOffset: [0, 0],
        contentLayout: `<div style=' background: white; border-radius: 50%; width: 30px; heigth: 30px; color: #FFFFFF; font-weight: bold;'><i class='far fa-circle' style='color: ${getMarkerColor(
          offer
        )}; font-size: 30px;'></i></div>`,
      }"
      cluster-name="point"
    /> -->
  </Ymap>
</template>

<script>
import Ymap from "@/components/common/ymap/Ymap";
import YmapMarker from "@/components/common/ymap/YmapMarkerNew";
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
      height: "100vh",
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