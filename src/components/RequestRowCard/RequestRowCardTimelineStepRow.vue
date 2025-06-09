<template>
    <p class="fs-1">
        {{ definition.visual_id }} <span>{{ label }}</span>
    </p>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    definition: {
        type: Object,
        required: true
    },
    origin: Object,
    completed: Boolean
});

const isCompleted = computed(() => {
    if (!props.origin) return false;

    if (Object.hasOwn(props.definition, 'checkDone')) {
        return props.definition.checkDone(props.origin);
    }

    return props.origin.status === 1;
});

const inProcess = computed(() => props.origin?.status === 0);
const hasAttention = computed(() => props.origin?.status === 2);

const isPaused = computed(() => {
    if (!props.origin) return false;

    if (Object.hasOwn(props.definition, 'checkPause')) {
        return props.definition.checkDone(props.origin);
    }

    return false;
});

const label = computed(() => {
    if (props.completed || isCompleted.value) return props.definition.doneLabel;
    if (inProcess.value || hasAttention.value) return props.definition.processLabel;
    if (isPaused.value) return props.definition.pauseLabel ?? 'Шаг на паузе';
    return 'Недоступно';
});
</script>
