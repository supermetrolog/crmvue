<template>
    <div class="timeline-tree-step timeline-tree-step-row" :class="className">
        <div class="timeline-tree-step__row" :class="{ done: done }">
            <i v-if="attention" class="fa-solid fa-circle-exclamation"></i>
            <i v-else-if="paused" class="fa-solid fa-pause"></i>
            <i v-else-if="process" class="fa-solid fa-clock-rotate-left"></i>
            <i v-else-if="done" class="fa-solid fa-check dashboard-cl-success"></i>
        </div>
        <span class="timeline-tree-step__label">{{ step.visual_id }}. {{ step.label }}</span>
        <svg
            v-if="selected && !step.steps?.length"
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
    process: Boolean,
    attention: Boolean,
    paused: Boolean
});

const className = computed(() => {
    return {
        disabled: !props.available,
        point: props.point,
        available: props.available,
        selected: props.selected,
        done: props.done,
        'in-process': props.process,
        expanded: props.step.steps?.length
    };
});
</script>
