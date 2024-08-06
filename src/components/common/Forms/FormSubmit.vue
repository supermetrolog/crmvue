<template>
    <button class="submit button" :disabled="disabled" :class="buttonClass">
        <slot />
    </button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    disabled: {
        type: Boolean,
        default: false
    },
    success: {
        type: Boolean,
        default: false
    }
});

const buttonClass = computed(() => ({
    'button--success': props.success
}));
</script>
