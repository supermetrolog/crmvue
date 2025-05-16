<template>
    <div class="messenger-quiz-preview survey-card">
        <AnimationTransition :speed="0.3">
            <Spinner v-if="isLoading" label="Загрузка результатов.." class="absolute-center" />
            <div v-else-if="survey">
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
                <SurveyCardInfo @edit="$emit('edit', survey)" :quiz="survey" />
                <div v-if="survey.calls.length" class="survey-card__calls">
                    <p class="text-grey">Звонки в опросе:</p>
                    <CallInlineCard
                        v-for="call in survey.calls"
                        :key="call.id"
                        @show-call="showCall(call.id)"
                        @show-contact="showContact(call.contact_id)"
                        :call="call"
                        class="messenger-quiz-preview__element"
                    />
                </div>
                <SurveyCardTasks
                    v-if="survey.tasks.length"
                    v-model:tasks="survey.tasks"
                    @hide="$emit('hide')"
                    class="messenger-quiz-preview__element mb-2"
                />
                <div v-if="survey.questions.length" class="messenger-quiz-preview__list">
                    <SurveyCardQuestion
                        v-for="question in survey.questions"
                        :key="question.id"
                        :question="question"
                        class="messenger-quiz-preview__element"
                    />
                </div>
                <UiField v-else color="light" class="w-100 text-center fs-4 py-3">
                    Без изменений
                </UiField>
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
        </AnimationTransition>
    </div>
</template>
<script setup>
import SurveyCardQuestion from '@/components/SurveyCard/SurveyCardQuestion.vue';
import { computed, onMounted, ref, watch } from 'vue';
import Spinner from '@/components/common/Spinner.vue';
import api from '@/api/api.js';
import SurveyCardInfo from '@/components/SurveyCard/SurveyCardInfo.vue';
import SurveyCardTasks from '@/components/SurveyCard/SurveyCardTasks.vue';
import { isNullish } from '@/utils/helpers/common/isNullish.js';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import { useAsyncPopup } from '@/composables/useAsyncPopup.js';
import { useMessenger } from '@/components/Messenger/useMessenger.js';
import { messenger } from '@/const/messenger.js';
import UiButton from '@/components/common/UI/UiButton.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import SurveyCardDependent from '@/components/SurveyCard/SurveyCardDependent.vue';
import UiField from '@/components/common/UI/UiField.vue';
import CallInlineCard from '@/components/Call/InlineCard/CallInlineCard.vue';
import SurveyCardContactPreview from '@/components/SurveyCard/SurveyCardContactPreview.vue';

defineEmits(['hide', 'edit']);
const props = defineProps({
    quizId: Number,
    quiz: Object
});

const isLoading = ref(isNullish(props.quiz));

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

// contact

const viewedContactId = ref(null);
const contactModalIsVisible = ref(false);

function showContact(contactId) {
    viewedContactId.value = contactId;
    contactModalIsVisible.value = true;
}

// TODO: Show call feature
</script>
