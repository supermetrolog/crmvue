<template>
    <UiModal
        :width="800"
        :close-on-press-esc="false"
        :close-on-outside-click="false"
        title="Выбор следующего контакта для звонка"
    >
        <MessengerQuizContacts
            v-model:contact="currentContact"
            @suggest="$emit('suggest-create-contact')"
            :contacts
            grid
            label="Список доступных контактов"
        />
        <template #actions="{ close }">
            <UiButton
                @click="submit"
                :disabled="!currentContact"
                color="success-light"
                icon="fa-solid fa-check"
                bolder
            >
                Подтвердить
            </UiButton>
            <UiButton @click="close" color="light" icon="fa-solid fa-ban" bolder> Отмена </UiButton>
        </template>
    </UiModal>
</template>
<script setup>
import MessengerQuizContacts from '@/components/Messenger/Quiz/MessengerQuizContacts.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import { shallowRef } from 'vue';
import UiButton from '@/components/common/UI/UiButton.vue';

const emit = defineEmits(['suggest-create-contact', 'selected']);
defineProps({
    contacts: {
        type: Array,
        default: () => []
    }
});

const currentContact = shallowRef(null);

function submit() {
    emit('selected', currentContact.value);
    currentContact.value = null;
}
</script>
