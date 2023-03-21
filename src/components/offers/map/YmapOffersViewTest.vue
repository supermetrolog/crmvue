<template>
  <Ymap
    v-if="ismounted"
    :coords="[55.75554289958026, 37.619346417968764]"
    style="width: 100%; height: 400px"
  >
    <YmapMarker
      v-for="offer in list"
      :key="offer.id"
      :marker-id="offer.id"
      :coords="[offer.latitude, offer.longitude]"
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
import {
  yandexMap as Ymap,
  ymapMarker as YmapMarker,
  loadYmap,
} from "vue-yandex-maps";

export default {
  name: "YmapOffersViewTest",
  components: {
    Ymap,
    YmapMarker,
  },
  data() {
    return {
      ismounted: false,
    };
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
  async mounted() {
    await loadYmap({ ...this.$options.ymapOptions.settings, debug: true });
    this.ismounted = true;
    // здесь доступна переменная ymaps
  },
};
</script>

<style>
</style>