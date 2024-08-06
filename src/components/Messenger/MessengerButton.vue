<template>
    <button class="messenger-button" :class="colorClass" :disabled="disabled">
        <slot></slot>
    </button>
</template>
<script setup>
import { computed } from 'vue';

const props = defineProps({
    color: {
        type: String,
        default: null
    },
    disabled: {
        type: Boolean,
        default: false
    }
});

const colorClass = computed(() => (props.color ? `bg-btn--${props.color}` : null));
</script>
