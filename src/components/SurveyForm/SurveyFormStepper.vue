<template>
    <Stepper
        v-model:step="step"
        @complete="completeSurvey"
        @update:step="onUpdateStep"
        :v="v$.form"
        :show-progress="false"
        :steps="steps"
        keep-alive
        class="survey-form__stepper"
        footer-class="survey-form__footer"
        :disabled="isCreating"
        :navigation-attrs="{
            'data-tour-id': 'survey-form:stepper-navigation'
        }"
        :body-attrs="{
            'data-tour-id': 'survey-form:stepper-body'
        }"
    >
        <template #after-navigation>
            <SurveyFormStepperRelations :company :survey="currentSurvey" />
        </template>
        <template #before-body>
            <SurveyFormStepperHelper />
        </template>
        <template #1>
            <SurveyFormCalls
                v-model="form.calls"
                @change="onChangeCalls"
                @contact-created="$emit('contact-created', $event)"
                @contact-updated="$emit('contact-updated', $event)"
                @add-contact="$emit('add-contact')"
                :company
                :contacts
                :passive-contacts
                :chat-member-id
                :survey-id="currentSurveyId"
                :disabled
                :survey="survey ?? draft"
            />
        </template>
        <template #2>
            <Spinner v-if="objectsIsLoading" class="absolute-center" label="Загрузка объектов.." />
            <SurveyFormObjects
                v-else
                v-model="form.objects"
                :company
                :objects
                :survey="survey ?? draft"
                :disabled
            />
        </template>
        <template #3>
            <Spinner v-if="requestsIsLoading" class="absolute-center" label="Загрузка запросов.." />
            <SurveyFormRequests
                v-else
                v-model="form.requests"
                @created="onCreateRequest"
                :company
                :requests
                :disabled
                :survey="survey ?? draft"
            />
        </template>
        <template #4>
            <Spinner
                v-if="questionsIsLoading"
                class="absolute-center"
                label="Загрузка дополнительные вопросов.."
            />
            <SurveyFormQuestions
                v-else-if="questions.length"
                ref="questionsStep"
                :form="form.other"
                :questions="otherQuestions"
                :company
                :disabled
            />
        </template>
        <template #footer="{ complete }">
            <div class="d-flex gap-2" data-tour-id="survey-form:stepper-actions">
                <template v-if="canBeCancelled">
                    <UiButton
                        @click="delaySurvey"
                        tooltip="Отложить опрос на 5 дней для дальнейшей попытки созвониться"
                        color="warning"
                        icon="fa-solid fa-phone-slash"
                        :disabled
                    >
                        Можно отложить опрос
                    </UiButton>
                    <UiButton
                        @click="cancelSurvey"
                        tooltip='Завершить опрос с отметкой "Не удалось дозвониться"'
                        color="danger-light"
                        icon="fa-solid fa-phone-slash"
                        :disabled
                    >
                        Можно сохранить опрос
                    </UiButton>
                </template>
                <UiButton
                    v-else
                    @click="complete"
                    :color="formIsValid ? 'success' : 'danger'"
                    icon="fa-solid fa-check"
                    class="survey-form__stepper-action"
                    :class="{ disabled: !formIsValid }"
                    :disabled
                >
                    {{ formIsValid ? 'Можно сохранить опрос' : 'Нельзя сохранить опрос' }}
                </UiButton>
            </div>
        </template>
        <template #after>
            <Loader v-if="isCreating || surveyIsUpdating" label="Сохранение опроса.." />
            <SurveyFormStepperSummary
                v-if="currentSurvey"
                v-model:form="form"
                v-model:visible="summaryModalIsVisible"
                @closed="isCancelling = false"
                @complete="completeOrCancel"
                :edit-mode="isEditMode"
                :contacts
                :objects
                :requests="activeRequests"
                :other="otherQuestions"
                :survey="currentSurvey"
            />
        </template>
    </Stepper>
