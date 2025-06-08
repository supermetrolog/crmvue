<template>
    <div
        class="request-row-card-timeline-step"
        :class="{
            done: isCompleted,
            'in-process': inProcess,
            attention: hasAttention
        }"
    >
        <div
            class="request-row-card-timeline-step__arrow request-row-card-timeline-step__arrow--top"
        ></div>
        <div class="request-row-card-timeline-step__content">
            <p class="request-row-card-timeline-step__name">
                Этап {{ definition.visual_id }}. {{ definition.shortLabel ?? definition.label }}
            </p>
            <div v-if="definition.steps?.length">
                <RequestRowCardTimelineStepRow
                    v-for="step in definition.steps"
                    :key="step.id"
                    :definition="step"
                    :origin
                    :completed="isCompleted"
                />
            </div>
            <p v-else-if="isCompleted" class="fs-1">
                {{ definition.doneLabel }}
            </p>
            <p v-else-if="inProcess" class="fs-1">
                {{ definition.processLabel }}
            </p>
            <p v-else class="fs-1">Недоступно</p>
        </div>
        <div
            class="request-row-card-timeline-step__arrow request-row-card-timeline-step__arrow--bottom"
        ></div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import RequestRowCardTimelineStepRow from '@/components/RequestRowCard/RequestRowCardTimelineStepRow.vue';

const props = defineProps({
    definition: {
        type: Object,
        required: true
    },
    origin: Object
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
</script>
