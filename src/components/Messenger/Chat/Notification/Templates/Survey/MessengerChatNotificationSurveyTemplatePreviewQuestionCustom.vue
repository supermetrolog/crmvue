<template>
    <component :is="currentComponent" :question />
</template>
<script setup>
import { computed } from 'vue';
import MessengerQuizPreviewQuestionTemplateDefault from '@/components/Messenger/Quiz/Preview/Template/MessengerQuizPreviewQuestionTemplateDefault.vue';
import MessengerChatNotificationSurveyTemplatePreviewQuestionCustomRequests from '@/components/Messenger/Chat/Notification/Templates/Survey/MessengerChatNotificationSurveyTemplatePreviewQuestionCustomRequests.vue';
import MessengerChatNotificationSurveyTemplatePreviewQuestionCustomOffers from '@/components/Messenger/Chat/Notification/Templates/Survey/MessengerChatNotificationSurveyTemplatePreviewQuestionCustomOffers.vue';

const props = defineProps({
    question: {
        type: Object,
        required: true
    }
});

const TEMPLATES = {
    requests: MessengerChatNotificationSurveyTemplatePreviewQuestionCustomRequests,
    offers: MessengerChatNotificationSurveyTemplatePreviewQuestionCustomOffers
};

const currentComponent = computed(() => {
    return TEMPLATES[props.question.template] ?? MessengerQuizPreviewQuestionTemplateDefault;
});
</script>
