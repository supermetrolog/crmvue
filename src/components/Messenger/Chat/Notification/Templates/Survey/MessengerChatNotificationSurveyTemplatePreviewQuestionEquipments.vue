<template>
    <MessengerChatNotificationSurveyTemplatePreviewQuestionDefault :question :short>
        <template #textarea="{ answers }">
            <div class="d-flex flex-column gap-1 text-left">
                <div v-for="answer in answers" :key="answer.id">
                    <div v-if="answer?.surveyQuestionAnswer?.value">
                        <p class="mb-1">{{ answer.value }}:</p>
                        <p class="bg-white p-1">{{ answer.surveyQuestionAnswer.value }}</p>
                    </div>
                </div>
            </div>
        </template>
    </MessengerChatNotificationSurveyTemplatePreviewQuestionDefault>
</template>
<script setup>
import MessengerChatNotificationSurveyTemplatePreviewQuestionDefault from '@/components/Messenger/Chat/Notification/Templates/Survey/MessengerChatNotificationSurveyTemplatePreviewQuestionDefault.vue';

defineProps({
    question: {
        type: Object,
        required: true
    },
    short: Boolean
});
</script>
