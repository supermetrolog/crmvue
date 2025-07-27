<template>
    <UiButton
        @click="modelValue = name"
        :color
        class="fs-2 company-table-item-summary-survey__tab"
        small
    >
        <slot />
    </UiButton>
</template>

<script setup lang="ts">
import UiButton from '@/components/common/UI/UiButton.vue';
import { computed } from 'vue';

const modelValue = defineModel<string>();

const props = defineProps<{ name: string }>();

const color = computed(() => {
    if (modelValue.value === props.name) return 'gray-light';
    return 'transparent';
});
</script>
