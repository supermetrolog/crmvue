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
      :use-object-manager="useObjectManager"
      :object-manager-clusterize="objectManagerClusterize"
      ref="map"
    >
      <YmapSelectionBehavior
        v-if="behaviors.includes('selection')"
        :map="$refs.map.$options.static.myMap"
        :options="polygonOptions"
        @selectionDone="selectionDone"
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
  // Пришлось переопределить метод удаления, чтобы заработало все. Иначе ошибка при рендере после того как построится полигон
  provide() {
    return {
      deleteMarker2: (id) => {
        this.$refs.map.deleteMarkers([id]);
      },
    };
  },
  props: {
    settings: {
      type: Object,
      required: true,
    },
    coords: {
      type: Array,
      default: () => [55.75554289958026, 37.619346417968764], // moscow center
    },
    zoom: {
      type: Number,
      default: 8,
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
          // point -> cluster-name in ymap-marker
          point: {
            // balloonContentLayout: "cluster",
            // gridSize: 16,
            hasBalloon: true,
            margin: 300,
            clusterIcons: [
              {
                href: require("@/assets/image/ymap-cluster-icon.svg"),
                size: [40, 40],
                offset: [-20, -20],
              },
            ],
            preset: "islands#invertedVioletClusterIcons",
            useMapMargin: true,
            // zoomMargin: 100,
            // viewportMargin: 200,
            // hasHint: false,
            // minClusterSize: 10,
            sableClickZoom: false,
            clusterOpenBalloonOnClick: true,
            layout:
              "<h3 class=ballon_header>{{ properties.balloonContentHeader|raw }}</h3>" +
              "<div class=ballon_body>{{ properties.balloonContentBody|raw }}</div>" +
              "<div class=ballon_footer>{{ properties.balloonContentFooter|raw }}</div>",
            // clusterIconContentLayout: '<i class="fas fa-circle"></i>',
            // clusterBalloonLayout: [
            //   "<ul class=list>",
            //   "{% for geoObject in properties.geoObjects %}",
            //   '<li><a href=# class="list_item">{{ geoObject.properties.balloonContentHeader|raw }}</a></li>',
            //   "{% endfor %}",
            //   "</ul>",
            // ].join(""),
          },
        };
      },
    },
    useObjectManager: {
      type: Boolean,
      default: false,
    },
    objectManagerClusterize: {
      type: Boolean,
      default: false,
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
          accuracy: 3,
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
  },
  methods: {
    selectionDone(coordinates) {
      this.$emit("selectionDone", coordinates);
    },
  },
};
</script>

<style>
</style>