</template>
<script setup>
import { computed, onBeforeMount, reactive, ref, useTemplateRef, watch } from 'vue';
import Stepper from '@/components/common/Stepper/Stepper.vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.ts';
import { useEventBus, useIntervalFn } from '@vueuse/core';
import api from '@/api/api.js';
import { surveyConfig } from '@/configs/survey.config.js';
import { useAuth } from '@/composables/useAuth';
import { isNullish } from '@/utils/helpers/common/isNullish.ts';
import UiButton from '@/components/common/UI/UiButton.vue';
import { useAsync } from '@/composables/useAsync.js';
import SurveyFormObjects from '@/components/SurveyForm/SurveyFormObjects.vue';
import Spinner from '@/components/common/Spinner.vue';
import { useStore } from 'vuex';
import { useNotify } from '@/utils/use/useNotify.js';
import SurveyFormQuestions from '@/components/SurveyForm/SurveyFormQuestions.vue';
import SurveyFormRequests from '@/components/SurveyForm/SurveyFormRequests.vue';
import { helpers } from '@vuelidate/validators';
import SurveyFormCalls from '@/components/SurveyForm/SurveyFormCalls.vue';
import { useValidation } from '@/composables/useValidation.js';
import { callStatusEnum, callTypeEnum } from '@/const/enums/call.js';
import { CALL_STATUSES } from '@/components/MessengerQuiz/useMessengerQuiz.js';
import { captureException } from '@sentry/vue';
import dayjs from 'dayjs';
import { getCompanyShortName } from '@/utils/formatters/models/company.js';
import Loader from '@/components/common/Loader.vue';
import SurveyFormStepperRelations from '@/components/SurveyForm/SurveyFormStepperRelations.vue';
import SurveyFormStepperHelper from '@/components/SurveyForm/SurveyFormStepperHelper.vue';
import SurveyFormStepperSummary from '@/components/SurveyForm/SurveyFormStepperSummary.vue';
import { useConfirm } from '@/composables/useConfirm.js';
import { createTourStepElementGenerator, useTourStep } from '@/composables/useTour/useTourStep';

function toBool(value) {
    if (typeof value === 'string') return value === 'true';
    return value;
}

const emit = defineEmits([
    'draft-created',
    'draft-updated',
    'survey-updated',
    'draft-deleted',
    'draft-expired',
    'contact-created',
    'contact-updated',
    'completed',
    'canceled',
    'delayed',
    'add-contact'
]);

const props = defineProps({
    draft: Object,
    survey: Object,
    initialStep: Number,
    company: {
        type: Object,
        required: true
    },
    contacts: {
        type: Array,
        default: () => []
    },
    chatMemberId: {
        type: Number,
        required: true
    },
    disabled: Boolean,
    passiveContacts: {
        type: Array,
        default: () => []
    }
});

const isEditMode = computed(() => isNotNullish(props.survey));

const currentSurveyId = computed(() => {
    if (isNotNullish(currentSurvey.value)) return currentSurvey.value.id;

    return null;
});

const currentSurvey = computed(() => {
    if (isNotNullish(props.survey)) return props.survey;
    if (isNotNullish(props.draft)) return props.draft;
    return null;
});

// draft

const stopDraftWatch = watch(
    () => props.draft,
    value => {
        if (isNotNullish(value)) {
            if (!props.disabled) {
                resume();
            }

            stopDraftWatch();
        }
    }
);

const { execute: createDraft } = useAsync(api.survey.create, {
    payload: () => [
        {
            chat_member_id: props.chatMemberId,
            user_id: currentUserId.value,
            type: 'advanced'
        }
    ],
    onFetchResponse({ response }) {
        emit('draft-created', response);
    }
});

const { isLoading: draftIsUpdating, execute: updateDraft } = useAsync(
    api.survey.updateWithAnswers,
    {
        payload: () => [props.draft.id, createDraftPayload()],
        onFetchResponse({ response }) {
            emit('draft-updated', response);
        }
    }
);

const { isLoading: surveyIsUpdating, execute: updateSurvey } = useAsync(
    api.survey.updateWithAnswers,
    {
        payload: () => [props.survey.id, createDraftPayload()],
        onFetchResponse({ response }) {
            notify.success('Опрос успешно обновлен', 'Обновление опроса');
            emit('survey-updated', response);
        }
    }
);

function onChangeCalls() {
    if (isNotNullish(props.survey)) return;
    if (isNullish(props.draft)) createDraft();
}

async function saveDraft() {
    if (isNotNullish(props.draft)) {
        await updateDraft();
    } else {
        await createDraft();
    }
}

defineExpose({ createDraft, updateDraft, updateSurvey });

const { pause, resume } = useIntervalFn(updateDraft, surveyConfig.DRAFT_UPDATE_INTERVAL, {
    immediate: isNotNullish(props.draft)
});

