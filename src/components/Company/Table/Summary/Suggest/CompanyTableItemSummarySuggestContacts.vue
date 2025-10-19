<template>
    <p class="company-table-item-summary__suggest-row active">
        <UiClamped button-class="fs-2" :rows="2">
            <i class="fa-solid fa-angles-right mr-1" />
            <span>Найти актуальные контакты для связи с компанией</span>
        </UiClamped>
    </p>
</template>

<script setup lang="ts">
import UiClamped from '@/components/common/UiClamped.vue';
</script>
