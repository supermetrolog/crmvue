<template>
    <div class="timeline-tree-item">
        <TimelineTreeStepRow
            @click="select({ step: step.id })"
            :step
            :done="isDone"
            :available="isAvailable"
            :attention="isAttention"
            :selected="isSelected"
            :icon="step.icon"
            :process="isProcess"
            :paused="isPaused"
        />
        <div v-if="step.steps?.length" class="timeline-tree-item__steps">
            <TimelineTreeStepPoint
                v-for="point in step.steps"
                :key="point.id"
                @click.stop="select({ step: step.id, point: point.id })"
                point
                :step="point"
                :selected="isSelected && checkIsSelectedPoint(point.id)"
                :available="isAvailable"
                :done="checkIsDonePoint(point)"
                :paused="checkIsPausedPoint(point)"
                :disabled="checkIsDisabledPoint(point)"
            />
        </div>
    </div>
</template>

<script setup>
import TimelineTreeStepPoint from '@/components/Timeline/TimelineTreeStepPoint.vue';
import TimelineTreeStepRow from '@/components/Timeline/TimelineTreeStepRow.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const emit = defineEmits(['select']);
const props = defineProps({
    step: {
        type: Object,
        required: true
    },
    selected: Number,
    current: Object
});

const isSelected = computed(() => props.selected === props.step.id);

const isAvailable = computed(() => props.step.id < props.current.length);

const isDone = computed(() => isAvailable.value && props.current[props.step.id].status === 1);
const isAttention = computed(() => isAvailable.value && props.current[props.step.id].status === 2);
const isProcess = computed(() => isAvailable.value && props.current[props.step.id].status === 0);

const isPaused = computed(() => {
    if (Object.hasOwn(props.step, 'checkPause')) {
        return isAvailable.value && props.step.checkPause(props.current[props.step.id]);
    }

    return false;
});

const route = useRoute();

function checkIsSelectedPoint(pointKey) {
    const point = route.query?.point;

    if (!point) return pointKey === 0;
    return pointKey === Number(point);
}

function checkIsPausedPoint(point) {
    if (Object.hasOwn(point, 'checkPause')) {
        return isAvailable.value && point.checkPause(props.current[props.step.id]);
    }

    return false;
}

function checkIsDisabledPoint(point) {
    if (Object.hasOwn(point, 'checkDisable')) {
        return isAvailable.value && point.checkDisable(props.current[props.step.id]);
    }

    return false;
}

function checkIsDonePoint(point) {
    if (Object.hasOwn(point, 'checkDone')) {
        return isAvailable.value && point.checkDone(props.current[props.step.id]);
    }

    return false;
}

function select(payload) {
    if (isAvailable.value) emit('select', payload);
}
</script>