watch(
    () => props.disabled,
    value => {
        if (isNullish(props.draft)) return;

        if (value) pause();
        else resume();
    },
    { immediate: true }
);

const draftShouldBeSaved = ref(false);

function onUpdateStep() {
    if (!isLoading.value && isNullish(props.survey) && !props.disabled)
        draftShouldBeSaved.value = true;
}

watch(draftShouldBeSaved, value => {
    if (draftIsUpdating.value) return;
    if (value) saveDraft();
});

watch(draftIsUpdating, value => {
    if (!value && draftShouldBeSaved.value) {
        draftShouldBeSaved.value = false;
        updateDraft();
    }
});

// form

const stepsIsDisabled = computed(() => isLoading.value);

const steps = reactive([
    {
        name: 'calls',
        title: computed(() => {
            return `Контакты (${props.contacts.length})`;
        })
    },
    {
        name: 'objects',
        title: computed(() => {
            if (objectsIsLoading.value || relatedObjectsIsLoading.value) {
                return 'Предложения (загрузка..)';
            }

            if (form.value.objects?.created?.length) {
                return `Предложения (${objects.value.length}) + ${form.value.objects.created.length} новых`;
            }

            return `Предложения (${objects.value.length})`;
        }),
        disabled: stepsIsDisabled,
        class: computed(() => objects.value.length === 0 && 'skip')
    },
    {
        name: 'requests',
        title: computed(() => {
            if (requestsIsLoading.value) {
                return 'Запросы (загрузка..)';
            }

            const activeCount = activeRequests.value.length;
            const passiveCount = requests.value.length - activeCount;

            const title = [
                `Запросы (${activeCount}`,
                passiveCount !== 0 ? `/${passiveCount})` : ')'
            ];

            if (form.value.requests?.created?.length) {
                title.push(` + ${form.value.requests.created.length} новых`);
            }

            return title.join('');
        }),
        disabled: stepsIsDisabled,
        class: computed(() => requests.value.length === 0 && 'skip')
    },
    {
        name: 'other',
        title: computed(() => {
            if (questionsIsLoading.value) {
                return 'Прочее (загрузка..)';
            }

            return `Прочее (${otherQuestions.value.length})`;
        }),
        disabled: stepsIsDisabled
    }
]);

const form = ref({
    calls: {},
    objects: {},
    requests: {},
    other: [],
    comment: null
});

const hasCompletedContact = computed(() => {
    const processedPhones = [];

    for (const contact of props.contacts) {
        const phones = form.value.calls[contact.id]?.phones ?? {};

        for (const phone of Object.values(phones)) {
            if (isNotNullish(phone.available)) {
                processedPhones.push(phone);
            }
        }
    }

    const hasCompletedEmail =
        isNotNullish(currentSurvey.value) &&
        currentSurvey.value.actions?.some(
            action => action.type === 'letter' && action.status === 'done'
        );

    if (processedPhones.length === 0 && !hasCompletedEmail) {
        return false;
    }

    const hasCompletedCall = processedPhones.some(
        phone => toBool(phone.available) && Number(phone.reason) === 1
    );

    return hasCompletedCall || hasCompletedEmail;
});

const hasProcessedContact = computed(() => {
    const processedPhones = [];

    for (const contact of props.contacts) {
        const phones = form.value.calls[contact.id]?.phones ?? {};

        for (const phone of Object.values(phones)) {
            if (isNotNullish(phone.available) && isNotNullish(phone.reason)) {
                processedPhones.push(phone);
            }
        }
    }

    const hasProcessedEmail =
        isNotNullish(currentSurvey.value) &&
        currentSurvey.value.actions?.some(action => action.type === 'letter');

    return processedPhones.length > 0 || hasProcessedEmail;
});

function requiredCallsValidationHandler() {
    return hasProcessedContact.value;
}

const activeRequests = computed(() => requests.value.filter(request => request.status === 1));

const { v$, validate } = useValidation(
    {
        form: {
            calls: {
                required: helpers.withMessage(
                    'Свяжитесь с представителем компании!',
                    requiredCallsValidationHandler
                )
            }
        }
    },
    { form },
    { notification: true }
);

const step = ref(props.initialStep ?? 0);

const { currentUserId } = useAuth();

