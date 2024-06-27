<template>
    <div class="mini-timeline row no-gutters">
        <div
            v-if="requestName"
            class="mini-timeline__step col"
            :class="{
                done: currentSteps[0].status === 1,
                'in-process': currentSteps[0].status === 0,
                attention: currentSteps[0].status === 2
            }"
        >
            <div class="mini-timeline__arrow mini-timeline__arrow--top"></div>
            <div class="mini-timeline__step-content">
                <span class="mini-timeline__step-name">
                    {{ requestName.toUpperCase() }}
                </span>
            </div>
            <div class="mini-timeline__arrow mini-timeline__arrow--bottom"></div>
        </div>
        <CompanyTableTimelineStep
            v-for="step in timelineSteps"
            :key="step.id"
            :label="step.label"
            :origin="currentSteps[step.id]"
        />
    </div>
</template>

<script setup>
import { Timeline as timelineSteps } from '@/const/const.js';
import CompanyTableTimelineStep from '@/components/Company/Table/CompanyTableTimelineStep.vue';

defineProps({
    currentSteps: {
        type: Array,
        default: () => []
    },
    requestName: {
        type: String,
        default: null
    }
});
</script>
