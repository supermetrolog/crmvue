<template>
    <MessengerQuizFormWarningModal
        title="Созвонитесь с клиентом!"
        message="Для заполнения вопросов укажите, удалось ли дозвониться до клиента."
        icon="fa-solid fa-phone-volume"
        :width="520"
    >
        <template #actions>
            <UiButton
                @click="$emit('show-call-question')"
                class="font-weight-bold"
                icon="fa-solid fa-up-right-from-square"
                color="light"
                uppercase
            >
                Перейти к вопросу
            </UiButton>
        </template>
    </MessengerQuizFormWarningModal>
</template>
<script setup>
import MessengerQuizFormWarningModal from '@/components/Messenger/Quiz/Form/MessengerQuizFormWarningModal.vue';
import UiButton from '@/components/common/UI/UiButton.vue';

defineEmits(['show-call-question']);
</script>
