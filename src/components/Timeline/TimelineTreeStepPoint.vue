<template>
    <div class="timeline-tree-step timeline-tree-step-point" :class="className">
        <div class="timeline-tree-step__point" :class="{ done: done, general: !point }"></div>
        <span class="timeline-tree-step__label">{{ step.visual_id }}. {{ step.label }}</span>
        <svg
            v-if="selected"
            class="timeline-tree-step__caret"
            viewBox="0 0 12 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M0 17.75V0L11.5 17.75L0 35.5V17.75Z" fill="currentColor" />
        </svg>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    step: {
        type: Object,
        required: true
    },
    available: Boolean,
    selected: Boolean,
    done: Boolean,
    icon: String,
    point: Boolean,
    process: Boolean,
    attention: Boolean
});

const className = computed(() => {
    return {
        disabled: !props.available,
        point: props.point,
        available: props.available,
        selected: props.selected,
        done: props.done,
        'in-process': props.process
    };
});
</script>
