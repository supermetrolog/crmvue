<template>
    <UiButton
        @click="modelValue = !modelValue"
        small
        :icon="modelValue ? 'fa-solid fa-chevron-down' : 'fa-solid fa-chevron-up'"
        class="fs-2"
        bolder
        rect
    >
        {{ formattedLabel }}
    </UiButton>
</template>

<script setup>
import UiButton from '@/components/common/UI/UiButton.vue';
import { computed } from 'vue';

const modelValue = defineModel({ default: false, type: Boolean });
const props = defineProps({
    count: {
        type: Number,
        required: true
    },
    secondCount: Number,
    label: {
        type: String,
        required: true
    }
});

const formattedLabel = computed(() => {
    return `${props.label} (${props.count}${props.secondCount ? `/${props.secondCount}` : ''})`;
});
</script>
