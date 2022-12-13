<template>
  <div class="MiniTimeline media row no-gutters col-12 px-0">
    <div
      class="MiniTimeline-step col"
      :class="{
        'MiniTimeline-step-done': this.currentSteps[0].status === 1,
        'MiniTimeline-step-in_process': this.currentSteps[0].status === 0,
        'MiniTimeline-step-attention': this.currentSteps[0].status === 2,
      }"
      v-if="requestName"
    >
      <div class="MiniTimeline-arrow MiniTimeline-arrow-top"></div>
      <div class="MiniTimeline-step-content">
        <span class="step-name">{{ requestName.toUpperCase() }}</span>
      </div>
      <div class="MiniTimeline-arrow MiniTimeline-arrow-bottom"></div>
    </div>
    <div
      class="MiniTimeline-step col"
      :class="{
        'MiniTimeline-step-done': completedStep(timelineStep[0]),
        'MiniTimeline-step-in_process': inProcessStep(timelineStep[0]),
        'MiniTimeline-step-attention': attentionStep(timelineStep[0]),
      }"
      v-for="timelineStep in timelineSteps"
      :key="timelineStep[0]"
    >
      <div class="MiniTimeline-arrow MiniTimeline-arrow-top"></div>
      <div class="MiniTimeline-step-content">
        <span class="step-name"
          >{{ timelineStep[1].name }}
          <i
            class="fas fa-check-circle success show"
            v-if="completedStep(timelineStep[0])"
          ></i>
          <i
            class="fas fa-hourglass-half success show"
            v-if="inProcessStep(timelineStep[0])"
          ></i>
          <i
            class="fas fa-exclamation show"
            v-if="attentionStep(timelineStep[0])"
          ></i>
        </span>
      </div>
      <div class="MiniTimeline-arrow MiniTimeline-arrow-bottom"></div>
    </div>
  </div>
</template>

<script>
import { Timeline } from "@/const/Const";

export default {
  name: "CompanyTableMiniTimeline",
  props: {
    currentSteps: {
      type: Array,
      default: () => [],
    },
    requestName: {
      type: String,
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
};
</script>