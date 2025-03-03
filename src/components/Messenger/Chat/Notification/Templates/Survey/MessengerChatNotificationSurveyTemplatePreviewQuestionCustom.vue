<template>
    <component :is="currentComponent" :question />
</template>
<script setup>
import { computed } from 'vue';
import MessengerQuizPreviewQuestionTemplateDefault from '@/components/Messenger/Quiz/Preview/Template/MessengerQuizPreviewQuestionTemplateDefault.vue';
import MessengerChatNotificationSurveyTemplatePreviewQuestionCustomWantsToSell from '@/components/Messenger/Chat/Notification/Templates/Survey/MessengerChatNotificationSurveyTemplatePreviewQuestionCustomWantsToSell.vue';
import MessengerChatNotificationSurveyTemplatePreviewQuestionCustomHasFreeArea from '@/components/Messenger/Chat/Notification/Templates/Survey/MessengerChatNotificationSurveyTemplatePreviewQuestionCustomHasFreeArea.vue';

const props = defineProps({
    question: {
        type: Object,
        required: true
    }
});

const TEMPLATES = {
    'free-area': MessengerChatNotificationSurveyTemplatePreviewQuestionCustomHasFreeArea,
    'wants-to-sell': MessengerChatNotificationSurveyTemplatePreviewQuestionCustomWantsToSell
};

const currentComponent = computed(() => {
    return TEMPLATES[props.question.template] ?? MessengerQuizPreviewQuestionTemplateDefault;
});
</script>