function createDraftPayload() {
    const { payload: callsPayload, questionAnswers: callsQuestionAnswers } =
        createSurveyCallsPayload();

    let targetContact = callsPayload.find(contact => {
        return (
            isNotNullish(contact.available) &&
            toBool(contact.available) &&
            Number(contact.reason) === 1
        );
    });

    if (isNullish(targetContact)) {
        targetContact = Object.values(form.value.calls).find(contact => {
            return Object.values(contact.emails ?? {}).some(email => email.available);
        });
    }

    const { questionAnswers: objectsQuestionAnswers } = createSurveyObjectsPayload();

    const { questionAnswers: requestQuestionAnswers } = createSurveyRequestsPayload();

    const { questionAnswers: otherQuestionAnswers } = createSurveyQuestionsPayload();

    return {
        user_id: currentUserId.value,
        contact_id: targetContact?.contact_id,
        chat_member_id: props.chatMemberId,
        question_answers: [
            ...objectsQuestionAnswers,
            ...requestQuestionAnswers,
            ...otherQuestionAnswers,
            ...callsQuestionAnswers
        ],
        type: 'advanced',
        comment: form.value.comment
    };
}

// submit

const formIsValid = computed(() => !v$.value.$invalid);

const canBeCancelled = computed(() => {
    if (hasCompletedContact.value) return false;

    return hasProcessedContact.value;
});

function getQuestionByGroup(group) {
    const question = store.state.Quizz.questions.find(question => question.group === group);

    if (isNullish(question)) throw new Error(`Question with <${group}> group not found`);

    return question;
}

function getQuestionAnswerByKind(question, kind, group = 'custom') {
    const answer = question.answers[group].find(answer =>
        answer.effects.some(effect => effect.kind === kind)
    );

    if (isNullish(answer)) throw new Error(`Answer with <${kind}> kind not found`);

    return answer;
}

function createSurveyCallsPayload() {
    const callStepQuestion = getQuestionByGroup('calls-step');

    const callQuestionAnswer = callStepQuestion.answers.custom?.[0];

    if (isNullish(callQuestionAnswer)) throw new Error(`Answer for calls not found`);

    const questionAnswers = [
        {
            question_answer_id: callStepQuestion.answers.custom[0].id,
            value: form.value.calls
        }
    ];

    const payload = Object.values(form.value.calls).reduce((acc, contact) => {
        for (const phone of Object.values(contact?.phones ?? {})) {
            if (isNotNullish(phone.available) && isNotNullish(phone.reason)) {
                acc.push({ ...phone, phone_id: phone.id, contact_id: contact.contact_id });
            }
        }

        return acc;
    }, []);

    return { payload, questionAnswers };
}

function createSurveyObjectsPayload() {
    const objectStepQuestion = getQuestionByGroup('objects-step');

    const currentOffersAnswer = getQuestionAnswerByKind(objectStepQuestion, 'current-offers-step');
    const createdObjectAnswer = getQuestionAnswerByKind(objectStepQuestion, 'created-offers-step');

    const questionAnswers = [
        {
            question_answer_id: currentOffersAnswer.id,
            value: form.value.objects?.current
        },
        {
            question_answer_id: createdObjectAnswer.id,
            value: form.value.objects?.created
        }
    ];

    return {
        questionAnswers
    };
}

function createSurveyRequestsPayload() {
    const requestStepQuestion = getQuestionByGroup('requests-step');

    const currentRequestsAnswer = getQuestionAnswerByKind(
        requestStepQuestion,
        'current-requests-step'
    );
    const createdRequestsAnswer = getQuestionAnswerByKind(
        requestStepQuestion,
        'created-requests-step'
    );

    const questionAnswers = [
        {
            question_answer_id: currentRequestsAnswer.id,
            value: form.value.requests?.current
        },
        {
            question_answer_id: createdRequestsAnswer.id,
            value: form.value.requests?.created
        }
    ];

    return {
        questionAnswers
    };
}

const questionsStep = useTemplateRef('questionsStep');

function createSurveyQuestionsPayload() {
    return {
        questionAnswers: questionsStep.value?.getForm() ?? []
    };
}

const callReasonToStatus = {
    4: callStatusEnum.MISSED,
    5: callStatusEnum.NOT_AVAILABLE,
    6: callStatusEnum.BUSY,
    7: callStatusEnum.NOT_EXISTS,
    8: callStatusEnum.BLOCKED
};

function getCallStatusByForm(form) {
    if (toBool(form.available)) {
        return CALL_STATUSES.COMPLETED;
    } else {
        return callReasonToStatus[Number(form.reason)];
    }
}

