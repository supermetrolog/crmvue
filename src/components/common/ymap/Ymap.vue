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
      :objectManager-options="clusterOptions"
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
  components: {
    yandexMap,
    YmapSelectionBehavior,
  },
  data() {
    return {
      addTimeout: null,
      removeTimeout: null,
      render: 0,
      mounted: false,
      addMarkers: [],
      removeMarkers: [],
    };
  },
  provide() {
    return {
      add: this.addMarker,
      remove: this.removeMarker,
    };
  },
  static: {
    objectManager: null,
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
          // balloonContentLayout: "objectManager",
          gridSize: 64,
          hasBalloon: true,
          margin: 10,
          clusterIcons: [
            {
              href: require("@/assets/image/ymap-cluster-icon.svg"),
              size: [30, 30],
              offset: [-20, -20],
            },
          ],
          preset: "islands#blueCircleDotIcon",
          useMapMargin: true,
          // zoomMargin: 100,
          // viewportMargin: 200,
          // hasHint: false,
          // minClusterSize: 10,
          sableClickZoom: false,
          clusterOpenBalloonOnClick: true,
          // clusterIconContentLayout: '<i class="fas fa-circle"></i>',
          // clusterBalloonLayout: [
          //   "<ul class=list>",
          //   "{% for geoObject in properties.geoObjects %}",
          //   '<li><a href=# class="list_item">{{ geoObject.properties.balloonContentHeader|raw }}</a></li>',
          //   "{% endfor %}",
          //   "</ul>",
          // ].join(""),
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
    add() {
      const addMarkers = [...this.addMarkers];
      this.addMarkers = [];

      let objectManager = this.$options.static.objectManager;
      const map = this.$refs.map.$options.static.myMap;
      if (!objectManager) {
        objectManager = new window.ymaps.ObjectManager({
          // Чтобы метки начали кластеризоваться, выставляем опцию.
          clusterize: true,
          // ObjectManager принимает те же опции, что и кластеризатор.
          ...this.clusterOptions,
        });
      }

      objectManager.add(addMarkers);
      if (this.$options.static.objectManager == null) {
        map.geoObjects.add(objectManager);
      }
      this.$options.static.objectManager = objectManager;
    },
    addMarker(marker) {
      if (this.addTimeout) {
        clearTimeout(this.addTimeout);
      }
      this.addMarkers.push(marker);
      this.addTimeout = setTimeout(this.add, 100);
    },
    remove() {
      const removeMarkers = [...this.removeMarkers];
      this.removeMarkers = [];
      const objectManager = this.$options.static.objectManager;
      if (objectManager) {
        objectManager.remove(removeMarkers);
      }
    },
    removeMarker(marker) {
      if (this.removeTimeout) {
        clearTimeout(this.removeTimeout);
      }
      this.removeMarkers.push(marker);
      this.removeTimeout = setTimeout(this.remove, 100);
    },
  },
};
</script>

<style>
</style>