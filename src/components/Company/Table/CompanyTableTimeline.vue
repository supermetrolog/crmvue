<template>
    <div class="mini-timeline row no-gutters">
        <div
            v-if="requestName"
            class="mini-timeline__step col"
            :class="{
                done: timeline.steps[0].status === 1,
                'in-process': timeline.steps[0].status === 0,
                attention: timeline.steps[0].status === 2
            }"
        >
            <div class="mini-timeline__arrow mini-timeline__arrow--top"></div>
            <div class="mini-timeline__step-content">
                <div class="d-inline-flex">
                    <Avatar
                        :size="30"
                        :src="timeline.consultant.userProfile.avatar"
                        :label="timeline.consultant.userProfile.medium_name"
                        class="mr-2"
                    />
                    <span class="mini-timeline__step-name">
                        {{ formattedRequestName }}
                    </span>
                </div>
            </div>
            <div class="mini-timeline__arrow mini-timeline__arrow--bottom"></div>
        </div>
        <CompanyTableTimelineStep
            v-for="step in timelineSteps"
            :key="step.id"
            :label="step.shortLabel ?? step.label"
            :origin="timeline.steps[step.id]"
        />
    </div>
</template>

<script setup>
import { Timeline as timelineSteps } from '@/const/const.js';
import CompanyTableTimelineStep from '@/components/Company/Table/CompanyTableTimelineStep.vue';
import { computed } from 'vue';
import Avatar from '@/components/common/Avatar.vue';

const props = defineProps({
    timeline: {
        type: Array,
        default: () => []
    },
    requestName: {
        type: String,
        required: true
    }
});

const formattedRequestName = computed(() => props.requestName.toUpperCase());
</script>
