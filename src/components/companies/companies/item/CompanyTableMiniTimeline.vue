<template>
  <div class="MiniTimeline media row no-gutters col-12 px-0">
    <div
      class="step request col"
      :class="{
        'step-done': this.currentSteps[0].status === 1,
        'step-in_process': this.currentSteps[0].status === 0,
        'step-attention': this.currentSteps[0].status === 2,
      }"
      v-if="requestName"
    >
      <span>{{ requestName.toUpperCase() }}</span>
      <div class="step-rhombus"></div>
    </div>
    <div
      class="step col"
      :class="{
        'step-done': completedStep(timelineStep[0]),
        'step-in_process': inProcessStep(timelineStep[0]),
        'step-attention': attentionStep(timelineStep[0]),
      }"
      v-for="timelineStep in timelineSteps"
      :key="timelineStep[0]"
    >
      <div class="step-content">
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
      <div class="step-rhombus"></div>
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