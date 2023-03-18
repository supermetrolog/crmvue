<template>
  <div class="ymap" :key="render">
    <yandex-map
      v-if="mounted"
      :settings="settings"
      :options="options"
      :coords="coords"
      :zoom="zoom"
      :controls="controls"
      :detailed-controls="detailedControls"
      :behaviors="behaviors.filter((elem) => elem != 'selection')"
      :cluster-options="clusterOptions"
      :style="styles"
      ref="map"
    >
      <YmapSelectionBehavior
        v-if="behaviors.includes('selection')"
        :map="$refs.map.$options.static.myMap"
        :options="polygonOptions"
      />
      <slot />
    </yandex-map>
  </div>
</template>

<script>
import { yandexMap, loadYmap } from "vue-yandex-maps";
import YmapSelectionBehavior from "./YmapSelectionBehavior.vue";
export default {
  name: "Ymap",
  components: { yandexMap, YmapSelectionBehavior },
  data() {
    return {
      render: 0,
      mounted: false,
    };
  },
  props: {
    settings: {
      type: Object,
      required: true,
    },
    coords: {
      type: Array,
      default: () => [55.75554289958026, 37.619346417968764],
    },
    zoom: {
      type: Number,
      default: 10,
    },
    options: {
      type: Object,
      default: () => {
        return {
          suppressObsoleteBrowserNotifier: true,
          suppressMapOpenBlock: true,
        };
      },
    },
    controls: {
      type: Array,
      default: () => ["default"],
    },
    detailedControls: {
      type: Object,
      default: () => {
        return {
          zoomControl: {
            position: {
              right: "10px",
              top: "100px",
            },
          },
        };
      },
    },
    behaviors: {
      type: Array,
      default: () => ["drag", "multiTouch"],
    },
    clusterOptions: {
      type: Object,
      default: () => {
        return {
          1: {
            clusterDisableClickZoom: false,
            clusterOpenBalloonOnClick: true,
            layout:
              "<h3 class=ballon_header>{{ properties.balloonContentHeader|raw }}</h3>" +
              "<div class=ballon_body>{{ properties.balloonContentBody|raw }}</div>" +
              "<div class=ballon_footer>{{ properties.balloonContentFooter|raw }}</div>",
          },
        };
      },
    },
    polygonOptions: {
      type: Object,
      default: () => {
        return {
          strokeColor: "#1679e7",
          fillColor: "#a2c9d8",
          interactivityModel: "default#transparent",
          strokeWidth: 4,
          opacity: 0.7,
        };
      },
    },
    styles: {
      type: Object,
      default: () => {
        return {
          width: "100%",
          height: "500px",
        };
      },
    },
  },
  async mounted() {
    await loadYmap({ ...this.settings, debug: true });
    this.mounted = true;
    this.reRender();
  },
  methods: {
    reRender() {
      this.render++;
    },
  },
};
</script>

<style>
</style>