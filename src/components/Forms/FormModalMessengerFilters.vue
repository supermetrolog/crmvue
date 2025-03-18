<template>
    <UiModal @close="$emit('close')" custom-close show :width="600" title="Настройка фильтров">
        <slot />
        <template #actions="{ close }">
            <UiButton
                @click="clear"
                :disabled="!hasFilters"
                color="danger"
                small
                icon="fa-solid fa-trash"
            >
                Очистить фильтры
            </UiButton>
            <UiButton @click="close" color="light" small icon="fa-solid fa-ban">Закрыть</UiButton>
        </template>
    </UiModal>
</template>
<script setup>
import { computed } from 'vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import UiModal from '@/components/common/UI/UiModal.vue';

const modelValue = defineModel();
defineEmits(['close']);

const hasFilters = computed(() => {
    return Object.values(modelValue.value).filter(Boolean).length;
});

function clear() {
    modelValue.value = {};
}
</script>
