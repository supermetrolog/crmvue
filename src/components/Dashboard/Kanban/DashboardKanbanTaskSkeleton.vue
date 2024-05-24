<template>
    <div class="dashboard-kanban-task skeleton-body">
        <div class="dashboard-kanban-task__header">
            <DashboardChip class="dashboard-bg-primary-l skeleton">от 10.10.1010</DashboardChip>
            <DashboardChip class="dashboard-kanban-task__badge skeleton">до 10.10.10</DashboardChip>
            <div class="dashboard-kanban-task__actions">
                <HoverActionsButton class="skeleton">
                    <i class="fa-solid fa-pen"></i>
                </HoverActionsButton>
            </div>
        </div>
        <div class="dashboard-kanban-task__body">
            <Avatar class="skeleton" :size="25" />
            <div class="dashboard-kanban-task__text skeleton">Сообщение</div>
        </div>
        <div class="dashboard-kanban-task__footer">
            <span class="skeleton">Исполнители:</span>
            <Avatar class="skeleton" :size="25" />
        </div>
    </div>
</template>

<script>
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import Avatar from '@/components/common/Avatar.vue';
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';

export default {
    name: 'DashboardKanbanTaskSkeleton',
    components: { HoverActionsButton, Avatar, DashboardChip }
};
</script>
