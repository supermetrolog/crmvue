<template>
    <div class="dashboard-task-item-preview__category">{{ label }}:</div>
    <div class="dashboard-task-item-preview__value">
        <slot />
    </div>
</template>

<script setup>
defineProps({
    label: {
        type: String,
        required: true
    }
});
</script>
