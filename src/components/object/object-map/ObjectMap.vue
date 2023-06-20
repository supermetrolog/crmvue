<template>
  <div class="ObjectMap">
    <div class="ObjectMap-description" :class="{ disabled: mapIsOpened }">
      <div
        class="ObjectMap-description-item"
        v-for="item in address"
        :key="item"
      >
        {{ item }}
      </div>
      <!-- <div class="ObjectMap-description-item" v-if="region">{{ region }}</div>
      <div class="ObjectMap-description-item" v-if="district">
        {{ district }}
      </div>
      <div class="ObjectMap-description-item" v-if="direction">
        {{ direction }}
      </div>
      <div class="ObjectMap-description-item" v-if="town">{{ town }}</div>
      <div class="ObjectMap-description-item" v-if="highway">{{ highway }}</div> -->
      <div class="ObjectMap-description-item" :title="metro" v-if="metro">
        <div v-if="metroLogo">
          <img
            :src="require(`../../../assets/image/${metroLogo}.png`)"
            alt="метро"
          />
        </div>
        <span>{{ metro }}</span>
      </div>
      <div class="ObjectMap-description-item" v-if="fromMkad">
        {{ fromMkad }} км от МКАД
      </div>
      <div class="ObjectMap-description-actions" v-if="isAdmin">
        <button class="ObjectMap-description-actions-item" title="See more">
          <i class="fas fa-angle-down" />
        </button>
        <button class="ObjectMap-description-actions-item" title="Add new">
          <i class="fas fa-plus-circle" />
        </button>
      </div>
    </div>
    <div class="ObjectMap-control">
      <div class="ObjectMap-button" title="Open map" @click="openMap">
        <i class="fas fa-map-marker-alt" :class="{ active: mapIsOpened }"></i>
      </div>
    </div>
    <Ymap
      :settings="map.settings"
      :styles="map.styles"
      :detailedControls="map.detailedControls"
      :behaviors="map.behaviors"
      :coords="coords"
      :key="randKey"
    />
  </div>
</template>

<script>
import Ymap from "../../common/ymap/Ymap.vue";
import "./styles.scss";

export default {
  name: "ObjectMap",
  components: { Ymap },
  props: {
    // region: { type: String, default: null },
    // district: { type: String, default: null },
    // districtMoscow: { type: String, default: null },
    // direction: { type: String, default: null },
    // town: { type: String, default: null },
    // highway: { type: String, default: null },
    // highwayMoscow: { type: String, default: null },
    address: {
      type: Array,
      required: true,
      default: () => [],
    },
    metro: { type: Number, default: null },
    fromMkad: {
      type: [String, Number],
      default: null,
    },
    coords: {
      type: Array,
      default: () => [55.75554289958026, 37.619346417968764], // moscow center
    },
  },
  data() {
    return {
      map: {
        settings: {
          height: "70px",
        },
        styles: {
          width: "100%",
          height: "70px",
        },
        detailedControls: {
          zoomControl: {
            position: {
              right: "10px",
              top: "110px",
            },
            visible: false,
          },
          geolocationControl: {
            position: {
              top: "70px",
              left: "10px",
            },
            visible: false,
          },
          trafficControl: {
            position: {
              top: "70px",
              right: "140px",
            },
            visible: false,
          },
          typeSelector: {
            position: {
              top: "70px",
              right: "45px",
            },
            visible: false,
          },
          searchControl: {
            position: {
              top: "70px",
              left: "45px",
            },
            visible: false,
          },
          fullscreenControl: {
            position: {
              top: "70px",
              right: "10px",
            },
            visible: false,
          },
          rulerControl: {
            visible: false,
          },
        },
        behaviors: [],
      },
      mapIsOpened: false,
      randKey: 0,
      isAdmin: true,
    };
  },
  computed: {
    metroLogo() {
      if (
        this.address.includes("Москва") ||
        this.address.includes("Московская область")
      ) {
        return "metro";
      }
      if (
        this.address.includes("Санкт Петербург") ||
        this.address.includes("Ленинградская область")
      ) {
        return "metro_spb";
      } else {
        return null;
      }
    },
  },
  methods: {
    openMap() {
      if (this.mapIsOpened) {
        this.mapIsOpened = false;
        this.map.styles.height = "70px";
        this.randKey = Math.round(Math.random() * 1000);
        for (const [key, value] of Object.entries(this.map.detailedControls)) {
          this.map.detailedControls[key] = { ...value, visible: false };
        }
        this.map.behaviors = [];
      } else {
        this.mapIsOpened = true;
        this.map.styles.height = "500px";
        this.randKey = Math.round(Math.random() * 1000);
        for (const [key, value] of Object.entries(this.map.detailedControls)) {
          this.map.detailedControls[key] = { ...value, visible: true };
        }
        this.map.behaviors = ["drag", "multiTouch", "scrollZoom"];
      }
    },
  },
};
</script>

<style scoped></style>
