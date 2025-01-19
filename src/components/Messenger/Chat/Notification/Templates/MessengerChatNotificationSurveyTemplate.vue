<template>
    <div class="messenger-chat-notification-template messenger-chat-template-survey">
        <p class="messenger-chat-template-survey__header">
            <span class="messenger-chat-template-survey__title mr-2">Опросник заполнен!</span>
            <span class="messenger-chat-template-survey__info">
                <span v-tippy="originalDate" class="mr-1">{{ formattedDate }},</span>
                <span class="mr-1 font-weight-bold">{{ senderShortName }}</span>
                <span class="mr-1">с</span>
                <span class="font-weight-bold">{{ recipientUsername }}</span>
            </span>
        </p>
        <MessengerChatNotificationSurveyTemplateSkeleton v-if="surveyIsLoading" />
        <MessengerChatNotificationSurveyTemplatePreview v-else-if="survey" :survey />
    </div>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue';
import { entityOptions } from '@/const/options/options.js';
import api from '@/api/api.js';
import MessengerChatNotificationSurveyTemplateSkeleton from '@/components/Messenger/Chat/Notification/Templates/MessengerChatNotificationSurveyTemplateSkeleton.vue';
import MessengerChatNotificationSurveyTemplatePreview from '@/components/Messenger/Chat/Notification/Templates/MessengerChatNotificationSurveyTemplatePreview.vue';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';

const props = defineProps({
    message: {
        type: Object,
        required: true
    }
});

// recipient

const recipientUsername = computed(() => {
    const contact = props.message.contacts[0];
    if (contact.type === entityOptions.contact.typeStatement.GENERAL) return 'Общий контакт';
    return contact.first_name + (contact.last_name ? ` ${contact.last_name}` : '');
});

// date

const formattedDate = computed(() => {
    return props.message.dayjs_date.format('DD.MM.YYYY');
});

const originalDate = computed(() => {
    return props.message.dayjs_date.format('D MMMM YYYY., H:mm:ss');
});

// user

const senderShortName = computed(() => {
    return props.message.from.model.userProfile.medium_name;
});

// survey

const { isLoading: surveyIsLoading } = useDelayedLoader(true);

const survey = ref(null);

async function fetchSurvey() {
    surveyIsLoading.value = true;

    const response = await api.survey.get(props.message.surveys[0].id);
    if (response) survey.value = response;

    surveyIsLoading.value = false;
}

onMounted(fetchSurvey);
</script>
