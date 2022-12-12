<template>
  <div class="CompanyBoxObjectsListItem">
    <div class="CompanyBoxObjectsListItem-wrapper">
      <div
        class="CompanyBoxObjectsListItem-image"
        :title="object.description_auto || 'нет описания'"
      >
        <div class="CompanyBoxObjectsListItem-image-container">
          <a :href="objectUrl" target="_blank">
            <img :src="imageSrc" alt="image" />
          </a>
        </div>
      </div>
      <div class="CompanyBoxObjectsListItem-info">
        <div class="CompanyBoxObjectsListItem-info-title">
          <span>ID-{{ object.id }}</span>
          <span> | </span>
          <span
            >{{ $formatter.number(object.area_building) }} м<sup>2</sup></span
          >
        </div>
        <div class="CompanyBoxObjectsListItem-info-address">
          <span>{{ object.address }}</span>
        </div>
        <div
          class="CompanyBoxObjectsListItem-info-direction"
          v-if="!!locationHandler"
        >
          <span>{{ locationHandler }}</span>
        </div>
        <div class="CompanyBoxObjectsListItem-info-mkad">18 км от МКАД</div>
      </div>
    </div>
    <!-- <div class="row no-gutters" v-if="object.offerMix"> -->
    <!-- <CompanyObjectItemOffer
        v-for="offer in object.offerMix"
        :key="offer.id"
        :offer="offer"
        class="main"
      /> -->
    <!-- </div> -->
    <div class="CompanyBoxObjectsListItem-dropdown">
      <hr />
      <div><button>Предложения</button><button>Арендаторы</button></div>
    </div>
  </div>
</template>

<script>
import { OldDbDirectionList, DistrictList } from "@/const/Const.js";
// import CompanyObjectItemOffer from "./CompanyObjectItemOffer.vue";
export default {
  name: "CompanyObjectItem",
  components: {
    // CompanyObjectItemOffer,
  },
  props: {
    object: {
      type: Object,
    },
  },
  data() {
    return {
      directionList: OldDbDirectionList,
      districtList: DistrictList.get("param"),
    };
  },
  computed: {
    imageSrc() {
      const photo = this.object.photo;
      if (photo && Array.isArray(photo)) {
        return "https://pennylane.pro" + photo[0];
      }
      return this.$apiUrlHelper.fileNotFoundUrl();
    },
    objectUrl() {
      return "https://pennylane.pro/complex/" + this.object.complex_id;
    },
    locationHandler() {
      let direction =
        typeof this.object.complex.location.direction === "number"
          ? this.directionList[this.object.complex.location.direction].long
          : null;
      let highway = this.object.complex.location.highwayRel.title;
      highway
        ? (highway = highway[0].toUpperCase() + highway.slice(1) + " ш.")
        : highway;
      if (direction && highway) {
        return `${direction}, ${highway}`;
      }
      if (direction || highway) {
        return `${direction || highway}`;
      } else {
        return "";
      }
    },
  },
};
</script>

<style>
</style>