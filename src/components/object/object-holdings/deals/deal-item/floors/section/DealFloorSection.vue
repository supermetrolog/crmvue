<template>
  <div class="DealFloorSection" :class="getAppropriateSectionClass(section)">
    <p
      v-if="this.section.company"
      class="DealFloorSection-text DealFloorSection-text_label"
    >
      {{ section.company.name }}
    </p>
    <with-unit-type
      class="DealFloorSection-text DealFloorSection-text_area"
      :unitType="unitTypes.SQUARE_METERS"
      :value="formattedArea"
    />
    <p class="DealFloorSection-status" :class="sectionAdditionalClass">
      {{ sectionStatus }}
    </p>
    <p
      v-if="presenceOfSurrendedTerWithUnknownArea"
      class="DealFloorSection-text DealFloorSection-text_label"
    >
      ???: {{ joinedCompanies }}
    </p>
    <div v-if="section.status" class="edit">
      <input
        class="DealFloorSection-checkbox"
        type="checkbox"
        name=""
        :checked="section.checked"
        :id="genSectionInputId(floorName)"
      />
      <label
        class="DealFloorSection-checkbox-label"
        :for="genSectionInputId(floorName)"
      />
      <i class="fas fa-pen"></i>
    </div>
  </div>
</template>
<script>
import { DealStatusType, DealStatusList } from "@/const/Const.js";
import { unitTypes } from "@/const/unitTypes";
import WithUnitType from "@/components/common/with-unit-type/WithUnitType.vue";
export default {
  name: "DealFloorSection",
  components: {
    WithUnitType,
  },
  props: {
    section: {
      type: Object,
      default: () => {},
      required: true,
    },
    floorName: {
      type: String,
      default: null,
    },
    unknownAreaCompanies: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      DealStatusType,
      DealStatusList,
      unitTypes,
    };
  },
  mounted() {},
  computed: {
    sectionStatus() {
      return this.section.status
        ? DealStatusList[this.section.status]
        : "Сдано или нераспределено";
    },
    presenceOfSurrendedTerWithUnknownArea() {
      return (
        Array.isArray(this.unknownAreaCompanies) &&
        this.unknownAreaCompanies.length > 0
      );
    },
    formattedArea() {
      return this.$formatter.number(this.section.area);
    },
    sectionAdditionalClass() {
      return {
        success: this.section.status === DealStatusType.FOR_RENT,
        danger:
          this.section.status === DealStatusType.RENTED_OUT ||
          this.section.status === DealStatusType.SOLD_OUT,
        white: this.section.status === DealStatusType.FREE,
        black: !this.section.status,
      };
    },
    joinedCompanies() {
      return this.unknownAreaCompanies.join(", ");
    },
  },
  methods: {
    genSectionInputId(floorName) {
      return "section-check_" + floorName;
    },
    getAppropriateSectionClass(section) {
      switch (section.status) {
        case DealStatusType.FREE:
          return "DealFloorSection_green";
        case DealStatusType.RENTED_OUT:
          return "DealFloorSection_purple";
        case DealStatusType.SOLD_OUT:
          return "DealFloorSection_purple";
        default:
          return "DealFloorSection_grey";
      }
    },
  },
};
</script>
<style lang="scss" src="./DealFloorSection.scss"></style>
