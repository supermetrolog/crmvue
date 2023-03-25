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
      :style="styles"
      ref="map"
    >
      <YmapSelectionBehavior
        v-if="behaviors.includes('selection')"
        :map="$refs.map.$options.static.myMap"
        :options="polygonOptions"
        :coordinates="polygonCoordinates"
        @selectionDone="selectionDone"
        @removedDone="$emit('removedDone')"
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
      updateTimeour: null,
      render: 0,
      mounted: false,
      addMarkers: [],
      removeMarkers: [],
      runnedRemoveOrAdd: false,
      markers: [],
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
          balloonContentLayout: null,
          gridSize: 64,
          hasHint: true,
          hasBalloon: true,
          margin: 10,
          clusterIcons: [
            {
              href: require("@/assets/image/ymap-cluster-icon.svg"),
              size: [30, 30],
              offset: [-20, -20],
            },
          ],
          minClusterSize: 2,
          preset: "islands#blueCircleDotIcon",
          useMapMargin: true,
          zoomMargin: null,
          viewportMargin: null,
          sableClickZoom: false,
          clusterOpenBalloonOnClick: false,
          // clusterIconContentLayout: null
          clusterBalloonLayout: null,
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
    polygonCoordinates: {
      type: Array,
      default: () => [],
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
    await loadYmap({ ...this.settings });
    this.mounted = true;
  },
  methods: {
    destroyMap() {
      this.getMap().destroy();
      this.$options.static.objectManager = null;
    },
    selectionDone(coordinates) {
      this.$emit("selectionDone", coordinates);
    },
    getMap() {
      return this.$refs.map.$options.static.myMap;
    },
    getObjectManager() {
      let objectManager = this.$options.static.objectManager;
      if (!objectManager) {
        objectManager = new window.ymaps.ObjectManager({
          clusterize: true,
          ...this.clusterOptions,
        });
      }
      return objectManager;
    },
    addMarkersToObjectManager(markers) {
      const objectManager = this.getObjectManager();
      objectManager.add(markers);
      this.addObjectManagerToMap(objectManager);
    },
    addObjectManagerToMap(objectManager) {
      const map = this.getMap();

      if (this.$options.static.objectManager == null) {
        map.geoObjects.add(objectManager);
      }

      this.$options.static.objectManager = objectManager;
    },
    triggerUpdated() {
      this.$emit("updated");
    },
    addMarker(marker) {
      if (this.updateTimeour) {
        clearTimeout(this.updateTimeour);
      }
      this.addMarkers.push(marker);
      this.updateTimeour = setTimeout(this.update, 100);
    },
    removeMarker(marker) {
      if (this.updateTimeour) {
        clearTimeout(this.updateTimeour);
      }
      this.removeMarkers.push(marker.id);
      this.updateTimeour = setTimeout(this.update, 100);
    },
    removeObjectManager() {
      const objectManager = this.$options.static.objectManager;
      if (objectManager) {
        this.getMap().geoObjects.remove(objectManager);
        this.$options.static.objectManager = null;
      }
    },
    update() {
      this.removeObjectManager();

      this.markers = this.markers.filter(
        (marker) => !this.removeMarkers.includes(marker.id)
      );

      this.markers.push(...this.addMarkers);

      this.addMarkersToObjectManager(this.markers);

      this.removeMarkers = [];
      this.addMarkers = [];
      this.triggerUpdated();
    },
  },

  beforeUnmount() {
    this.destroyMap();
  },
};
</script>

<style>
</style>