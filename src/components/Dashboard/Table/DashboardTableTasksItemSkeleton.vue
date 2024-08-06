<template>
    <div class="dashboard-card-task skeleton-body">
        <p class="dashboard-card-task__text skeleton w-100">Текст</p>
        <div class="dashboard-card-task__meta">
            <DashboardChip class="skeleton">Статус</DashboardChip>
            <span class="dashboard-card-task__date skeleton">01 янв</span>
            <HoverActionsButton disabled class="skeleton">
                <i class="fa-solid fa-check-double" />
            </HoverActionsButton>
        </div>
    </div>
</template>

<script>
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import HoverActionsButton from '@/components/common/HoverActions/HoverActionsButton.vue';

export default {
    name: 'DashboardTableTasksItemSkeleton',
    components: { HoverActionsButton, DashboardChip }
};
</script>
