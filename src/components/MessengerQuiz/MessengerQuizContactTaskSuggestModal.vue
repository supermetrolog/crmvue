<template>
    <UiModal title="Добавить контакт" :width="600" small>
        <h3 class="text-center font-weight-semi">
            Заполнить данные контакта или создать задачу для офис-менеджера?
        </h3>
        <template #actions>
            <UiButton @click="$emit('create-contact')" color="light" icon="fa-solid fa-user-plus">
                Заполнить контакт
            </UiButton>
            <UiButton @click="$emit('create-task')" color="light" icon="fa-solid fa-bolt">
                Создать задачу
            </UiButton>
        </template>
    </UiModal>
</template>
<script setup>
import UiModal from '@/components/common/UI/UiModal.vue';
import UiButton from '@/components/common/UI/UiButton.vue';

defineEmits(['create-contact', 'create-task']);
</script>
