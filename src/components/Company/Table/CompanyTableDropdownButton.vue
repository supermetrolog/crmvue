<template>
    <UiButton
        @click="modelValue = !modelValue"
        small
        :icon="modelValue ? 'fa-solid fa-chevron-down' : 'fa-solid fa-chevron-up'"
        class="fs-2"
        bolder
    >
        {{ label }} ({{ count }})
    </UiButton>
</template>

<script setup>
import UiButton from '@/components/common/UI/UiButton.vue';

const modelValue = defineModel({ default: false, type: Boolean });
defineProps({
    count: {
        type: Number,
        required: true
    },
    label: {
        type: String,
        required: true
    }
});
</script>
