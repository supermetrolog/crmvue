<template>
    <div class="task-card-history-event__content">
        <TaskCardHistoryEventRow label="Описание">
            <div class="d-flex align-items-center">
                <DashboardChip
                    v-if="prevSnapshot?.message"
                    v-tippy="{ content: prevSnapshot?.message, maxWidth: 600 }"
                    class="task-card-history-event__help danger"
                    with-icon
                >
                    <span>Старое</span>
                    <i v-if="prevSnapshot" class="fa-regular fa-circle-question"></i>
                </DashboardChip>
                <DashboardChip v-else class="task-card-history-event__help">
                    <span>Без описания</span>
                </DashboardChip>
                <i class="fa-solid fa-arrow-right-long mx-2"></i>
                <DashboardChip
                    v-if="snapshot.message"
                    v-tippy="{ content: snapshot.message, maxWidth: 600 }"
                    class="task-card-history-event__help success"
                    with-icon
                >
                    <span>Новое</span>
                    <i class="fa-regular fa-circle-question"></i>
                </DashboardChip>
                <DashboardChip v-else class="task-card-history-event__help">
                    <span>Без описания</span>
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
