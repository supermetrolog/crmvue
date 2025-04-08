<template>
    <div class="timeline-tree-step timeline-tree-step-point">
        <div class="timeline-tree-step__point skeleton" :class="{ general: !point }"></div>
        <span class="timeline-tree-step__label skeleton"
            >{{ step.visual_id }}. {{ step.label }}</span
        >
    </div>
</template>

<script setup>
defineProps({
    step: {
        type: Object,
        required: true
    },
    icon: String,
    point: Boolean
});
</script>
