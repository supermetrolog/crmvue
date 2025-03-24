<template>
    <div class="messenger-quiz-preview">
        <div v-if="survey.calls.length" class="messenger-quiz-preview__calls">
            <div class="mt-1 d-flex flex-column gap-1">
                <CallInlineCard
                    v-for="call in survey.calls"
                    :key="call.id"
                    @show-call="showCall(call.id)"
                    @show-contact="showContact(call.contact_id)"
                    :call="call"
                    class="messenger-quiz-preview__call"
                />
            </div>
        </div>
        <div class="messenger-quiz-preview__links">
            <UiButton
                v-if="survey.dependentSurveys.length"
                @click="dependentIsVisible = true"
                icon="fa-solid fa-link"
                color="light"
                small
                bolder
            >
                {{ survey.dependentSurveys.length }} связанных опросов
            </UiButton>
            <UiButton
                v-if="survey.related_survey_id"
                @click="showRelatedSurvey"
                icon="fa-solid fa-chess-king"
                color="light"
                small
                bolder
            >
                Создан от основного опроса
            </UiButton>
        </div>
        <div v-if="survey.questions.length" class="messenger-quiz-preview__list">
            <MessengerChatNotificationSurveyTemplatePreviewQuestion
                v-for="question in survey.questions"
                :key="question.id"
                :question="question"
                :short
                class="messenger-quiz-preview__element"
            >
                <template
                    v-if="questionWithCompaniesInfo && question.id === questionWithCompaniesInfo.id"
                    #textarea="{ answers }"
                >
                    <SurveyCardQuestionTemplateCustomCompany :answers="answers" />
                </template>
                <template
                    v-else-if="
                        questionWithRelevantRequestsInfo &&
                        question.id === questionWithRelevantRequestsInfo.id
                    "
                    #textarea="{ answers }"
                >
                    <SurveyCardQuestionTemplateCustomRequestsList :answers="answers" />
                </template>
            </MessengerChatNotificationSurveyTemplatePreviewQuestion>
        </div>
        <div v-else class="px-2">
            <UiField class="dashboard-bg-light w-100 text-center">Без изменений</UiField>
        </div>
        <Teleport to="body">
            <UiModal
                v-model:visible="dependentIsVisible"
                :width="1000"
                :title="`Связанные опросы (${survey.dependentSurveys.length})`"
            >
                <div class="d-flex flex-column gap-2">
                    <SurveyCardDependent
                        v-for="dependent in survey.dependentSurveys"
                        :key="dependent.id"
                        @show="openSurvey(dependent.id)"
                        @to-chat="toOfferChat(dependent.chatMember)"
                        @edit="editSurvey(dependent.id)"
                        :survey="dependent"
                    />
                </div>
            </UiModal>
            <UiModal
                v-model:visible="contactModalIsVisible"
                :title="`Просмотр контакта #${viewedContactId}`"
                :width="700"
                :min-height="240"
            >
                <SurveyCardContactPreview :contact-id="viewedContactId" />
            </UiModal>
        </Teleport>
    </div>
</template>
<script setup>
import { computed, ref } from 'vue';
import MessengerChatNotificationSurveyTemplatePreviewQuestion from '@/components/Messenger/Chat/Notification/Templates/Survey/MessengerChatNotificationSurveyTemplatePreviewQuestion.vue';
import { quizEffectKinds } from '@/const/quiz.js';
import SurveyCardQuestionTemplateCustomCompany from '@/components/SurveyCard/QuestionTemplate/Custom/SurveyCardQuestionTemplateCustomCompany.vue';
import SurveyCardQuestionTemplateCustomRequestsList from '@/components/SurveyCard/QuestionTemplate/Custom/SurveyCardQuestionTemplateCustomRequestsList.vue';
import { useAsyncPopup } from '@/composables/useAsyncPopup.js';
import UiModal from '@/components/common/UI/UiModal.vue';
import { useMessenger } from '@/components/Messenger/useMessenger.js';
import { messenger } from '@/const/messenger.js';
import SurveyCardDependent from '@/components/SurveyCard/SurveyCardDependent.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import UiField from '@/components/common/UI/UiField.vue';
import CallInlineCard from '@/components/Call/InlineCard/CallInlineCard.vue';
import SurveyCardContactPreview from '@/components/SurveyCard/SurveyCardContactPreview.vue';

const props = defineProps({
    survey: {
        type: Object,
        required: true
    },
    short: Boolean
});

const questionWithCompaniesInfo = computed(() => {
    return props.survey.questions.find(question => {
        return (
            'text-answer' in question.answers &&
            question.answers['text-answer'].some(element =>
                element.effects.some(
                    effect => effect.kind === quizEffectKinds.COMPANIES_ON_OBJECT_IDENTIFIED
                )
            )
        );
    });
});

const questionWithRelevantRequestsInfo = computed(() => {
    return props.survey.questions.find(question => {
        return (
            'text-answer' in question.answers &&
            question.answers['text-answer'].some(element =>
                element.effects.some(
                    effect => effect.kind === quizEffectKinds.REQUESTS_NO_LONGER_RELEVANT
                )
            )
        );
    });
});

const { show: showSurvey } = useAsyncPopup('surveyPreview');

const dependentIsVisible = ref(false);

function closeDependentModal() {
    dependentIsVisible.value = false;
}

function editSurvey(surveyId) {
    closeDependentModal();
    showSurvey({ surveyId: surveyId, editMode: true });
}

function openSurvey(surveyId) {
    closeDependentModal();
    showSurvey({ surveyId: surveyId });
}

function showRelatedSurvey() {
    showSurvey({ surveyId: props.survey.related_survey_id });
}

// chat

const { openChat } = useMessenger();

async function toOfferChat(chat) {
    const opened = await openChat(
        chat.model.object.company?.id,
        chat.model.object.id,
        messenger.dialogTypes.OBJECT,
        chat.model.type
    );

    if (opened) closeDependentModal();
}

// calls

function showCall(callId) {}

const viewedContactId = ref(null);
const contactModalIsVisible = ref(false);

function showContact(contactId) {
    viewedContactId.value = contactId;
    contactModalIsVisible.value = true;
}
</script>
