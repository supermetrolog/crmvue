<template>
    <UiModal
        v-slot="{ close }"
        :width="800"
        :close-on-press-esc="false"
        :close-on-outside-click="false"
        title="Выбор контакта для прозвона"
    >
        <MessengerQuizContacts
            v-model:contact="currentContact"
            @suggest="$emit('suggest-create-contact')"
            :contacts
            grid
            label="Список доступных контактов"
        />
        <div class="d-flex gap-2 mt-2 justify-content-center">
            <Button @click="submit" :disabled="!currentContact" success>Подтвердить</Button>
            <Button @click="close" danger>Отмена</Button>
        </div>
    </UiModal>
</template>
<script setup>
import Button from '@/components/common/Button.vue';
import MessengerQuizContacts from '@/components/Messenger/Quiz/MessengerQuizContacts.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import { shallowRef } from 'vue';

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
