<template>
    <div class="messenger-quiz-preview">
        <AnimationTransition :speed="0.3">
            <Spinner v-if="isLoading" label="Загрузка результатов.." class="absolute-center" />
            <div v-else-if="survey">
                <MessengerQuizPreviewInfo @edit="$emit('edit', survey)" :quiz="survey" />
                <div
                    v-if="survey.dependentSurveys.length || survey.related_survey_id"
                    class="d-flex gap-1 mb-2"
                >
                    <UiButton
                        v-if="survey.dependentSurveys.length"
                        @click="dependentIsVisible = true"
                        bolder
                        small
                        icon="fa-solid fa-link"
                        color="light"
                    >
                        {{ survey.dependentSurveys.length }} связанных опросов
                    </UiButton>
                    <UiButton
                        v-if="survey.related_survey_id"
                        @click="showRelatedSurvey"
                        bolder
                        small
                        icon="fa-solid fa-chess-king"
                        color="light"
                    >
                        Создан от основного опроса
                    </UiButton>
                </div>
                <MessengerQuizPreviewTasks
                    v-if="survey.tasks.length"
                    v-model:tasks="survey.tasks"
                    @hide="$emit('hide')"
                    class="messenger-quiz-preview__element mb-2"
                />
                <div v-if="survey.questions.length" class="messenger-quiz-preview__list">
                    <MessengerQuizPreviewQuestion
                        v-for="question in survey.questions"
                        :key="question.id"
                        :question="question"
                        class="messenger-quiz-preview__element"
                    >
                        <template
                            v-if="
                                questionWithCompaniesInfo &&
                                question.id === questionWithCompaniesInfo.id
                            "
                            #textarea="{ answers }"
                        >
                            <MessengerQuizPreviewCompanyTemplate :answers="answers" />
                        </template>
                        <template
                            v-else-if="
                                questionWithRelevantRequestsInfo &&
                                question.id === questionWithRelevantRequestsInfo.id
                            "
                            #textarea="{ answers }"
                        >
                            <MessengerQuizPreviewRequestsTemplate :answers="answers" />
                        </template>
                    </MessengerQuizPreviewQuestion>
                </div>
                <Teleport to="body">
                    <UiModal
                        v-model:visible="dependentIsVisible"
                        :width="1000"
                        :title="`Связанные опросы (${survey.dependentSurveys.length})`"
                    >
                        <div class="d-flex flex-column gap-2">
                            <MessengerChatNotificationSurveyTemplatePreviewDependent
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
        </AnimationTransition>
    </div>
</template>
<script setup>
import MessengerQuizPreviewQuestion from '@/components/Messenger/Quiz/Preview/MessengerQuizPreviewQuestion.vue';
import { computed, onMounted, ref, watch } from 'vue';
import Spinner from '@/components/common/Spinner.vue';
import api from '@/api/api.js';
import MessengerQuizPreviewInfo from '@/components/Messenger/Quiz/Preview/MessengerQuizPreviewInfo.vue';
import { quizEffectKinds } from '@/const/quiz.js';
import MessengerQuizPreviewCompanyTemplate from '@/components/Messenger/Quiz/Preview/Template/MessengerQuizPreviewCompanyTemplate.vue';
import MessengerQuizPreviewRequestsTemplate from '@/components/Messenger/Quiz/Preview/Template/MessengerQuizPreviewRequestsTemplate.vue';
import MessengerQuizPreviewTasks from '@/components/Messenger/Quiz/Preview/MessengerQuizPreviewTasks.vue';
import { isNullish } from '@/utils/helpers/common/isNullish.js';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import UiModal from '@/components/common/UI/UiModal.vue';
import MessengerChatNotificationSurveyTemplatePreviewDependent from '@/components/Messenger/Chat/Notification/Templates/MessengerChatNotificationSurveyTemplatePreviewDependent.vue';
import { useAsyncPopup } from '@/composables/useAsyncPopup.js';
import { useMessenger } from '@/components/Messenger/useMessenger.js';
import { messenger } from '@/const/messenger.js';
import UiButton from '@/components/common/UI/UiButton.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';

defineEmits(['hide', 'edit']);
const props = defineProps({
    quizId: Number,
    quiz: Object
});

const isLoading = ref(isNullish(props.quiz));

const questionWithCompaniesInfo = computed(() => {
    return survey.value.questions.find(question => {
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
    return survey.value.questions.find(question => {
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

const localQuiz = ref(null);

const survey = computed(() => {
    return props.quiz ?? localQuiz.value;
});

async function fetchQuiz() {
    isLoading.value = true;
    localQuiz.value = await api.survey.get(props.quizId);
    isLoading.value = false;
}

onMounted(() => {
    if (isNullish(props.quiz) && isNotNullish(props.quizId)) fetchQuiz();
});

watch(
    () => props.quizId,
    value => {
        if (isNotNullish(value)) {
            fetchQuiz();
        }
    }
);

// preview

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
    showSurvey({ surveyId: survey.value.related_survey_id });
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
