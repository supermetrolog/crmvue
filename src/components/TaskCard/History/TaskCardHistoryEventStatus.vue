<template>
    <div class="task-card-history-event__content">
        <div class="d-flex align-items-center">
            <DashboardChip v-if="prevSnapshot" class="task-card__status dashboard-bg-danger-l">
                <i :class="prevStatusIcon" />
                <span>{{ prevStatus }}</span>
                <span v-if="prevIsCanceled">до {{ prevImpossibleDate }}</span>
            </DashboardChip>
            <DashboardChip v-else class="task-card__chip task-card__status">-</DashboardChip>
            <i class="fa-solid fa-arrow-right-long mx-3"></i>
            <DashboardChip class="task-card__status dashboard-bg-success-l">
                <i :class="statusIcon" />
                <span>{{ status }}</span>
                <span v-if="isCanceled">до {{ impossibleDate }}</span>
            </DashboardChip>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { toDateFormat } from '@/utils/formatters/date.ts';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import { taskOptions } from '@/const/options/task.options.js';

const props = defineProps({
    snapshot: {
        type: Object,
        required: true
    },
    prevSnapshot: {
        type: Object,
        required: true
    }
});

const isCanceled = computed(() => props.snapshot.status === taskOptions.statusTypes.CANCELED);
const impossibleDate = computed(() => toDateFormat(props.snapshot.impossible_to, 'D.MM.YY'));
const status = computed(() => taskOptions.status[props.snapshot.status]);
const statusIcon = computed(() => taskOptions.statusIcon[props.snapshot.status]);

const prevIsCanceled = computed(
    () => props.prevSnapshot.status === taskOptions.statusTypes.CANCELED
);
const prevImpossibleDate = computed(() =>
    toDateFormat(props.prevSnapshot.impossible_to, 'D.MM.YY')
);
const prevStatus = computed(() => taskOptions.status[props.prevSnapshot.status]);
const prevStatusIcon = computed(() => taskOptions.statusIcon[props.prevSnapshot.status]);
</script>
