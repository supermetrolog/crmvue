<template>
    <button
        @click.prevent="$emit('change')"
        class="complex-deal-price-formatter__option"
        :class="{ active: active }"
    >
        <slot></slot>
    </button>
</template>
<script setup>
defineEmits(['change']);
defineProps({
    active: {
        type: Boolean,
        default: false
    }
});
</script>
