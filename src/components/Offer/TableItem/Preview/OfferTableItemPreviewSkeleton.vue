<template>
    <div class="offer-table-item-preview skeleton-body">
        <div class="offer-table-item-preview__header mb-1">
            <UiField class="skeleton">Пассив</UiField>
            <UiField class="skeleton">Класс</UiField>
            <UiField class="skeleton">
                <i class="fa-solid fa-expand"></i>
                <span>123 45 м</span>
            </UiField>
        </div>
        <div class="offer-table-item-preview__container">
            <div class="offer-table-item-motion-slider skeleton skeleton--rect"></div>
            <div class="offer-table-item-preview__parameters">
                <span class="offer-table-item-preview__chip skeleton">Эксклюзив</span>
            </div>
            <div class="offer-table-item-preview__publishes">
                <span class="offer-table-item-preview__chip skeleton">Тестовый лот</span>
            </div>
        </div>
        <div class="offer-table-item-preview__types">
            <UiField class="skeleton" color="light">
                <i class="fa-solid fa-plus" />
            </UiField>
            <UiField class="skeleton" color="light">
                <i class="fa-solid fa-plus" />
            </UiField>
        </div>
    </div>
</template>

<script setup>
import UiField from '@/components/common/UI/UiField.vue';
</script>
