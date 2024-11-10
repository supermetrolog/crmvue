<template>
    <div class="messenger-quiz-recipient-picker">
        <MessengerQuizRecipient
            v-if="mainContact"
            @click="setRecipient(mainContact)"
            :recipient="mainContact"
            :class="{ active: mainContact.id === modelValue?.id }"
            class="messenger-quiz-recipient-picker__element"
        />
        <MessengerQuizRecipient
            v-for="contact in contacts"
            :key="contact.id"
            @click.prevent.stop="setRecipient(contact)"
            :recipient="contact"
            :class="{ active: contact.id === modelValue?.id }"
            class="messenger-quiz-recipient-picker__element"
        />
    </div>
</template>
<script setup>
import { useStore } from 'vuex';
import { computed } from 'vue';
import MessengerQuizRecipient from '@/components/Messenger/Quiz/MessengerQuizRecipient.vue';
import { entityOptions } from '@/const/options/options.js';

const modelValue = defineModel();

const store = useStore();

const company = computed(() => store.state.Messenger.currentPanel);
const mainContact = computed(() => {
    const contact = company.value.contacts.find(
        contact => contact.type === entityOptions.contact.typeStatement.GENERAL
    );

    if (contact)
        return {
            ...contact,
            full_name: 'Общий контакт',
            general: true
        };

    return null;
});

const contacts = computed(() => {
    return company.value.contacts.filter(
        contact => contact.type !== entityOptions.contact.typeStatement.GENERAL
    );
});

const setRecipient = recipient => {
    modelValue.value = recipient;
};
</script>
