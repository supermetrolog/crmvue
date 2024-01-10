<template>
    <div class="MiniTimeline MiniTimeline-big_size row no-gutters col-12 px-0">
        <div
            v-for="timelineStep in timelineSteps"
            :key="timelineStep[0]"
            @click.stop="selectStep(timelineStep[0])"
            class="MiniTimeline-step col justify-content-center"
            :class="{
                'MiniTimeline-step-current': currentStep(timelineStep[0]),
                'MiniTimeline-step-done': completedStep(timelineStep[0]),
                'MiniTimeline-step-in_process': inProcessStep(timelineStep[0]),
                'MiniTimeline-step-attention': attentionStep(timelineStep[0]),
                'MiniTimeline-step-selected': selectedStep.number === timelineStep[0],
                'MiniTimeline-step-prev': selectedStep.number === timelineStep[0] + 1
            }"
        >
            <div class="MiniTimeline-arrow MiniTimeline-arrow-top"></div>
            <div class="MiniTimeline-step-content">
                <span
class="step-name"
                    >{{ timelineStep[1].name }}
                    <i v-if="completedStep(timelineStep[0])" class="fas fa-check-circle success show"></i>
                    <i v-if="inProcessStep(timelineStep[0])" class="fas fa-hourglass-half success show"></i>
                    <i v-if="attentionStep(timelineStep[0])" class="fas fa-exclamation show"></i>
                </span>
            </div>
            <div class="MiniTimeline-arrow MiniTimeline-arrow-bottom"></div>
            <div v-if="selectedStep.number === timelineStep[0]" class="MiniTimeline-step-parallelogram"></div>
        </div>
    </div>
</template>

<script>
import { Timeline } from '@/const/const';

export default {
    name: 'TimelineMini',
    emits: ['clickItem'],
    props: {
        currentSteps: {
            type: Array,
            default: () => []
        },
        selectedStep: {
            type: Object
        }
    },
    computed: {
        timelineSteps: () => Timeline
    },
    methods: {
        currentStep(timelineStep) {
            return this.currentSteps.find(step => step.number === timelineStep);
        },
        completedStep(timelineStep) {
            return this.currentSteps.find(step => step.number === timelineStep && step.status === 1);
        },
        inProcessStep(timelineStep) {
            return this.currentSteps.find(step => step.number === timelineStep && step.status === 0);
        },
        attentionStep(timelineStep) {
            return this.currentSteps.find(step => step.number === timelineStep && step.status === 2);
        },
        selectStep(stepNumber) {
            let result = this.currentStep(stepNumber);
            if (result) {
                this.$emit('clickItem', result);
            } else {
                return;
            }
        }
    }
};
</script>
