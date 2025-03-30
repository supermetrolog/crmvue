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

const route = useRoute();

function checkIsSelectedPoint(pointKey) {
    const point = route.query?.point;

    if (!point) return pointKey === 0;
    return pointKey === Number(point);
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