function createCallsForm(callPayload) {
    return callPayload.map(form => ({
        user_id: currentUserId.value,
        contact_id: form.contact_id,
        type: callTypeEnum.OUTGOING,
        status: getCallStatusByForm(form),
        phone_id: form.phone_id
    }));

    // TODO: Description для звонка внедрить можно
}

function createSurveyPayload() {
    const { payload: callsPayload, questionAnswers: callsQuestionAnswers } =
        createSurveyCallsPayload();

    let targetContact = callsPayload.find(contact => {
        return (
            isNotNullish(contact.available) &&
            toBool(contact.available) &&
            Number(contact.reason) === 1
        );
    });

    if (isNullish(targetContact)) {
        targetContact = Object.values(form.value.calls).find(contact => {
            return Object.values(contact.emails ?? {}).some(email => email.available);
        });
    }

    const { questionAnswers: objectsQuestionAnswers } = createSurveyObjectsPayload();
    const { questionAnswers: requestQuestionAnswers } = createSurveyRequestsPayload();
    const { questionAnswers: otherQuestionAnswers } = createSurveyQuestionsPayload();

    return {
        survey: {
            user_id: currentUserId.value,
            contact_id: targetContact?.contact_id,
            chat_member_id: props.chatMemberId,
            calls: createCallsForm(callsPayload),
            question_answers: [
                ...objectsQuestionAnswers,
                ...requestQuestionAnswers,
                ...otherQuestionAnswers.map(element => ({
                    value: element.value,
                    question_answer_id: element.question_answer_id,
                    file: element.file
                })),
                ...callsQuestionAnswers
            ],
            type: 'advanced',
            comment: form.value.comment
        },
        contact: targetContact,
        calls: callsPayload
    };
}

function generateTaskPayload(title, additional = {}) {
    return {
        start: dayjs().toDate(),
        end: dayjs().add(7, 'day').toDate(),
        user_id: store.getters.moderator?.id,
        title,
        ...additional
    };
}

function contactMustBeDeleted(contact) {
    return toBool(contact.delete);
}

function contactMustBeMoved(contact) {
    return Number(contact.reason) === 3;
}

function createRelation(type, id) {
    return {
        entity_type: type,
        entity_id: id
    };
}

// TODO: Надо придумать, как отправлять задачи

async function createPotentialTasks(calls, surveyId = null) {
    const relations = [createRelation('company', props.company.id)];

    if (surveyId) {
        relations.push(createRelation('survey', surveyId));
    }

    const payloads = calls.reduce((acc, element) => {
        if (contactMustBeDeleted(element)) {
            acc.push({
                contactId: element.contact_id,
                payload: generateTaskPayload(
                    `Архивировать контакт ${element.full_name} (комп. ${getCompanyShortName(props.company)})`,
                    {
                        message: element.description,
                        relations: [...relations, createRelation('contact', element.contact_id)],
                        type: 'contact_handling'
                    }
                )
            });
        } else if (contactMustBeMoved(element)) {
            acc.push({
                contactId: element.contact_id,
                payload: generateTaskPayload(
                    `Перенести контакт ${element.full_name} (комп. ${getCompanyShortName(props.company)})`,
                    {
                        message: element.description,
                        relations: [...relations, createRelation('contact', element.contact_id)],
                        type: 'contact_handling'
                    }
                )
            });
        }

        return acc;
    }, []);

    if (payloads.length > 0) {
        await Promise.allSettled(payloads.map(element => api.task.create(element.payload)));
    }
}

const isCreating = ref(false);

const bus = useEventBus('survey');

async function submit() {
    if (!formIsValid.value) return;

    const isValid = await validate();
    if (!isValid) return;

    if (isNotNullish(props.survey)) {
        await updateSurvey();
        return;
    }

    const { survey: surveyPayload, calls } = createSurveyPayload();

    try {
        isCreating.value = true;

        await api.survey.updateWithAnswers(props.draft.id, surveyPayload);
        await api.survey.complete(props.draft.id);
    } catch (error) {
        notify.info('Произошла ошибка при сохранении опроса, попробуйте позже..');

        captureException(error, {
            user_id: currentUserId.value,
            company_id: props.company.id
        });

        isCreating.value = false;

        return;
    }

    try {
        await createPotentialTasks(calls, props.draft.id);
    } catch (error) {
        notify.info('Не удалось создать задачи по контактам, создайте задачи вручную..');
        isCreating.value = false;

        captureException(error, {
            survey_id: props.draft.id,
            user_id: currentUserId.value,
            company_id: props.company.id
        });

        return;
    }

    notify.success('Опрос успешно завершен!', 'Опрос клиента');
    isCreating.value = false;

    emit('completed');
    bus.emit('completed', { companyId: props.company.id });
}

