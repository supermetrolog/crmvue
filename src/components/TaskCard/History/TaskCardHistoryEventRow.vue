<template>
    <div class="task-card-history-event__row">
        <span class="task-card-history-event__label">{{ label }}</span>
        <div class="task-card-history-event__data">
            <slot />
        </div>
    </div>
</template>

<script setup>
defineProps({
    label: {
        type: String,
        require: true
    }
});
</script>
