<template>
    <DashboardChip class="mw-100 dashboard-bg-warning">
        <i class="fa-solid fa-exclamation-triangle" />
        <span>
            Дата последнего звонка по объекту/запросу устарела. Пожалуйста, созвонитесь с
            прикрепленным к объекту/запросу лицом и актуализируйте информацию.
        </span>
    </DashboardChip>
</template>
<script setup>
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
</script>
