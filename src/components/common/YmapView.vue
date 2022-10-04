<template>
  <div class="ymap" :key="render">
    <div class="max-size-btn">
      <i class="far fa-arrow-alt-circle-up" v-if="openned" @click="close"></i>
      <i class="far fa-arrow-alt-circle-down" v-else @click="open"></i>
    </div>
    <yandex-map
      v-if="mounted"
      :settings="settings"
      :coords="options.coords"
      :zoom="options.zoom"
      :controls="options.controls"
      :behaviors="options.behaviors"
      :cluster-options="options.clusterOptions"
      ref="map"
      :style="styles"
    >
      <ymap-marker
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
      >
      </ymap-marker>
    </yandex-map>
  </div>
</template>

<script>
import { yandexMap, loadYmap, ymapMarker } from "vue-yandex-maps";
export default {
  name: "YmapView",
  components: { yandexMap, ymapMarker },
  data() {
    return {
      render: 0,
      mounted: false,
      styles: {
        width: "100%",
        height: "100px",
      },
      openned: false,
      route: {
        done: false,
        length: null,
        time: null,
        warning: null,
      },
      settings: {
        apiKey: "59572809-066b-46d5-9e5d-269a65751b84",
        lang: "ru_RU",
        coordorder: "latlong",
        enterprise: false,
        version: "2.1",
      },
      options: {
        coords: [55.75554289958026, 37.619346417968764],
        zoom: 10,
        controls: ["trafficControl", "zoomControl"],
        behaviors: ["drag"],
        clusterOptions: {
          1: {
            clusterDisableClickZoom: false,
            clusterOpenBalloonOnClick: true,
            layout:
              "<h3 class=ballon_header>{{ properties.balloonContentHeader|raw }}</h3>" +
              "<div class=ballon_body>{{ properties.balloonContentBody|raw }}</div>" +
              "<div class=ballon_footer>{{ properties.balloonContentFooter|raw }}</div>",
          },
        },
      },
    };
  },
  props: {
    manualRoute: {
      type: Array,
      default: () => [],
    },
    list: {
      type: Array,
      default: () => [],
    },
  },
  async mounted() {
    await loadYmap({ ...this.settings, debug: true });
    this.mounted = true;
    this.reRender();
  },
  methods: {
    getMarkerColor(offer) {
      if (offer.test_only == 1) {
        return "grey";
      }
      // return offer.status != 1 ? "yellow" : "green";
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
      return "https://pennylane.pro/complex/" + offer.complex_id;
    },
    open() {
      console.log("OPEN");
      this.openned = true;
      this.styles.height = "800px";
    },
    close() {
      console.log("CLOSE");
      this.styles.height = "100px";
      this.openned = false;
    },
    reRender() {
      console.log("RE RENDER");
      this.render++;
    },
  },
  watch: {
    list: {
      handler() {
        console.log("CHANGED");
        if (this.mounted) {
          // this.runBuildRoute();
          this.reRender();
        }
      },
      deep: true,
    },
  },
};
</script>

<style>
</style>