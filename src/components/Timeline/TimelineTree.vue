<template>
    <div class="timeline-tree">
        <div class="timeline-tree__progress">
            <span class="timeline-tree__line"></span>
            <TimelineTreeStep
                v-for="step in steps"
                :key="step.id"
                @select="$emit('select', $event)"
                :step="step"
                :selected="selected"
                :current="current"
            />
        </div>
    </div>
</template>

<script setup>
import TimelineTreeStep from '@/components/Timeline/TimelineTreeStep.vue';
import { Timeline as steps } from '@/const/const.js';

defineEmits(['select']);
defineProps({
    current: {
        type: Array,
        default: () => []
    },
    selected: {
        type: Number,
        default: null
    }
});
</script>
