<template>
    <button class="task-card__button" :class="{ 'task-card__button--bordered': bordered }">
        <slot />
    </button>
</template>

<script setup>
defineProps({
    bordered: Boolean
});
</script>
