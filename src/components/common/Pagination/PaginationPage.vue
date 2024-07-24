<template>
    <button
        @click.prevent="emit('click')"
        class="pagination-classic__button"
        :class="{ 'pagination-classic__button--navigate': navigate, active: active }"
        :disabled="disabled"
    >
        <slot />
    </button>
</template>
<script setup>
const emit = defineEmits(['click']);
defineProps({
    navigate: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    },
    active: {
        type: Boolean,
        default: false
    }
});
</script>
