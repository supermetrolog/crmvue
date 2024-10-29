<template>
    <div class="messenger-bar-tab__element rounded-icon">
        <span class="messenger-bar-tab__chip">{{ label }}</span>
        <i :class="icon"></i>
    </div>
</template>
<script setup>
defineProps({
    icon: {
        type: String,
        default: 'fa-solid fa-bolt'
    },
    label: {
        type: [String, Number],
        default: null
    }
});
</script>
