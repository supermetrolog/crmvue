<template>
    <div class="h-100 d-flex flex-column gap-2 survey-card-advanced">
        <div class="survey-card-advanced__header">
            <Spinner v-if="companyIsLoading" label="Загрузка компании" small />
            <SurveyFormHeaderCompany v-else-if="company" :company editable />
        </div>
        <Stepper
            :show-progress="false"
            :steps="steps"
            keep-alive
            class="survey-form__stepper"
            footer-class="survey-form__footer"
            read-only
        >
            <template v-if="canBeEdit" #after-navigation>
                <template v-if="company">
                    <SurveyFormStepperRelations :company :survey />
                    <span>|</span>
                </template>
                <UiButton @click="onEditSurvey" icon="fa-solid fa-pen" color="light" small>
                    {{ editButtonLabel }}
                </UiButton>
            </template>
            <template #1>
                <SurveyCardAdvancedCalls
                    @show-contact="showContact"
                    :contacts="contactsAnswer"
                    :survey
                />
            </template>
            <template #2>
                <Spinner v-if="companyIsLoading" label="Загрузка компании.." />
                <SurveyCardAdvancedObjects
                    v-else
                    :prepared="currentObjectsAnswer"
                    :created="createdObjectsAnswer"
                    :company
                />
            </template>
            <template #3>
                <SurveyCardAdvancedRequests
                    :prepared="currentRequestsAnswer"
                    :created="createdRequestsAnswer"
                />
            </template>
            <template #4>
                <SurveyCardAdvancedQuestions :questions="otherQuestions" />
            </template>
        </Stepper>
        <UiModal
            v-if="isDraft"
            relative
            show
            hide-header
            :width="500"
            class="messenger-quiz__disabled"
        >
            <div class="d-flex align-items-center justify-content-center gap-4 p-4">
                <i class="fa-solid fa-pen-ruler icon" />
                <div>
                    <p class="font-weight-semi fs-4">Опрос находится в стадии черновика</p>
                    <p>Ответы могут отсутствовать или быть изменены автором опроса.</p>
                </div>
            </div>
            <template #actions="{ close }">
                <UiButton @click="close" color="light" icon="fa-solid fa-xmark">
                    Закрыть предупреждение
                </UiButton>
            </template>
        </UiModal>
        <UiModal
            v-model:visible="contactModalIsVisible"
            :title="`Просмотр контакта #${viewedContactId}`"
            :width="700"
            :min-height="240"
            relative
        >
            <SurveyCardContactPreview :contact-id="viewedContactId" />
        </UiModal>
    </div>
</template>
<script setup>
import { computed, onBeforeMount, reactive, ref, toRef } from 'vue';
import { messenger } from '@/const/messenger.js';
import api from '@/api/api.js';
import Stepper from '@/components/common/Stepper/Stepper.vue';
import SurveyCardAdvancedQuestions from '@/components/SurveyCard/SurveyCardAdvancedQuestions.vue';
import SurveyCardAdvancedCalls from '@/components/SurveyCard/SurveyCardAdvancedCalls.vue';
import Spinner from '@/components/common/Spinner.vue';
import SurveyFormHeaderCompany from '@/components/SurveyForm/SurveyFormHeaderCompany.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import SurveyCardContactPreview from '@/components/SurveyCard/SurveyCardContactPreview.vue';
import { useSurveyEditing } from '@/components/Survey/useSurveyEditing.js';
import { useSurveyForm } from '@/composables/useSurveyForm.js';
import SurveyFormStepperRelations from '@/components/SurveyForm/SurveyFormStepperRelations.vue';
import SurveyCardAdvancedRequests from '@/components/SurveyCard/SurveyCardAdvancedRequests.vue';
import SurveyCardAdvancedObjects from '@/components/SurveyCard/SurveyCardAdvancedObjects.vue';

const emit = defineEmits(['hide']);
const props = defineProps({
    survey: {
        type: Object,
        required: true
    }
});

const isDraft = computed(() => props.survey.status === 'draft');

