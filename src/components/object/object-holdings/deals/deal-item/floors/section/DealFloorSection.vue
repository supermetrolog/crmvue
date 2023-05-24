<template>
  <div class="DealFloorSection" :class="getAppropriateSectionClass(section)">
    <p
      v-if="section.company"
      class="DealFloorSection-text DealFloorSection-text_label"
    >
      {{ section.company.name }}
    </p>
    <p class="DealFloorSection-text DealFloorSection-text_area">
      {{ formatterObject.number(section.area) }}
      <span v-html="UnitTypesList.get(1)" />
    </p>
    <p
      class="DealFloorSection-status"
      :class="{
        success: section.status === 1,
        danger: section.status === 2 || section.status === 3,
        white: section.status === 5,
        black: !section.status,
      }"
    >
      {{
        section.status
          ? DealStatusList.get(section.status)
          : "Сдано или нераспределено"
      }}
    </p>
    <p
      v-if="Array.isArray(section.company) && section.company.length > 0"
      class="DealFloorSection-text DealFloorSection-text_label"
    >
      ???: {{ section.company.join(", ") }}
    </p>
    <div v-if="section.status" class="edit">
      <input
        class="DealFloorSection-checkbox"
        type="checkbox"
        name=""
        :checked="section.checked"
        :id="'section-check_' + floorName + id"
      />
      <label
        class="DealFloorSection-checkbox-label"
        :for="'section-check_' + floorName + id"
      />
      <i class="fas fa-pen"></i>
    </div>
  </div>
</template>
<script>
import { formatterObject } from "@/plugins";
import { UnitTypesList, DealStatusList } from "@/const/Const.js";
import uuid4 from "uuid4";
export default {
  name: "DealFloorSection",
  components: {},
  props: {
    section: {
      type: Object,
      default: () => {},
    },
    floorName: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      formatterObject,
      UnitTypesList,
      DealStatusList,
      id: uuid4(),
    };
  },
  mounted() {
    console.log(Array.isArray(this.section.company));
  },
  methods: {
    getAppropriateSectionClass(section) {
      switch (section.status) {
        case 5:
          return "DealFloorSection_green";
        case 2:
          return "DealFloorSection_purple";
        case 3:
          return "DealFloorSection_purple";
        default:
          return "DealFloorSection_grey";
      }
    },
  },
};
</script>
<style lang="scss" src="./DealFloorSection.scss"></style>
