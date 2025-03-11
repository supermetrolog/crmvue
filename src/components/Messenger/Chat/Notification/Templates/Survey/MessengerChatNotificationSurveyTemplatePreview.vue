<template>
    <div class="messenger-quiz-preview">
        <div
            v-if="survey.dependentSurveys.length || survey.related_survey_id"
            class="messenger-quiz-preview__links"
        >
            <MessengerButton
                v-if="survey.dependentSurveys.length"
                @click="dependentIsVisible = true"
                class="small"
                color="light"
            >
                <i class="fa-solid fa-link" />
                <span>{{ survey.dependentSurveys.length }} связанных опросов</span>
            </MessengerButton>
            <MessengerButton
                v-if="survey.related_survey_id"
                @click="showRelatedSurvey"
                class="small"
                color="light"
            >
                <i class="fa-solid fa-chess-king"></i>
                <span>Создан от основного опроса</span>
            </MessengerButton>
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
                    <SurveyCardQuestionTemplateCompany :answers="answers" />
                </template>
                <template
                    v-else-if="
                        questionWithRelevantRequestsInfo &&
                        question.id === questionWithRelevantRequestsInfo.id
                    "
                    #textarea="{ answers }"
                >
                    <SurveyCardQuestionTemplateRequestsList :answers="answers" />
                </template>
            </MessengerChatNotificationSurveyTemplatePreviewQuestion>
        </div>
        <div v-else class="px-2">
            <DashboardChip class="dashboard-bg-light w-100">Без изменений</DashboardChip>
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
        </Teleport>
    </div>
</template>
<script setup>
import { computed, ref } from 'vue';
import MessengerChatNotificationSurveyTemplatePreviewQuestion from '@/components/Messenger/Chat/Notification/Templates/Survey/MessengerChatNotificationSurveyTemplatePreviewQuestion.vue';
import { quizEffectKinds } from '@/const/quiz.js';
import SurveyCardQuestionTemplateCompany from '@/components/SurveyCard/QuestionTemplate/SurveyCardQuestionTemplateCompany.vue';
import SurveyCardQuestionTemplateRequestsList from '@/components/SurveyCard/QuestionTemplate/SurveyCardQuestionTemplateRequestsList.vue';
import { useAsyncPopup } from '@/composables/useAsyncPopup.js';
import UiModal from '@/components/common/UI/UiModal.vue';
import MessengerButton from '@/components/Messenger/MessengerButton.vue';
import { useMessenger } from '@/components/Messenger/useMessenger.js';
import { messenger } from '@/const/messenger.js';
import SurveyCardDependent from '@/components/SurveyCard/SurveyCardDependent.vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';

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
</script>
