<template>
  <div class="container-timeline">
    <link
      rel="stylesheet"
      href="https://use.fontawesome.com/releases/v5.3.1/css/all.css"
    />
    <div class="row">
      <div
        v-for="(items, index) in this.TIMELINE"
        :key="index"
        class="timeline col"
        :class="{ branch: index > 0 }"
        :style="getMarginTopValue(items[0].step, index)"
      >
        <TimelineItem
          v-for="(item, idx) in items"
          :key="item.id"
          :data="item"
          :idx="idx"
          :existNextBranch="existNextBranch(index)"
          :currentBranch="index"
          @updateItem="clickUpdateItem"
          @createNewBranch="clickCreateNewBranch"
          @createNewItem="clickCreateNewItem"
        >
          <template v-slot:actions="{ stepName, disabled, isConfirmed }">
            <component
              :is="stepName"
              :actions="item.actions"
              :disabled="disabled"
              :isConfirmed="isConfirmed"
              ref="actionsComponent"
            >
            </component>
          </template>
        </TimelineItem>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import TimelineItem from "./TimelineItem";
import Meeting from "./step-actions/Meeting.vue";
import Offers from "./step-actions/Offers.vue";
export default {
  name: "Timeline",
  components: {
    TimelineItem,
    Meeting,
    Offers,
  },
  varticalOffsetTimeline: 370,
  computed: {
    ...mapGetters(["TIMELINE"]),
  },
  methods: {
    ...mapActions([
      "FETCH_TIMELINE",
      "UPDATE_ITEM",
      "CREATE_NEW_BRANCH",
      "CREATE_NEW_ITEM",
    ]),
    getMarginTopValue(step, index) {
      if (index == 0) return;
      return {
        marginTop: step * this.$options.varticalOffsetTimeline + "px",
      };
    },
    existNextBranch(index) {
      return this.TIMELINE[index + 1] ? true : false;
    },
    clickUpdateItem(item) {
      item.actions = this.$refs.actionsComponent.getData();
      this.UPDATE_ITEM(item);
    },
    clickCreateNewBranch(item) {
      this.CREATE_NEW_BRANCH(item);
    },
    clickCreateNewItem(param) {
      this.CREATE_NEW_ITEM(param);
    },
  },
  async mounted() {
    this.FETCH_TIMELINE();
  },
};
</script>

<style>
</style>
//Этапы бизнес процесса от звонка до сделки