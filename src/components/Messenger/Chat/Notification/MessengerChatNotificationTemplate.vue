<template>
    <component
        :is="templateComponent"
        class="messenger-chat-notification-template"
        :message
        :short
    />
</template>
<script setup>
import { computed } from 'vue';
import MessengerChatNotificationSurveyTemplate from '@/components/Messenger/Chat/Notification/Templates/Survey/MessengerChatNotificationSurveyTemplate.vue';
import MessengerChatNotificationDefaultTemplate from '@/components/Messenger/Chat/Notification/Templates/MessengerChatNotificationDefaultTemplate.vue';

const TEMPLATES = {
    survey: MessengerChatNotificationSurveyTemplate
};

const props = defineProps({
    message: {
        type: Object,
        required: true
    },
    template: {
        type: String,
        required: true
    },
    short: Boolean
});

const templateComponent = computed(
    () => TEMPLATES[props.template] ?? MessengerChatNotificationDefaultTemplate
);
</script>
