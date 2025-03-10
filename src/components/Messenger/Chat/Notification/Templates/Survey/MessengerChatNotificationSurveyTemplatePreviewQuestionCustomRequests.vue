<template>
    <div v-if="answer?.surveyQuestionAnswer?.value" class="d-flex flex-column gap-1">
        <MessengerChatNotificationSurveyTemplatePreviewQuestionCustomRequestsElement
            v-for="request in answer?.surveyQuestionAnswer?.value"
            :key="request.id"
            :request="request"
        />
    </div>
</template>
<script setup>
import { computed } from 'vue';
import MessengerChatNotificationSurveyTemplatePreviewQuestionCustomRequestsElement from '@/components/Messenger/Chat/Notification/Templates/Survey/MessengerChatNotificationSurveyTemplatePreviewQuestionCustomRequestsElement.vue';

const props = defineProps({
    question: {
        type: Object,
        required: true
    }
});

//  main

const answer = computed(() => props.question.answers.custom[0]);
</script>
