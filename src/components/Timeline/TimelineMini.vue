<template>
    <div class="MiniTimeline MiniTimeline-big_size row no-gutters col-12 px-0">
        <div
            v-for="timelineStep in timelineSteps"
            :key="timelineStep.id"
            @click.stop="selectStep(timelineStep.id)"
            class="MiniTimeline-step col justify-content-center"
            :class="{
                'MiniTimeline-step-current': currentStep(timelineStep.id),
                'MiniTimeline-step-done': completedStep(timelineStep.id),
                'MiniTimeline-step-in_process': inProcessStep(timelineStep.id),
                'MiniTimeline-step-attention': attentionStep(timelineStep.id),
                'MiniTimeline-step-selected': selectedStep.number === timelineStep.id,
                'MiniTimeline-step-prev': selectedStep.number === timelineStep.id + 1
            }"
        >
            <div class="MiniTimeline-arrow MiniTimeline-arrow-top"></div>
            <div class="MiniTimeline-step-content">
                <span class="step-name">
                    {{ timelineStep.name }}
                    <i
                        v-if="completedStep(timelineStep.id)"
                        class="fas fa-check-circle success show"
                    ></i>
                    <i
                        v-if="inProcessStep(timelineStep.id)"
                        class="fa-solid fa-hourglass-half success show"
                    ></i>
                    <i v-if="attentionStep(timelineStep.id)" class="fas fa-exclamation show"></i>
                </span>
            </div>
            <div class="MiniTimeline-arrow MiniTimeline-arrow-bottom"></div>
            <div
                v-if="selectedStep.number === timelineStep.id"
                class="MiniTimeline-step-parallelogram"
            ></div>
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
            return this.currentSteps.find(
                step => step.number === timelineStep && step.status === 1
            );
        },
        inProcessStep(timelineStep) {
            return this.currentSteps.find(
                step => step.number === timelineStep && step.status === 0
            );
        },
        attentionStep(timelineStep) {
            return this.currentSteps.find(
                step => step.number === timelineStep && step.status === 2
            );
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
