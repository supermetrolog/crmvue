<template>
    <div class="task-card-history-event__content">
        <div class="task-card-history-event__column">
            <TaskCardHistoryEventRow label="Дата старта">
                <div class="d-flex align-items-center">
                    <DashboardChip class="task-card-history-event__help p-1">
                        {{ prevStart }}
                    </DashboardChip>
                    <i class="fa-solid fa-arrow-right-long mx-2"></i>
                    <DashboardChip class="task-card-history-event__help">
                        {{ currentStart }}
                    </DashboardChip>
                </div>
            </TaskCardHistoryEventRow>
            <TaskCardHistoryEventRow label="Дата окончания">
                <div class="d-flex align-items-center">
                    <DashboardChip class="task-card-history-event__help p-1">
                        {{ prevEnd }}
                    </DashboardChip>
                    <i class="fa-solid fa-arrow-right-long mx-2"></i>
                    <DashboardChip class="task-card-history-event__help">
                        {{ currentEnd }}
                    </DashboardChip>
                </div>
            </TaskCardHistoryEventRow>
        </div>
        <DashboardChip class="fs-2 dashboard-bg-gray-l py-1 px-2 mt-1">
            Задача отложена на {{ duration }}
        </DashboardChip>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { toDateFormat } from '@/utils/formatters/date.ts';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import TaskCardHistoryEventRow from '@/components/TaskCard/History/TaskCardHistoryEventRow.vue';
import dayjs from 'dayjs';

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

const prevStart = computed(() => toDateFormat(props.prevSnapshot.start));
const currentStart = computed(() => toDateFormat(props.snapshot.start));

const prevEnd = computed(() => toDateFormat(props.prevSnapshot.end));
const currentEnd = computed(() => toDateFormat(props.snapshot.end));

const duration = computed(() => {
    return dayjs
        .duration(dayjs(props.snapshot.start).diff(dayjs(props.prevSnapshot.start)))
        .humanize();
});
</script>
