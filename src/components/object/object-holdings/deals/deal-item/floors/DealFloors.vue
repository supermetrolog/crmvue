<template>
  <div class="DealFloors">
    <div class="DealFloors-body">
      <ul class="DealFloors-head-list">
        <li
          class="DealFloors-head-list-item"
          v-for="(floor, idx) in floorWithSortedSections"
          :key="floor.name"
        >
          <div class="DealFloors-head-list-card">
            <div class="DealFloors-head-list-card-top">
              <p class="DealFloors-text DealFloors-text_head-label">
                {{ floor.name }}
              </p>
              <p class="DealFloors-text DealFloors-text_head-area">
                {{ formatterObject.number(floor.area) }}
                <span v-html="UnitTypesList.get(1)" />
              </p>
            </div>
            <div class="DealFloors-head-list-card-bottom">
              <div class="edit">
                <input
                  class="DealFloors-checkbox"
                  type="checkbox"
                  name=""
                  :checked="floor.checked"
                  :id="'check_' + floor.name + idx"
                />
                <label
                  class="DealFloors-checkbox-label"
                  :for="'check_' + floor.name + idx"
                />
                <i class="fas fa-pen"></i>
              </div>
            </div>
          </div>
          <div class="DealFloors-separator">
            <i class="fas fa-arrow-right"></i>
          </div>
        </li>
      </ul>
      <div class="DealFloors-sections">
        <div class="DealFloors-sections-body">
          <div
            class="DealFloors-sections-line"
            v-for="floor in floorWithSortedSections"
            :key="floor.name"
          >
            <DealFloorSection
              v-for="(section, idx) in getSectionsWithKnownArea(floor.sections)"
              :style="{ width: getSectionWidth(floor.area, section.area) }"
              :key="idx"
              :section="section"
              :floorName="floor.name"
            />
            <DealFloorSection
              v-if="getUnknownSectionArea(floor.sections, floor.area) > 0"
              :style="{
                width: getSectionWidth(
                  floor.area,
                  getUnknownSectionArea(floor.sections, floor.area)
                ),
              }"
              :section="{
                company: getSectionsNameWithUnKnownArea(floor.sections),
                area: getUnknownSectionArea(floor.sections, floor.area),
                status: null,
                checked: null,
              }"
              :floorName="floor.name"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatterObject } from "@/plugins";
import { UnitTypesList, DealStatusList } from "@/const/Const.js";
import DealFloorSection from "./section/DealFloorSection.vue";

export default {
  name: "DealFloors",
  components: { DealFloorSection },
  props: {
    floors: { type: Array, default: () => [] },
  },
  data() {
    return {
      formatterObject,
      UnitTypesList,
      DealStatusList,
    };
  },
  computed: {
    floorWithSortedSections() {
      return this.floors.map((floor) => ({
        ...floor,
        sections: [
          ...floor.sections.filter(
            (section) => section.company && section.area
          ),
          ...floor.sections.filter((section) => section.status === 5),
          ...floor.sections.filter((section) => !section.area),
        ],
      }));
    },
  },
  methods: {
    getSectionWidth(mainArea, sectionArea) {
      return `${(sectionArea / mainArea) * 100}%`;
    },
    getUnknownSectionArea(sections, floorArea) {
      return sections
        .filter((section) => section.area)
        .reduce(
          (accumulator, section) => accumulator - section.area,
          floorArea
        );
    },
    getSectionsWithKnownArea(sections) {
      return sections.filter((section) => section.area);
    },
    getSectionsNameWithUnKnownArea(sections) {
      const res = sections
        .filter((section) => !section.area)
        .map((section) => section.company.name);

      return res;
    },
    getAppropriateSectionClass(section) {
      switch (section.status) {
        case 5:
          return "DealFloors-section_green";
        default:
          if (section.company) {
            return "DealFloors-section_purple";
          }
          return "DealFloors-section_grey";
      }
    },
  },
};
</script>
<style lang="scss" src="./styles.scss"></style>
