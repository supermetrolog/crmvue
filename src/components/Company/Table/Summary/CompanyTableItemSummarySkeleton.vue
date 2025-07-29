<template>
    <div class="company-table-item-summary">
        <div class="company-table-item-summary__content">
            <div class="company-table-item-summary__header mb-1">
                <UiButton class="skeleton skeleton-button">Survey info skeleton</UiButton>
                <UiButton class="skeleton skeleton-button" small>Survey info skeleton</UiButton>
                <UiButton class="skeleton skeleton-button" small>Survey info skeleton</UiButton>
            </div>
            <p>
                <span class="skeleton">Suggest info about tasks or calls or events</span>
            </p>
            <p class="mt-2">
                <span class="skeleton">
                    Suggest info about tasks or calls or events with longer comment
                </span>
            </p>
        </div>
        <div class="mt-2 d-flex justify-content-end gap-1">
            <UiButtonIcon class="skeleton" small icon="fa-solid fa-pen" />
            <UiButtonIcon class="skeleton" small icon="fa-solid fa-pen" />
        </div>
    </div>
</template>

<script setup>
import UiButton from '@/components/common/UI/UiButton.vue';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';
</script>
