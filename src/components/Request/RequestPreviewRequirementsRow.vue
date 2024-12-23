<template>
    <div class="request-preview-requirements__icon">
        <i :class="icon" />
    </div>
    <span class="request-preview-requirements__value">
        <slot />
    </span>
</template>
<script setup>
defineProps({
    icon: {
        type: String,
        required: true
    }
});
</script>
