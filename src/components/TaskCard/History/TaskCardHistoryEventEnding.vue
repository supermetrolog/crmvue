<template>
    <div class="task-card-history-event__content">
        <div class="task-card-history-event__column">
            <TaskCardHistoryEventRow label="Выполнить до">
                <div class="d-flex align-items-center">
                    <DashboardChip class="task-card-history-event__help danger">
                        {{ prevSnapshot ? prevEndDate : '-' }}
                    </DashboardChip>
                    <i class="fa-solid fa-arrow-right-long mx-2"></i>
                    <DashboardChip class="task-card-history-event__help success">
                        {{ endDate }}
                    </DashboardChip>
                </div>
            </TaskCardHistoryEventRow>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { toDateFormat } from '@/utils/formatters/date.js';
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

const prevEndDate = computed(() => toDateFormat(props.prevSnapshot.end, 'D MMM YY'));
const endDate = computed(() => toDateFormat(props.snapshot.end, 'D MMM YY'));
</script>
