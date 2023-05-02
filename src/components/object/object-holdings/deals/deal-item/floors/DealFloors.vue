<template>
  <div class="DealFloors">
    <div class="DealFloors-item" v-for="floor in floors" :key="floor.name">
      <div class="DealFloors-item-head">
        <div class="head-top">
          <span>{{ floor.name }}</span>
          <span>{{ floor.area }} м<sup>2</sup></span>
        </div>
        <div class="head-bottom">
          <input type="checkbox" name="" id="" />
          <i class="fas fa-pen"></i>
        </div>
      </div>
      <div class="DealFloors-separator">
        <i class="fas fa-arrow-right"></i>
      </div>
      <div class="DealFloors-sections">
        <div
          class="DealFloors-section"
          :style="{ width: getSectionWidth(floor.area, section.area) }"
          v-for="(section, idx) in floor.sections"
          :key="idx"
        >
          <span>{{ section.company.name }}</span>
          <span>{{ section.area }} м<sup>2</sup></span>
          <span>{{ section.status }}</span>
          <div class="edit">
            <input type="checkbox" name="" id="" />
            <i class="fas fa-pen"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "./styles.scss";

export default {
  name: "DealFloors",
  components: {},
  props: {
    floors: { type: Array, default: () => [] },
  },
  data() {
    return {};
  },
  computed: {},
  methods: {
    getSectionWidth(mainArea, sectionArea) {
      return `${(sectionArea / mainArea) * 100}%`;
    },
  },
};
</script>
