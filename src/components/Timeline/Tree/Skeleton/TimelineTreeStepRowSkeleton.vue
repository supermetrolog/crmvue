<template>
    <div class="timeline-tree-step timeline-tree-step-row" :class="className">
        <div class="timeline-tree-step__row skeleton skeleton--rect"></div>
        <span class="timeline-tree-step__label skeleton">
            {{ step.visual_id }}. {{ step.label }}
        </span>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    step: {
        type: Object,
        required: true
    },
    icon: String
});

const className = computed(() => {
    return {
        point: props.point,
        expanded: props.step.steps?.length
    };
});
</script>
