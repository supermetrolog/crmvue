<template>
    <div class="task-card-history-event__content">
        <TaskCardHistoryEventRow label="Описание">
            <div class="d-flex align-items-center">
                <DashboardChip
                    v-tippy="prevSnapshot?.message"
                    class="task-card-history-event__help danger"
                    with-icon
                >
                    <span>Старое</span>
                    <i v-if="prevSnapshot" class="fa-regular fa-circle-question"></i>
                </DashboardChip>
                <i class="fa-solid fa-arrow-right-long mx-2"></i>
                <DashboardChip
                    v-tippy="snapshot.message"
                    class="task-card-history-event__help success"
                    with-icon
                >
                    <span>Новое</span>
                    <i class="fa-regular fa-circle-question"></i>
                </DashboardChip>
            </div>
        </TaskCardHistoryEventRow>
    </div>
</template>

<script setup>
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import TaskCardHistoryEventRow from '@/components/TaskCard/History/TaskCardHistoryEventRow.vue';

defineProps({
    snapshot: {
        type: Object,
        required: true
    },
    prevSnapshot: {
        type: Object,
        required: true
    }
});
</script>
