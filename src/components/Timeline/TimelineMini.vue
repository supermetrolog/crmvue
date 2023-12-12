<template>
    <div class="MiniTimeline MiniTimeline-big_size row no-gutters col-12 px-0">
        <div
            @click.stop="selectStep(timelineStep[0])"
            class="MiniTimeline-step col justify-content-center"
            :class="{
        'MiniTimeline-step-current': currentStep(timelineStep[0]),
        'MiniTimeline-step-done': completedStep(timelineStep[0]),
        'MiniTimeline-step-in_process': inProcessStep(timelineStep[0]),
        'MiniTimeline-step-attention': attentionStep(timelineStep[0]),
        'MiniTimeline-step-selected':
          this.selectedStep.number === timelineStep[0],
        'MiniTimeline-step-prev':
          this.selectedStep.number === timelineStep[0] + 1,
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
            <div
                class="MiniTimeline-step-parallelogram"
                v-if="this.selectedStep.number === timelineStep[0]"
            ></div>
        </div>
    </div>
</template>

<script>
import {Timeline} from "@/const/const";

export default {
    name: "TimelineMini",
    props: {
        currentSteps: {
            type: Array,
            default: () => [],
        },
        selectedStep: {
            type: Object,
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
        selectStep(stepNumber) {
            let result = this.currentStep(stepNumber);
            if (result) {
                this.$emit("clickItem", result);
            } else {
                return;
            }
        },
    },
    emits: ["clickItem"],
};
</script>