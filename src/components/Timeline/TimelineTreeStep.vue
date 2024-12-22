<template>
    <div class="timeline-tree-item">
        <TimelineTreeStepRow
            @click="select({ step: step.id })"
            :step="step"
            :done="isDone"
            :available="isAvailable"
            :attention="isAttention"
            :selected="isSelected"
            :icon="step.icon"
            :process="isProcess"
        />
        <div v-if="step.steps" class="timeline-tree-item__steps">
            <TimelineTreeStepPoint
                v-for="point in step.steps"
                :key="point.id"
                @click.stop="select({ step: step.id, point: point.id })"
                point
                :step="point"
                :selected="isSelected && isSelectedPoint(point.id)"
                :available="isAvailable"
                :done="isDonePoint(point)"
            />
        </div>
    </div>
</template>

<script>
import TimelineTreeStepPoint from '@/components/Timeline/TimelineTreeStepPoint.vue';
import TimelineTreeStepRow from '@/components/Timeline/TimelineTreeStepRow.vue';

export default {
    name: 'TimelineTreeStep',
    components: { TimelineTreeStepRow, TimelineTreeStepPoint },
    emits: ['select'],
    props: {
        step: {
            type: Object,
            required: true
        },
        selected: {
            type: Number,
            default: null
        },
        current: {
            type: Object,
            default: null
        }
    },
    computed: {
        isSelected() {
            return this.selected === this.step.id;
        },
        isAvailable() {
            return this.step.id < this.current.length;
        },
        isDone() {
            return this.isAvailable && this.current[this.step.id].status === 1;
        },
        isAttention() {
            return this.isAvailable && this.current[this.step.id].status === 2;
        },
        isProcess() {
            return this.isAvailable && this.current[this.step.id].status === 0;
        }
    },
    methods: {
        isSelectedPoint(pointKey) {
            const point = this.$route.query.point;

            if (!point) return pointKey === 0;
            return pointKey === Number(point);
        },
        isDonePoint(point) {
            if (Object.hasOwnProperty.call(point, 'checkDone'))
                return this.isAvailable && point.checkDone(this.current[this.step.id]);
            return false;
        },
        select(payload) {
            if (this.isAvailable) this.$emit('select', payload);
        }
    }
};
</script>