const isCancelling = ref(false);

function cancelSurvey() {
    isCancelling.value = true;
    summaryModalIsVisible.value = true;
}

async function cancel() {
    isCreating.value = true;

    const { survey: surveyPayload, calls } = createSurveyPayload();

    let surveyId = props.draft?.id;

    if (isNullish(props.draft)) {
        const response = await createDraft();
        surveyId = response.id;
    }

    await api.survey.updateWithAnswers(surveyId, surveyPayload);
    await api.survey.cancel(surveyId);

    try {
        await createPotentialTasks(calls, surveyId);
    } catch (error) {
        notify.info('Не удалось создать задачи по контактам, создайте задачи вручную..');
        isCreating.value = false;

        captureException(error, {
            survey_id: surveyId,
            user_id: currentUserId.value,
            company_id: props.company.id
        });

        return;
    }

    notify.success('Опрос успешно завершен!', 'Работа с опросом');
    isCreating.value = false;
    emit('canceled', { calls });
    bus.emit('canceled', { companyId: props.company.id });
}

function completeOrCancel() {
    if (isCancelling.value) cancel();
    else submit();
}

const { confirm } = useConfirm();

async function delaySurvey() {
    const confirmed = await confirm({
        title: 'Отложить опрос',
        message:
            'Вы уверены, что хотите отложить опрос? Все ответы будут сохранены для заполнения позже.'
    });

    if (!confirmed) return;

    isCreating.value = true;

    let surveyId = props.draft?.id;

    if (isNullish(props.draft)) {
        const response = await createDraft();
        surveyId = response.id;
    }

    const { survey: surveyPayload, calls } = createSurveyPayload();

    await api.survey.updateWithAnswers(surveyId, surveyPayload);
    await api.survey.delay(surveyId);

    try {
        await createPotentialTasks(calls, surveyId);
    } catch (error) {
        notify.info('Не удалось создать задачи по контактам, создайте задачи вручную..');
        isCreating.value = false;

        captureException(error, {
            survey_id: surveyId,
            user_id: currentUserId.value,
            company_id: props.company.id
        });

        return;
    }

    notify.success('Опрос отложен', 'Работа с опросом');
    isCreating.value = false;
    emit('delayed');
    bus.emit('delayed', { companyId: props.company.id, surveyId });
}

// objects

const objects = ref([]);
const requests = ref([]);

const isLoading = ref(false);

async function fetchInitialData() {
    isLoading.value = true;

    await Promise.allSettled([
        fetchObjects(),
        fetchRelatedObjects(),
        fetchRequests(),
        fetchQuestions()
    ]);

    isLoading.value = false;
}

const objectsIsLoading = ref(false);
const relatedObjectsIsLoading = ref(false);
const requestsIsLoading = ref(false);

async function fetchObjects() {
    objectsIsLoading.value = true;

    const response = await api.object.list({
        company_id: props.company.id,
        'per-page': 0,
        expand: 'commercialOffers.blocks,offerMix.offer'
    });

    objects.value.push(...response.data);

    objectsIsLoading.value = false;
}

async function fetchRelatedObjects() {
    relatedObjectsIsLoading.value = true;

    const response = await api.object.list({
        offer_company_id: props.company.id,
        exclude_company_id: props.company.id,
        'per-page': 0,
        expand: 'commercialOffers.blocks,offerMix.offer'
    });

    objects.value.push(...response.data);

    relatedObjectsIsLoading.value = false;
}

async function fetchRequests() {
    requestsIsLoading.value = true;

    requests.value = await api.request.byCompanyId(props.company.id);

    requestsIsLoading.value = false;
}

function onCreateRequest(request) {
    requests.value.unshift(request);
}

onBeforeMount(fetchInitialData);

const notify = useNotify();

