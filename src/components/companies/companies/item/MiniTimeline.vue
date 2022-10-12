<template>
  <div class="MiniTimeline">
    <div
      class="MiniTimeline-step"
      v-for="timelineStep in timelineSteps"
      :key="timelineStep[0]"
      :class="{
        'MiniTimeline-step_done': currentSteps.find(
          (step) => step.number == timelineStep[0] && step.status === 1
        ),
        'MiniTimeline-step_in_process': currentSteps.find(
          (step) => step.number == timelineStep[0] && step.status === 0
        ),
        'MiniTimeline-big_size': bigSize,
      }"
    >
      <span class="MiniTimeline-step-name"
        >{{ timelineStep[1].name }}
        <i
          class="fas fa-check-circle success show"
          v-if="
            currentSteps.find(
              (step) => step.number == timelineStep[0] && step.status === 1
            )
          "
        ></i>
        <i
          class="fas fa-hourglass success show"
          v-if="
            currentSteps.find(
              (step) => step.number == timelineStep[0] && step.status === 0
            )
          "
        ></i>
        <i
          class="fas fa-hourglass success"
          v-if="!currentSteps.find((step) => step.number == timelineStep[0])"
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
};
</script>