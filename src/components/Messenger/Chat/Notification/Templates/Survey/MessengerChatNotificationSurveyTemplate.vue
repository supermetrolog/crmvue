<template>
    <div class="messenger-chat-notification-template messenger-chat-template-survey">
        <MessengerChatMessageAdditions
            v-if="!short"
            :tasks="extraTasks"
            :notifications="message.notifications"
        />
        <div class="messenger-chat-template-survey__header">
            <span class="d-flex gap-1">
                <UiButtonIcon
                    @click="showPreview"
                    small
                    label="Подробнее"
                    icon="fa-solid fa-file-lines"
                    :disabled="surveyIsLoading"
                    color="gray-l"
                />
                <UiButtonIcon
                    v-if="canBeEdit"
                    @click="editSurvey"
                    small
                    :disabled="surveyIsLoading"
                    :label="editButtonLabel"
                    icon="fa-solid fa-pen"
                    color="gray-l"
                />
                <UiCan admin>
                    <UiButtonIcon
                        @click="defaultTextIsVisible = true"
                        small
                        label="Сырой вид"
                        icon="fa-solid fa-file"
                        color="gray-l"
                    />
                </UiCan>
            </span>
            <UiField class="fs-3" small color="light">Опрос заполнен!</UiField>
            <div v-if="survey" class="d-flex align-items-center gap-1 ml-auto">
                <Avatar :src="survey.user.userProfile.avatar" :size="25" />
                <span class="font-weight-bold">{{ senderShortName }}</span>
                <span>с</span>
                <span class="font-weight-bold">{{ recipientUsername }}</span>
            </div>
        </div>
        <MessengerChatNotificationSurveyTemplateSkeleton v-if="surveyIsLoading" />
        <MessengerChatNotificationSurveyTemplatePreview v-else-if="survey" :survey :short />
        <Teleport v-if="currentUserIsAdmin" to="body">
            <UiModal
                v-model:visible="defaultTextIsVisible"
                :width="800"
                title="Сырой вид сообщения"
            >
                <p v-html="message.message"></p>
            </UiModal>
        </Teleport>
    </div>
</template>
<script setup>
import { computed, onMounted, ref, toRef } from 'vue';
import { entityOptions } from '@/const/options/options.js';
import api from '@/api/api.js';
import MessengerChatNotificationSurveyTemplateSkeleton from '@/components/Messenger/Chat/Notification/Templates/Survey/MessengerChatNotificationSurveyTemplateSkeleton.vue';
import MessengerChatNotificationSurveyTemplatePreview from '@/components/Messenger/Chat/Notification/Templates/Survey/MessengerChatNotificationSurveyTemplatePreview.vue';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import MessengerChatMessageAdditions from '@/components/Messenger/Chat/Message/Additions/MessengerChatMessageAdditions.vue';
import UiButtonIcon from '@/components/common/UI/UiButtonIcon.vue';
import { useAsyncPopup } from '@/composables/useAsyncPopup.js';
import { useSurveyEditing } from '@/components/Survey/useSurveyEditing.js';
import { useAuth } from '@/composables/useAuth';
import UiModal from '@/components/common/UI/UiModal.vue';
import UiField from '@/components/common/UI/UiField.vue';
import Avatar from '@/components/common/Avatar.vue';
import UiCan from '@/components/common/UI/UiCan.vue';

const props = defineProps({
    message: {
        type: Object,
        required: true
    },
    short: Boolean
});

const { currentUserIsAdmin } = useAuth();

const defaultTextIsVisible = ref(false);

// recipient

const recipientUsername = computed(() => {
    const contact = props.message.contacts[0];
    if (contact.type === entityOptions.contact.typeStatement.GENERAL) return 'Общий контакт';
    return contact.first_name + (contact.last_name ? ` ${contact.last_name}` : '');
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
                answers.map(answer => {
                    if (answer.surveyQuestionAnswer?.tasks?.length) {
                        return answer.surveyQuestionAnswer.tasks.map(task => task.id);
                    }

                    return [];
                })
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

        if (!props.short) setExtraTasks(response);
    }

    surveyIsLoading.value = false;
}

onMounted(fetchSurvey);

// show

const { show: showSurvey } = useAsyncPopup('surveyPreview');

function showPreview() {
    showSurvey({ survey: survey.value });
}

// edit

const { canBeEdit, remainingTimeLabel } = useSurveyEditing(toRef(() => props.message.surveys[0]));

const editButtonLabel = computed(() => {
    if (remainingTimeLabel.value) return `Редактировать (осталось ${remainingTimeLabel.value})`;
    return 'Редактировать';
});

async function editSurvey() {
    const updatedSurvey = await showSurvey({ survey: survey.value, editMode: true });
    if (updatedSurvey) Object.assign(survey.value, updatedSurvey);
}
</script>
