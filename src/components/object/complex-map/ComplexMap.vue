<template>
  <div class="ComplexMap">
    <div class="ComplexMap-description" :class="{ disabled: mapIsOpened }">
      <div class="ComplexMap-description-item" v-if="complex.region">
        {{ complex.region }}
      </div>
      <div class="ComplexMap-description-item" v-if="complex.district">
        {{ complex.district }}
      </div>
      <div class="ComplexMap-description-item" v-if="complex.direction">
        {{ complex.direction }}
      </div>
      <div class="ComplexMap-description-item" v-if="complex.locality">
        {{ complex.locality }}
      </div>
      <div class="ComplexMap-description-item" v-if="complex.highway">
        {{ complex.highway }}
      </div>
      <div class="ComplexMap-description-item" v-if="complex.highwaySecondary">
        {{ complex.highwaySecondary }}
      </div>
      <div
        class="ComplexMap-description-item"
        :title="complex.metro"
        v-if="complex.metro"
      >
        <div v-if="metroLogo">
          <img
            :src="require(`../../../assets/image/${metroLogo}.png`)"
            alt="метро"
          />
        </div>
        <span>{{ complex.metro }}</span>
      </div>
      <div class="ComplexMap-description-item" v-if="complex.fromMkad">
        {{ complex.fromMkad }} км от МКАД
      </div>
      <div class="ComplexMap-description-actions" v-if="isAdmin">
        <button class="ComplexMap-description-actions-item" title="See more">
          <i class="fas fa-angle-down" />
        </button>
        <button class="ComplexMap-description-actions-item" title="Add new">
          <i class="fas fa-plus-circle" />
        </button>
      </div>
    </div>
    <div class="ComplexMap-control">
      <div class="ComplexMap-button" title="Open map" @click="openMap">
        <i class="fas fa-map-marker-alt" :class="{ active: mapIsOpened }"></i>
      </div>
    </div>
    <Ymap
      :settings="map.settings"
      :styles="map.styles"
      :detailedControls="map.detailedControls"
      :behaviors="map.behaviors"
      :coords="complexCoords"
      :key="randKey"
    />
  </div>
</template>

<script lang="ts">
import ComplexInterface from "@/interfaces/complex.interface";
import Ymap from "../../common/ymap/Ymap.vue";
import "./styles.scss";
import { PropType, defineComponent } from "vue";

interface IMapDetailedControlsItem {
  position?: {
    top: string;
    right?: string;
    left?: string;
  };
  visible: boolean;
}

export default defineComponent({
  name: "ComplexMap",
  components: { Ymap },
  props: {
    complex: {
      type: Object as PropType<ComplexInterface>,
      required: true,
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
        } as Record<string, IMapDetailedControlsItem>,
        behaviors: [] as string[],
      },
      mapIsOpened: false,
      randKey: 0,
      isAdmin: true,
    };
  },
  computed: {
    metroLogo() {
      if (
        this.complex.locality === "Москва" ||
        this.complex.region === "Московская область"
      ) {
        return "metro";
      }
      if (
        this.complex.locality === "Санкт Петербург" ||
        this.complex.region === "Ленинградская область"
      ) {
        return "metro_spb";
      } else {
        return null;
      }
    },
    complexCoords() {
      const { latitude, longitude } = this.complex;
      return latitude && longitude
        ? [latitude, longitude]
        : [55.75554289958026, 37.619346417968764];
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
});
</script>

<style scoped></style>
