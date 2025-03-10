<template>
    <div v-if="answer?.surveyQuestionAnswer?.value" class="d-flex flex-column gap-1">
        <MessengerChatNotificationSurveyTemplatePreviewQuestionCustomOffersElement
            v-for="offerMix in answer?.surveyQuestionAnswer?.value"
            :key="offerMix.object_id"
            :offerMix="offerMix"
        />
    </div>
</template>
<script setup>
import { computed } from 'vue';
import MessengerChatNotificationSurveyTemplatePreviewQuestionCustomOffersElement from '@/components/Messenger/Chat/Notification/Templates/Survey/MessengerChatNotificationSurveyTemplatePreviewQuestionCustomOffersElement.vue';

const props = defineProps({
    question: {
        type: Object,
        required: true
    }
});

//  main

const answer = computed(() => props.question.answers.custom[0]);
</script>
