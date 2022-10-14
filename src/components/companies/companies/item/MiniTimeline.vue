<template>
  <div class="MiniTimeline">
    <div
      class="MiniTimeline-step MiniTimeline-step_done MiniTimeline-request"
      :class="{
        'MiniTimeline-big_size': bigSize,
      }"
      v-if="requestName"
    >
      <span>{{ requestName.toUpperCase() }}</span>
    </div>
    <div
      class="MiniTimeline-step"
      v-for="timelineStep in timelineSteps"
      :key="timelineStep[0]"
      :class="{
        'MiniTimeline-step_done': completedStep(timelineStep[0]),
        'MiniTimeline-step_in_process': inProcessStep(timelineStep[0]),
        'MiniTimeline-step_attention': attentionStep(timelineStep[0]),

        'MiniTimeline-big_size': bigSize,
      }"
    >
      <span class="MiniTimeline-step-name"
        >{{ timelineStep[1].name }}
        <i
          class="fas fa-check-circle success show"
          v-if="completedStep(timelineStep[0])"
        ></i>
        <i
          class="fas fa-hourglass success show"
          v-if="inProcessStep(timelineStep[0])"
        ></i>
        <i
          class="fas fa-exclamation show"
          v-if="attentionStep(timelineStep[0])"
        ></i>
        <i
          class="fas fa-hourglass success"
          v-if="!currentStep(timelineStep[0])"
        ></i>
      </span>
    </div>
  </div>
</template>

<script>
import { Timeline } from "@/const/Const";
export default {
  name: "MiniTimeline",
  props: {
    currentSteps: {
      type: Array,
      default: () => [],
    },
    requestName: {
      type: String,
    },
    bigSize: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      timelineSteps: Timeline.get("param"),
    };
  },
  methods: {
    currentStep(timelineStep) {
      return this.currentSteps.find((step) => step.number === timelineStep);
    },
    completedStep(timelineStep) {
      return this.currentSteps.find(
        (step) => step.number === timelineStep && step.status === 1
      );
    },
    inProcessStep(timelineStep) {
      return this.currentSteps.find(
        (step) => step.number === timelineStep && step.status === 0
      );
    },
    attentionStep(timelineStep) {
      return this.currentSteps.find(
        (step) => step.number === timelineStep && step.status === 2
      );
    },
  },
  computed: {
    screenWidth() {
      return window.innerWidth < 1400;
    },
  },
};
</script>