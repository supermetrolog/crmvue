<template>
  <div class="DealFloors">
    <div class="DealFloors-body">
      <teleport to="body">
        <transition
          mode="out-in"
          enter-active-class="animate__animated animate__zoomIn for__modal absolute"
          leave-active-class="animate__animated animate__zoomOut for__modal absolute"
        >
          <create-floor-block-form :object="object" @close="toggleCreateBlockForm" v-if="createBlockFormIsVisible"/>
        </transition>
      </teleport>
      <ul class="DealFloors-head-list">
        <li
          class="DealFloors-head-list-item"
          v-for="floor in floorWithSortedSections"
          :key="floor.name"
        >
          <DealFloorHead
            :area="floor.area"
            :checked="floor.checked"
            :name="floor.name"
            @openForm="toggleCreateBlockForm"
          />
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
              :style="{
                width: getSectionWidth(
                  floor.area.valueMax,
                  section.area.valueMax
                ),
              }"
              :key="idx"
              :section="section"
              :floorName="floor.name"
            />
            <DealFloorSection
              v-if="
                getUnknownSectionArea(floor.sections, floor.area.valueMax) > 0
              "
              :style="{
                width: getSectionWidth(
                  floor.area.valueMax,
                  getUnknownSectionArea(floor.sections, floor.area.valueMax)
                ),
              }"
              :section="{
                area: getUnknownSectionArea(
                  floor.sections,
                  floor.area.valueMax
                ),
                status: null,
                checked: null,
              }"
              :floorName="floor.name"
              :unknownAreaCompanies="
                getSectionsNameWithUnKnownArea(floor.sections)
              "
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import {DealStatusType} from "@/const/Const.js";
import DealFloorSection from "./section/DealFloorSection.vue";
import DealFloorHead from "./head/DealFloorHead.vue";
import CreateFloorBlockForm
  from "@/components/complex/object-holdings/forms/create-floor-block-form/CreateFloorBlockForm.vue"
import IObject from "@/interfaces/object.interface";

export default defineComponent({
  name: "DealFloors",
  components: {
    DealFloorSection, 
    DealFloorHead,
    CreateFloorBlockForm
  },
  props: {
    floors: {
      type: Array,
      default: () => []
    },
    object: {
      object: Object as PropType<IObject>,
      required: true,
    }
  },
  data() {
    return {
      DealStatusType,
      createBlockFormIsVisible: false,
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
          ...floor.sections.filter(
            (section) => section.status === DealStatusType.FREE
          ),
          ...floor.sections.filter((section) => !section.area),
        ],
      }));
    },
  },
  methods: {
    toggleCreateBlockForm() {
      this.createBlockFormIsVisible = !this.createBlockFormIsVisible;
    },
    getSectionWidth(mainArea, sectionArea) {
      return `${(sectionArea / mainArea) * 100}%`;
    },
    getUnknownSectionArea(sections, floorArea) {
      return sections
        .filter((section) => section.area)
        .reduce(
          (accumulator, section) => accumulator - section.area.valueMax,
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
        case DealStatusType.FREE:
          return "DealFloors-section_green";
        default:
          if (section.company) {
            return "DealFloors-section_purple";
          }
          return "DealFloors-section_grey";
      }
    },
  },
});
</script>
<style lang="scss" src="./styles.scss"></style>
