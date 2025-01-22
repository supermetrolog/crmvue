<template>
    <component :is="templateComponent" class="messenger-chat-message-template" :message />
</template>
<script setup>
import { computed } from 'vue';
import { messengerTemplates } from '@/const/messenger.js';
import MessengerChatMessageUnavailableSurveyTemplate from '@/components/Messenger/Chat/Message/Templates/MessengerChatMessageUnavailableSurveyTemplate.vue';
import MessengerChatMessageUnavailableContactTemplate from '@/components/Messenger/Chat/Message/Templates/MessengerChatMessageUnavailableContactTemplate.vue';
import MessengerChatMessageDefaultTemplate from '@/components/Messenger/Chat/Message/Templates/MessengerChatMessageDefaultTemplate.vue';

const TEMPLATES = {
    [messengerTemplates.UNAVAILABLE_SURVEY]: MessengerChatMessageUnavailableSurveyTemplate,
    [messengerTemplates.UNAVAILABLE_CONTACT]: MessengerChatMessageUnavailableContactTemplate
};

const props = defineProps({
    message: {
        type: Object,
        required: true
    },
    template: {
        type: String,
        required: true
    }
});

const templateComponent = computed(
    () => TEMPLATES[props.template] ?? MessengerChatMessageDefaultTemplate
);
</script>
