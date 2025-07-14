<template>
    <UiDropdownActionsButton
        @handle="modelValue = value"
        button-class="d-flex justify-content-start gap-2"
        :active="modelValue === value"
        :label
    >
        <template #icon>
            <slot name="icon" />
        </template>
        <template v-if="code" #after>
            <span class="text-grey">{{ code }}</span>
        </template>
    </UiDropdownActionsButton>
</template>

<script setup>
import UiDropdownActionsButton from '@/components/common/UI/DropdownActions/UiDropdownActionsButton.vue';

const modelValue = defineModel();

defineProps({
    label: {
        type: String,
        required: true
    },
    code: String,
    value: {
        type: String,
        required: true
    }
});
</script>