const contactsAnswer = computed(() => {
    const question = props.survey.questions.find(question => question.group === 'calls-step');
    if (!question) return {};

    const answer = question.answers.custom[0].surveyQuestionAnswer.value;

    return answer ?? {};
});

const callsCount = computed(() => Object.keys(contactsAnswer.value).length);

function getQuestionAnswerByKind(question, kind, group = 'custom') {
    return question.answers[group].find(answer =>
        answer.effects.some(effect => effect.kind === kind)
    );
}

const currentObjectsAnswer = computed(() => {
    const question = props.survey.questions.find(question => question.group === 'objects-step');
    if (!question) return {};

    const answer = getQuestionAnswerByKind(question, 'current-offers-step');
    if (!answer) return {};

    return answer.surveyQuestionAnswer.value ?? {};
});

const objectsCount = computed(() => {
    return Object.keys(currentObjectsAnswer.value).length;
});

const createdObjectsAnswer = computed(() => {
    const question = props.survey.questions.find(question => question.group === 'objects-step');
    if (!question) return null;

    const answer = getQuestionAnswerByKind(question, 'created-offers-step');
    if (!answer) return null;

    return answer.surveyQuestionAnswer.value;
});

const currentRequestsAnswer = computed(() => {
    const question = props.survey.questions.find(question => question.group === 'requests-step');
    if (!question) return {};

    const answer = getQuestionAnswerByKind(question, 'current-requests-step');
    if (!answer) return {};

    return answer.surveyQuestionAnswer.value ?? {};
});

const createdRequestsAnswer = computed(() => {
    const question = props.survey.questions.find(question => question.group === 'requests-step');
    if (!question) return [];

    const answer = getQuestionAnswerByKind(question, 'created-requests-step');
    if (!answer) return [];

    return answer.surveyQuestionAnswer.value ?? [];
});

const requestsCount = computed(() => Object.keys(currentRequestsAnswer.value).length);

const otherQuestions = computed(() =>
    props.survey.questions.filter(question => question.group === 'other-step')
);

const steps = reactive([
    {
        name: 'calls',
        title: computed(() => {
            return `Контакты (${callsCount.value})`;
        })
    },
    {
        name: 'objects',
        title: computed(() => {
            return `Предложения (${objectsCount.value})${createdObjectsAnswer.value?.length ? ' + новое' : ''}`;
        })
    },
    {
        name: 'requests',
        title: computed(() => {
            return `Запросы (${requestsCount.value})${createdRequestsAnswer.value?.length ? ' + ' + createdRequestsAnswer.value.length + ' новых' : ''}`;
        })
    },
    {
        name: 'other',
        title: computed(() => {
            return `Прочее (${otherQuestions.value.length})`;
        })
    }
]);

// company

const company = ref(null);
const companyIsLoading = ref(null);

const companyId = computed(() => {
    if (props.survey.chatMember.model_type === messenger.dialogTypes.COMPANY) {
        return props.survey.chatMember.model_id;
    }

    return (
        props.survey.chatMember.model.object.company?.id ??
        props.survey.chatMember.model.object.company_id
    );
});

async function fetchCompany() {
    companyIsLoading.value = true;

    company.value = await api.companies.getCompany(companyId.value);

    companyIsLoading.value = false;
}

onBeforeMount(fetchCompany);

// preview

const { canBeEdit, remainingTimeLabel } = useSurveyEditing(toRef(props, 'survey'));

const editButtonLabel = computed(() => {
    if (remainingTimeLabel.value) return `Редактировать (осталось ${remainingTimeLabel.value})`;
    return 'Редактировать';
});

// contact

const viewedContactId = ref(null);
const contactModalIsVisible = ref(false);

function showContact(contactId) {
    viewedContactId.value = contactId;
    contactModalIsVisible.value = true;
}

// edit

const { editSurvey } = useSurveyForm();

function onEditSurvey() {
    emit('hide');
    editSurvey(props.survey);
}
</script>
