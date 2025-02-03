<template>
    <Modal @close="$emit('close')" show width="600" title="Настройка фильтров">
        <slot />
        <template #footer>
            <Button @click="$emit('close')" small>Закрыть</Button>
            <Button @click="clear" :disabled="!hasFilters" danger small>Очистить фильтры</Button>
        </template>
    </Modal>
</template>
<script setup>
import Modal from '@/components/common/Modal.vue';
import { computed } from 'vue';
import Button from '@/components/common/Button.vue';

const modelValue = defineModel();
defineEmits(['close']);

const hasFilters = computed(() => {
    return Object.values(modelValue.value).filter(Boolean).length;
});

const clear = () => {
    modelValue.value = {};
};
</script>
