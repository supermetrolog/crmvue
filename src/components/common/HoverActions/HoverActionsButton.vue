<template>
    <button v-tippy="label" class="hover-actions__button" :class="{ active: active, small: small }">
        <slot></slot>
    </button>
</template>
<script setup>
defineProps({
    label: {
        type: String,
        default: null
    },
    active: {
        type: Boolean,
        default: false
    },
    small: {
        type: Boolean,
        default: false
    }
});
</script>
