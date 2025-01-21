<template>
    <div class="messenger-chat-notification-template messenger-chat-template-survey">
        <MessengerChatMessageAdditions :tasks="extraTasks" :notifications="message.notifications" />
        <p class="messenger-chat-template-survey__header">
            <span class="messenger-chat-template-survey__title">Опросник заполнен!</span>
            <span class="messenger-chat-template-survey__info">
                <span v-tippy="originalDate" class="mr-1">{{ formattedDate }},</span>
                <template v-if="survey">
                    <span class="mr-1 font-weight-bold">{{ senderShortName }}</span>
                    <span class="mr-1">с</span>
                    <span class="font-weight-bold">{{ recipientUsername }}</span>
                </template>
            </span>
            <UIButtonIcon
                @click="showPreview"
                small
                label="Подробнее"
                icon="fa-solid fa-phone"
                class="ml-auto"
            />
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
import MessengerChatMessageAdditions from '@/components/Messenger/Chat/Message/Additions/MessengerChatMessageAdditions.vue';
import UIButtonIcon from '@/components/common/UI/UIButtonIcon.vue';
import { useAsyncPopup } from '@/composables/useAsyncPopup.js';

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
    return survey.value.user.userProfile.medium_name;
});

// extra additions

const extraTasks = ref([]);

function setExtraTasks(survey) {
    const taskIds = survey.questions
        .map(question =>
            Object.values(question.answers).map(answers =>
                answers.map(answer => answer.surveyQuestionAnswer.tasks.map(task => task.id))
            )
        )
        .flat(3);

    const surveyTasksSet = new Set(taskIds);

    extraTasks.value = props.message.tasks.filter(task => !surveyTasksSet.has(task.id));
}

// survey

const { isLoading: surveyIsLoading } = useDelayedLoader(true);

const survey = ref(null);

async function fetchSurvey() {
    surveyIsLoading.value = true;

    const response = await api.survey.get(props.message.surveys[0].id);
    if (response) {
        survey.value = response;

        setExtraTasks(response);
    }

    surveyIsLoading.value = false;
}

onMounted(fetchSurvey);

const { show: showSurvey } = useAsyncPopup('surveyPreview');

function showPreview() {
    showSurvey({ surveyId: survey.value.id });
}
</script>
