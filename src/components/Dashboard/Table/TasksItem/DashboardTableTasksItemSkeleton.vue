<template>
    <div class="dashboard-card-task skeleton-body">
        <span class="skeleton mr-3">#1234</span>
        <div class="avatar skeleton mr-2">Test</div>
        <p class="dashboard-card-task__text skeleton w-100 mr-3">Текст</p>
        <div class="dashboard-card-task__meta">
            <span class="dashboard-card-task__date skeleton">01 янв</span>
            <UiButtonIcon disabled class="skeleton" icon="fa-solid fa-check-double" />
        </div>
    </div>
</template>

<script setup>
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';
</script>
<style scoped>
.avatar {
    height: 55px;
    width: 55px;
}
</style>
