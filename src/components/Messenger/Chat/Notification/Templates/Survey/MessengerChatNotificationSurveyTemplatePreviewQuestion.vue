<template>
    <component :is="currentComponent" :short :question />
</template>
<script setup>
import { computed } from 'vue';
import MessengerChatNotificationSurveyTemplatePreviewQuestionEquipments from '@/components/Messenger/Chat/Notification/Templates/Survey/MessengerChatNotificationSurveyTemplatePreviewQuestionEquipments.vue';
import MessengerChatNotificationSurveyTemplatePreviewQuestionDefault from '@/components/Messenger/Chat/Notification/Templates/Survey/MessengerChatNotificationSurveyTemplatePreviewQuestionDefault.vue';

const props = defineProps({
    question: {
        type: Object,
        required: true
    },
    short: Boolean
});

const components = {
    equipments: MessengerChatNotificationSurveyTemplatePreviewQuestionEquipments
};

const currentComponent = computed(() => {
    return (
        components[props.question.template] ??
        MessengerChatNotificationSurveyTemplatePreviewQuestionDefault
    );
});
</script>
