<template>
    <div class="MiniTimeline media row no-gutters col-12 px-0">
        <div
            v-if="requestName"
            class="MiniTimeline-step col"
            :class="{
                'MiniTimeline-step-done': currentSteps[0].status === 1,
                'MiniTimeline-step-in_process': currentSteps[0].status === 0,
                'MiniTimeline-step-attention': currentSteps[0].status === 2
            }"
        >
            <div class="MiniTimeline-arrow MiniTimeline-arrow-top"></div>
            <div class="MiniTimeline-step-content">
                <span class="step-name">{{ requestName.toUpperCase() }}</span>
            </div>
            <div class="MiniTimeline-arrow MiniTimeline-arrow-bottom"></div>
        </div>
        <div
            v-for="timelineStep in timelineSteps"
            :key="timelineStep.id"
            class="MiniTimeline-step col"
            :class="{
                'MiniTimeline-step-done': completedStep(timelineStep.id),
                'MiniTimeline-step-in_process': inProcessStep(timelineStep.id),
                'MiniTimeline-step-attention': attentionStep(timelineStep.id)
            }"
        >
            <div class="MiniTimeline-arrow MiniTimeline-arrow-top"></div>
            <div class="MiniTimeline-step-content">
                <span class="step-name"
                    >{{ timelineStep.name }}
                    <i
                        v-if="completedStep(timelineStep.id)"
                        class="fas fa-check-circle success show"
                    ></i>
                    <i
                        v-if="inProcessStep(timelineStep.id)"
                        class="fas fa-hourglass-half success show"
                    ></i>
                    <i v-if="attentionStep(timelineStep.id)" class="fas fa-exclamation show"></i>
                </span>
            </div>
            <div class="MiniTimeline-arrow MiniTimeline-arrow-bottom"></div>
        </div>
    </div>
</template>

<script>
import { Timeline } from '@/const/const.js';

export default {
    name: 'CompanyTableTimeline',
    props: {
        currentSteps: {
            type: Array,
            default: () => []
        },
        requestName: {
            type: String
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
        }
    }
};
</script>
