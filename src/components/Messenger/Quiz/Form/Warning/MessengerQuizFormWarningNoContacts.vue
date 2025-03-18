<template>
    <MessengerQuizFormWarningModal
        title="Невозможно заполнить опрос"
        message="Отсутствуют активные контакты"
        icon="fa-solid fa-users-slash"
        :width="500"
    >
        <template #actions>
            <UiButton
                @click="$emit('suggest-create-contact')"
                icon="fa-solid fa-user-plus"
                color="light"
                uppercase
                bolder
            >
                Добавить контакт
            </UiButton>
        </template>
    </MessengerQuizFormWarningModal>
</template>
<script setup>
import MessengerQuizFormWarningModal from '@/components/Messenger/Quiz/Form/MessengerQuizFormWarningModal.vue';
import UiButton from '@/components/common/UI/UiButton.vue';

defineEmits(['suggest-create-contact']);
</script>
