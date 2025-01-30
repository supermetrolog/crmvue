<template>
    <UiModal title="Создание контакта" :width="600">
        <h3 class="text-center">
            Заполнить данные контакта или создать задачу для офис-менеджера?
        </h3>
        <template #footer>
            <Button @click="$emit('create-contact')" small>Заполнить контакта</Button>
            <Button @click="$emit('create-task')" small>Создать задачу</Button>
        </template>
    </UiModal>
</template>
<script setup>
import Button from '@/components/common/Button.vue';
import UiModal from '@/components/common/UI/UiModal.vue';

defineEmits(['create-contact', 'create-task']);
</script>
