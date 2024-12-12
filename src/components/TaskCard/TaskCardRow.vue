<template>
    <div class="task-card__category">{{ label }}:</div>
    <div class="task-card__value">
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
