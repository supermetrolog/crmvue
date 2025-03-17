<template>
    <div class="task-card-history-event__content">
        <TaskCardHistoryEventRow label="Заголовок">
            <div class="d-flex align-items-center">
                <DashboardChip
                    v-if="prevSnapshot?.title"
                    v-tippy="{ content: prevSnapshot?.title, maxWidth: 600 }"
                    class="task-card-history-event__help danger"
                    with-icon
                >
                    <span>Старый</span>
                    <i v-if="prevSnapshot" class="fa-regular fa-circle-question"></i>
                </DashboardChip>
                <DashboardChip v-else class="task-card-history-event__help">
                    <span>Без заголовка</span>
                </DashboardChip>
                <i class="fa-solid fa-arrow-right-long mx-2"></i>
                <DashboardChip
                    v-tippy="{ content: snapshot.title, maxWidth: 600 }"
                    class="task-card-history-event__help success"
                    with-icon
                >
                    <span>Новый</span>
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