function questionsToForm(questions) {
    const callsStepQuestion = questions.find(question => question.group === 'calls-step');
    if (callsStepQuestion) {
        form.value.calls = callsStepQuestion.answers.custom[0].surveyQuestionAnswer.value ?? {};
    }

    const offersStepQuestion = questions.find(question => question.group === 'objects-step');

    if (offersStepQuestion) {
        const currentOffersAnswer = getQuestionAnswerByKind(
            offersStepQuestion,
            'current-offers-step'
        );
        if (currentOffersAnswer) {
            form.value.objects.current = currentOffersAnswer.surveyQuestionAnswer.value ?? {};
        }

        const createdOffersAnswer = getQuestionAnswerByKind(
            offersStepQuestion,
            'created-offers-step'
        );
        if (createdOffersAnswer) {
            form.value.objects.created = createdOffersAnswer.surveyQuestionAnswer.value;
        }
    }

    const requestsStepQuestion = questions.find(question => question.group === 'requests-step');
    if (requestsStepQuestion) {
        const currentRequestsAnswer = getQuestionAnswerByKind(
            requestsStepQuestion,
            'current-requests-step'
        );
        if (currentRequestsAnswer) {
            form.value.requests.current = currentRequestsAnswer.surveyQuestionAnswer.value ?? {};
        }

        const createdRequestsAnswer = getQuestionAnswerByKind(
            requestsStepQuestion,
            'created-requests-step'
        );
        if (createdRequestsAnswer) {
            form.value.requests.created = createdRequestsAnswer.surveyQuestionAnswer.value ?? [];
        }
    }

    form.value.other = questions.filter(question => question.group === 'other-step');
}

function draftToForm() {
    if (props.draft.type === 'advanced') {
        const questions = props.draft.questions;
        questionsToForm(questions);
        form.value.comment = props.draft.comment;
    } else {
        notify.warning(
            'Данные в черновике устарели. Пожалуйста, создайте новый черновик.',
            'Загрузка черновика'
        );

        deleteDraftDangerously();
    }
}

function surveyToForm() {
    const questions = props.survey.questions;
    questionsToForm(questions);
    form.value.comment = props.survey.comment;
}

if (isNotNullish(props.draft)) {
    draftToForm();
}

if (isNotNullish(props.survey)) {
    surveyToForm();
}

async function deleteDraftDangerously() {
    await api.survey.delete(props.draft.id);
    emit('draft-expired');
}

// questions

const questionsIsLoading = ref(false);

const store = useStore();

const questions = computed(() => store.state.Quizz.questions);
const otherQuestions = computed(() =>
    store.state.Quizz.questions.filter(question => question.group === 'other-step')
);

async function fetchQuestions() {
    if (questions.value.length) return;

    questionsIsLoading.value = true;

    await store.dispatch('fetchQuestions');

    questionsIsLoading.value = false;
}

// complete

const summaryModalIsVisible = ref(false);

watch(summaryModalIsVisible, value => {
    if (value) {
        form.value.other = questionsStep.value?.getForm() ?? [];
    }
});

function completeSurvey() {
    summaryModalIsVisible.value = true;
}

// tour

const createTourStepElement = createTourStepElementGenerator('survey-form');

const { addStep } = useTourStep({
    key: 7,
    element: createTourStepElement('stepper-contact-question'),
    popover: {
        title: 'Результат звонка',
        description:
            'Укажите, удалось ли связаться с контактом. В случае неудачи укажите подробности.',
        side: 'left',
        align: 'center'
    },
    onDeselected: () => {
        step.value = 1;
    }
});

addStep({
    key: 10,
    element: createTourStepElement('stepper-body'),
    popover: {
        title: 'Запросы клиента',
        description:
            'На данном шаге необходимо указать актуальные запросов клиента или добавить новые, если такие существуют.',
        side: 'top',
        align: 'center'
    },
    onHighlightStarted: () => {
        step.value = 2;
    }
});

addStep({
    key: 13,
    element: createTourStepElement('stepper-body'),
    popover: {
        title: 'Дополнительные вопросы',
        description:
            'Дополнительные вопросы не связаны с текущими предложениями или запросами клиента и относятся конкретно к планам компании. Вы можете просто пропустить их, если не уверены, что контакт сможет дать ответ.',
        side: 'top',
        align: 'center'
    },
    onHighlightStarted: () => {
        step.value = 3;
    }
});

addStep({
    key: 16,
    popover: {
        title: 'Хорошего дня!',
        description:
            'При возникновении ошибок или вопросов, пожалуйста, сообщайте и обращайтесь в WhatsApp CRM-системы.',
        side: 'over',
        align: 'center'
    },
    onHighlightStarted: () => {
        step.value = 0;
    }
});
</script>
