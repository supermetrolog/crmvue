<template>
    <div class="task-card-history-event__content">
        <div class="task-card-history-event__column">
            <TaskCardHistoryEventRow label="Выполнить с">
                <div class="d-flex align-items-center">
                    <DashboardChip class="task-card-history-event__help danger">
                        {{ prevSnapshot ? prevStartDate : '-' }}
                    </DashboardChip>
                    <i class="fa-solid fa-arrow-right-long mx-2"></i>
                    <DashboardChip class="task-card-history-event__help success">
                        {{ startDate }}
                    </DashboardChip>
                </div>
            </TaskCardHistoryEventRow>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { toDateFormat } from '@/utils/formatters/date.ts';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import TaskCardHistoryEventRow from '@/components/TaskCard/History/TaskCardHistoryEventRow.vue';

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

const prevStartDate = computed(() => toDateFormat(props.prevSnapshot.start, 'D.MM.YY, HH:mm'));
const startDate = computed(() => toDateFormat(props.snapshot.start, 'D.MM.YY, HH:mm'));
</script>
