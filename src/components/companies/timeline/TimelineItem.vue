<template>
  <div
    class="timeline-container col-12"
    :class="[
      stepParam[data.number][1].class,
      stepParam[data.number][1].stepName,
    ]"
  >
    <div class="timeline-icon">
      <i :class="stepParam[idx][1].icon"></i>
    </div>
    <div
      class="timeline-body"
      :class="{
        selected: this.$route.query.step == data.number,
        return: !data.status,
      }"
    >
      <div class="done" v-if="data.status">
        <i class="fas fa-check text-success"></i>
      </div>
      <Loader class="center small" v-if="loader == data.id" />
      <h4 class="timeline-title" @click="clickSelectStep">
        <span class="badge-1">{{ stepParam[data.number][1].name }}</span>
      </h4>
      <hr />
      <div class="row no-gutters">
        <div class="timeline-actions row">
          <component
            :is="stepParam[data.number][1].stepName + 'Stages'"
            :step="data"
          >
          </component>
        </div>
      </div>

      <div class="row mt-2">
        <div class="col-12 text-right">
          <p class="timeline-subtitle">{{ data.created_at }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Timeline } from "@/const/Const";
import Loader from "@/components/Loader";
import MeetingStages from "./steps/steps-stages/Meeting.vue";
import OffersStages from "./steps/steps-stages/Offers.vue";
import FeedbackStages from "./steps/steps-stages/Feedback.vue";
import InspectionStages from "./steps/steps-stages/Inspection.vue";
import VisitStages from "./steps/steps-stages/Visit.vue";
import InterestStages from "./steps/steps-stages/Interest.vue";
import TalkStages from "./steps/steps-stages/Talk.vue";
import DealStages from "./steps/steps-stages/Deal.vue";
export default {
  name: "TimelineItem",
  components: {
    MeetingStages,
    OffersStages,
    FeedbackStages,
    InspectionStages,
    VisitStages,
    InterestStages,
    TalkStages,
    DealStages,
    Loader,
  },
  data() {
    return {
      stepParam: Timeline.get("param"),
    };
  },
  props: {
    data: {
      type: Object,
    },
    idx: {
      type: Number,
    },
    loader: {
      type: [Number, Boolean],
      default: false,
    },
    selectedStep: {
      type: Object,
    },
  },
  computed: {
    disabled() {
      return this.$route.query.step == this.data.number ? false : true;
    },
  },
  methods: {
    clickSelectStep() {
      this.$emit("clickItem", this.data);
    },
  },
  emits: ["clickItem"],
};
</script>

<style>
</style>