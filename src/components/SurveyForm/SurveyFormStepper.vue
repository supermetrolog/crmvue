<template>
    <Stepper
        v-model:step="step"
        @complete="submit"
        @update:step="onUpdateStep"
        :v="v$.form"
        :show-progress="false"
        :steps="steps"
        keep-alive
        class="survey-form__stepper"
        footer-class="survey-form__footer"
        :disabled="isCreating"
    >
        <template #body>
            <Loader v-if="isCreating || surveyIsUpdating" label="Сохранение опроса.." />
        </template>
        <template v-if="draft" #after-navigation>
            <SurveyFormStepperDraft class="ml-auto" :draft :disabled="!windowIsFocused" />
            <UiButton
                @click="updateDraft"
                tooltip="Обновить черновик"
                color="light"
                :disabled="draftIsUpdating"
                small
                class="fs-2"
            >
                <i class="fa-solid fa-paper-plane" />
            </UiButton>
            <UiButton
                @click="deleteDraft"
                tooltip="Удалить черновик"
                color="light"
                :disabled="draftIsDeleting"
                small
                class="fs-2"
            >
                <i class="fa-solid fa-trash" />
            </UiButton>
        </template>
        <template #1>
            <SurveyFormCalls
                v-model="form.calls"
                @contact-created="$emit('contact-created', $event)"
                @contact-updated="$emit('contact-updated', $event)"
                :company
                :contacts
                :chat-member-id
            />
        </template>
        <template #2>
            <Spinner v-if="objectsIsLoading" class="absolute-center" label="Загрузка объектов.." />
            <SurveyFormObjects v-else v-model="form.objects" :company :objects />
        </template>
        <template #3>
            <Spinner v-if="requestsIsLoading" class="absolute-center" label="Загрузка запросов.." />
            <SurveyFormRequests v-else v-model="form.requests" :company :requests />
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
            />
        </template>
        <template #footer="{ complete }">
            <UiButton
                @click="complete"
                :disabled="!formIsValid"
                small
                color="success-light"
                icon="fa-solid fa-check"
            >
                Сохранить опрос
            </UiButton>
            <AnimationTransition :speed="0.5">
                <UiButton
                    v-if="canBeCancelled"
                    @click="cancelSurvey"
                    tooltip='Завершить опрос с отметкой "Не удалось дозвониться"'
                    small
                    color="danger-light"
                    icon="fa-solid fa-thumbs-down"
                >
                    Завершить опрос
                </UiButton>
            </AnimationTransition>
        </template>
    </Stepper>
</template>
<script setup>
import { computed, onBeforeMount, reactive, ref, shallowRef, useTemplateRef, watch } from 'vue';
import Stepper from '@/components/common/Stepper/Stepper.vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import { useIntervalFn } from '@vueuse/core';
import api from '@/api/api.js';
import { surveyConfig } from '@/configs/survey.config.js';
import { useAuth } from '@/composables/useAuth.js';
import { isNullish } from '@/utils/helpers/common/isNullish.js';
import UiButton from '@/components/common/UI/UiButton.vue';
import SurveyFormStepperDraft from '@/components/SurveyForm/SurveyFormStepperDraft.vue';
import { useAsync } from '@/composables/useAsync.js';
import { useSharedWindowFocus } from '@/composables/useSharedWindowFocus.js';
import SurveyFormObjects from '@/components/SurveyForm/SurveyFormObjects.vue';
import Spinner from '@/components/common/Spinner.vue';
import { useStore } from 'vuex';
import { useNotify } from '@/utils/use/useNotify.js';
import SurveyFormQuestions from '@/components/SurveyForm/SurveyFormQuestions.vue';
import SurveyFormRequests from '@/components/SurveyForm/SurveyFormRequests.vue';
import { helpers } from '@vuelidate/validators';
import SurveyFormCalls from '@/components/SurveyForm/SurveyFormCalls.vue';
import { useValidation } from '@/composables/useValidation.js';
import { callTypeEnum } from '@/const/enums/call.js';
import {
    CALL_STATUSES,
    CONTACT_CALL_REASONS
} from '@/components/MessengerQuiz/useMessengerQuiz.js';
import { useConfirm } from '@/composables/useConfirm.js';
import { messenger, messengerTemplates } from '@/const/messenger.js';
import { captureException } from '@sentry/vue';
import dayjs from 'dayjs';
import { isNotEmptyString } from '@/utils/helpers/string/isNotEmptyString.js';
import { capitalizeString } from '@/utils/helpers/string/capitalizeString.js';
import { taskOptions } from '@/const/options/task.options.js';
import { getCompanyShortName } from '@/utils/formatters/models/company.js';
import Loader from '@/components/common/Loader.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';

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
    'close',
    'contact-created',
    'contact-updated',
    'completed'
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
    }
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

async function saveDraft() {
    if (isNotNullish(props.draft)) {
        await updateDraft();
    } else {
        await createDraft();
    }
}

defineExpose({ createDraft, updateDraft, updateSurvey });

const { isLoading: draftIsDeleting, execute: deleteDraft } = useAsync(api.survey.delete, {
    payload: () => [props.draft.id],
    onFetchResponse() {
        emit('draft-deleted');
    },
    confirmation: true,
    confirmationContent: {
        title: 'Удалить черновик',
        message:
            'Вы уверены, что хотите безвозвратно удалить черновик? Весь прогресс заполнения будет утерян',
        okButton: 'Удалить',
        okIcon: 'fa-solid fa-trash'
    }
});

const { pause, resume } = useIntervalFn(updateDraft, surveyConfig.DRAFT_UPDATE_INTERVAL, {
    immediate: isNotNullish(props.draft)
});

watch(
    () => props.disabled,
    value => {
        if (isNullish(props.draft)) return;

        if (value) pause();
        else resume();
    }
);

const windowIsFocused = useSharedWindowFocus();

watch(windowIsFocused, value => {
    if (value) {
        resume();
    } else {
        pause();
    }
});

const draftShouldBeSaved = ref(false);

function onUpdateStep() {
    if (!isLoading.value && isNullish(props.survey)) draftShouldBeSaved.value = true;
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

const stepsIsDisabled = computed(() => {
    if (isLoading.value) return true;

    return !props.contacts.some(contact => {
        if (isNullish(form.value.calls[contact.id])) return false;

        const isAvailable = form.value.calls[contact.id].available;

        if (isNullish(isAvailable)) return false;

        return toBool(isAvailable) && Number(form.value.calls[contact.id].reason) === 1;
    });
});

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
            if (objectsIsLoading.value) {
                return 'Предложения (загрузка..)';
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

            return `Запросы (${requests.value.length})`;
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
    other: []
});

function requiredCallsValidationHandler(value) {
    const hasCompletedContact = props.contacts.some(contact => {
        if (isNullish(value[contact.id])) return false;

        const isAvailable = value[contact.id].available;

        if (isNullish(isAvailable)) return false;

        return toBool(isAvailable) && Number(value[contact.id].reason) === 1;
    });

    return hasCompletedContact;
}

function requiredObjectsValidationHandler(value) {
    if (objects.value.length === 0) return true;

    return Object.values(value.current).every(objectForm => {
        return isNotNullish(objectForm?.answer);
    });
}

function requiredRequestsValidationHandler(value) {
    if (requests.value.length === 0) return true;

    return Object.values(value.current).every(requestForm => {
        return isNotNullish(requestForm.answer) && Number(requestForm.answer) !== 0;
    });
}

const { v$, validate } = useValidation(
    {
        form: {
            calls: {
                required: helpers.withMessage(
                    'Свяжитесь с представителем компании!',
                    requiredCallsValidationHandler
                )
            },
            objects: {
                required: helpers.withMessage(
                    'Заполните информацию по всем предложениям клиента!',
                    requiredObjectsValidationHandler
                )
            },
            requests: {
                required: helpers.withMessage(
                    'Заполните информацию по всем запросам клиента!',
                    requiredRequestsValidationHandler
                )
            },
            other: {}
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

    const targetContact = callsPayload.find(contact => {
        return (
            isNotNullish(contact.available) &&
            toBool(contact.available) &&
            Number(contact.reason) === 1
        );
    });

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
        type: 'advanced'
    };
}

// submit

const formIsValid = computed(() => !v$.value.$invalid);

const canBeCancelled = computed(() => {
    if (formIsValid.value) return false;

    return (
        props.contacts.some(contact => {
            if (isNullish(form.value.calls[contact.id])) return false;

            const isAvailable = form.value.calls[contact.id].available;

            if (isNullish(isAvailable)) return false;

            return (
                (toBool(isAvailable) && Number(form.value.calls[contact.id].reason !== 1)) ||
                (!toBool(isAvailable) && isNotNullish(form.value.calls[contact.id].reason))
            );
        }) && stepsIsDisabled.value
    );
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

    return { payload: Object.values(form.value.calls), questionAnswers };
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

function getCallStatusByForm(form) {
    if (toBool(form.available)) {
        return CALL_STATUSES.COMPLETED;
    } else {
        if (Number(form.reason) === 5) return CALL_STATUSES.BLOCKED;
        return CALL_STATUSES.MISSED;
    }
}

function createCallsForm(callPayload) {
    return callPayload.map(form => ({
        user_id: currentUserId.value,
        contact_id: form.contact_id,
        type: callTypeEnum.OUTGOING,
        status: getCallStatusByForm(form),
        description: form.description
    }));
}

function createSurveyPayload() {
    const { payload: callsPayload, questionAnswers: callsQuestionAnswers } =
        createSurveyCallsPayload();

    const targetContact = callsPayload.find(contact => {
        return (
            isNotNullish(contact.available) &&
            toBool(contact.available) &&
            Number(contact.reason) === 1
        );
    });

    if (isNullish(targetContact)) {
        notify.info('Свяжитесь с представителем компании!', 'Создание опроса');
        throw new Error('No completed call in Survey');
    }

    const { questionAnswers: objectsQuestionAnswers } = createSurveyObjectsPayload();
    const { questionAnswers: requestQuestionAnswers } = createSurveyRequestsPayload();
    const { questionAnswers: otherQuestionAnswers } = createSurveyQuestionsPayload();

    return {
        survey: {
            user_id: currentUserId.value,
            contact_id: targetContact.contact_id,
            chat_member_id: props.chatMemberId,
            calls: createCallsForm(callsPayload.filter(form => isNotNullish(form.available))),
            question_answers: [
                ...objectsQuestionAnswers,
                ...requestQuestionAnswers,
                ...otherQuestionAnswers,
                ...callsQuestionAnswers
            ],
            type: 'advanced'
        },
        contact: targetContact,
        calls: callsPayload.filter(form => isNotNullish(form.available))
    };
}

async function findSurveyMessage(surveyId, toChatMemberId) {
    const { data: messages } = await api.messenger.getMessagesByQuery({
        to_chat_member_id: toChatMemberId,
        survey_id: surveyId
    });

    if (messages.length > 0) return messages[0];
    return null;
}

async function createRelatedSurveys(payload, contactId, parentSurvey) {
    const payloadWithAnswers = payload.filter(offer => Number(offer.answer) === 1);
    const payloadWithoutUpdates = payload.filter(offer => Number(offer.answer) === 2);

    const chatMembers = await api.messenger.getChats({
        object_ids: payload.map(element => element.object_id),
        model_type: messenger.dialogTypes.OBJECT,
        company_id: props.company.id
    });

    const chatMembersMap = chatMembers.data.reduce((acc, element) => {
        if (acc[element.model.object_id]) acc[element.model.object_id].push(element.id);
        else acc[element.model.object_id] = [element.id];

        return acc;
    }, {});

    const payloadWithAnswersForm = payloadWithAnswers.reduce((acc, element) => {
        if (chatMembersMap[element.object_id]) {
            acc.push(
                ...chatMembersMap[element.object_id].map(chatMemberId => ({
                    chat_member_id: chatMemberId,
                    answers: element.offers.map(form => ({
                        question_answer_id: form.question_answer_id,
                        value: form.value
                    }))
                }))
            );
        }

        return acc;
    }, []);

    const payloadWithoutUpdatesForm = payloadWithoutUpdates.reduce((acc, element) => {
        if (chatMembersMap[element.object_id]) {
            acc.push(...chatMembersMap[element.object_id]);
        }

        return acc;
    }, []);

    await Promise.allSettled(
        payloadWithAnswersForm.map(element =>
            api.survey.create({
                contact_id: contactId,
                user_id: currentUserId.value,
                chat_member_id: element.chat_member_id,
                question_answers: element.answers,
                related_survey_id: parentSurvey.id,
                call_ids: parentSurvey.calls.map(call => call.id)
            })
        )
    );

    await Promise.allSettled(
        payloadWithoutUpdatesForm.map(element =>
            api.survey.create({
                contact_id: contactId,
                user_id: currentUserId.value,
                chat_member_id: element.chat_member_id,
                related_survey_id: parentSurvey.id,
                call_ids: parentSurvey.calls.map(call => call.id)
            })
        )
    );
}

function generateTaskPayload(message, description = null, surveyId = null, userId = null) {
    return {
        start: dayjs().toDate(),
        end: dayjs().add(7, 'day').toDate(),
        user_id: userId ?? store.getters.moderator?.id,
        title: message,
        message:
            isNotNullish(description) && isNotEmptyString(description)
                ? capitalizeString(description)
                : null,
        status: taskOptions.statusTypes.NEW,
        observer_ids: [],
        tag_ids: [],
        survey_id: surveyId
    };
}

function contactMustBeDeleted(contact) {
    return Number(contact.reason) === CONTACT_CALL_REASONS.DELETE;
}

function contactMustBeMoved(contact) {
    return Number(contact.reason) === CONTACT_CALL_REASONS.MOVE;
}

async function createPotentialTasks(contacts, messageId, surveyId = null) {
    const payloads = contacts.reduce((acc, element) => {
        if (contactMustBeDeleted(element)) {
            acc.push({
                contactId: element.contact_id,
                payload: generateTaskPayload(
                    `Удалить контакт ${element.full_name} (компания ${getCompanyShortName(props.company)})`,
                    element.description,
                    surveyId
                )
            });
        } else if (contactMustBeMoved(element)) {
            acc.push({
                contactId: element.contact_id,
                payload: generateTaskPayload(
                    `Перенести контакт ${element.full_name} (компания ${getCompanyShortName(props.company)})`,
                    element.description,
                    surveyId
                )
            });
        }

        return acc;
    }, []);

    if (payloads.length > 0) {
        return await api.messenger.createTasks(
            messageId,
            payloads.map(element => element.payload)
        );
    }
}

const isCreating = ref(false);
const { confirm } = useConfirm();

async function submit() {
    if (!formIsValid.value) return;

    const isValid = await validate();
    if (!isValid) return;

    const confirmed = await confirm(
        'Сохранение опроса',
        'Вы закончили заполнение информации? Будут созданы задачи, звонки и опросы для заполненных предложений и запросов.'
    );
    if (!confirmed) return;

    if (isNotNullish(props.survey)) {
        await updateSurvey();
        return;
    }

    const { survey: surveyPayload, contact: targetContact, calls } = createSurveyPayload();

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

    // TODO: Нужно ли вообще создавать это?

    // if (objectsPayload.length) {
    //     try {
    //         await createRelatedSurveys(
    //             objectsPayload.current,
    //             targetContact.contact_id,
    //             createdSurvey
    //         );
    //     } catch (error) {
    //         captureException(error, {
    //             survey_id: createdSurvey.id,
    //             user_id: currentUserId.value,
    //             company_id: props.company.id
    //         });
    //     }
    //
    //     return;
    // }

    let surveyMessage;

    try {
        surveyMessage = await findSurveyMessage(props.draft.id, props.chatMemberId);
    } catch (error) {
        notify.info('Не удалось установить связь с чатом, создайте задачи по контактам вручную..');
        isCreating.value = false;

        captureException(error, {
            survey_id: props.draft.id,
            user_id: currentUserId.value,
            company_id: props.company.id
        });

        return;
    }

    try {
        await createPotentialTasks(calls, surveyMessage.id, props.draft.id);
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

    notify.success('Опрос успешно сохранен!', 'Опрос клиента');
    isCreating.value = false;

    emit('completed');
}

async function sendMessageAboutSurveyIsUnavailable(chatMemberId, contacts) {
    const messagePayload = {
        message: 'Не удалось дозвониться до контактов опросника',
        template: messengerTemplates.UNAVAILABLE_SURVEY,
        contact_ids: contacts.map(element => element.contact_id)
    };

    return await api.messenger.sendMessage(chatMemberId, messagePayload);
}

async function cancelSurvey() {
    const confirmed = await confirm(
        'Завершение опроса',
        'Вы закончили заполнение информации? Будут созданы задачи, звонки и опросы для заполненных предложений и запросов.'
    );
    if (!confirmed) return;

    const { payload: callsPayload, questionAnswers: callsQuestionAnswers } =
        createSurveyCallsPayload();

    const payload = {
        user_id: currentUserId.value,
        chat_member_id: props.chatMemberId,
        calls: createCallsForm(callsPayload.filter(form => isNotNullish(form.available))),
        question_answers: callsQuestionAnswers,
        type: 'advanced'
    };

    let surveyId = props.draft?.id;

    if (isNullish(props.draft)) {
        const response = await createDraft();
        surveyId = response.id;
    }

    await api.survey.updateWithAnswers(surveyId, payload);
    await api.survey.cancel(surveyId);

    const calls = callsPayload.filter(form => isNotNullish(form.available));

    let createdMessage;

    try {
        createdMessage = await sendMessageAboutSurveyIsUnavailable(props.chatMemberId, calls);
    } catch (error) {
        captureException(error, {
            survey_id: surveyId,
            user_id: currentUserId.value,
            company_id: props.company.id
        });

        return;
    }

    try {
        await createPotentialTasks(calls, createdMessage.id, surveyId);
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

    notify.success('Опрос успешно сохранен!');
}

// objects

const objects = shallowRef([]);
const requests = shallowRef([]);

const isLoading = ref(false);

async function fetchInitialData() {
    isLoading.value = true;

    await Promise.allSettled([fetchObjects(), fetchRequests(), fetchQuestions()]);

    isLoading.value = false;
}

const objectsIsLoading = ref(false);
const requestsIsLoading = ref(false);

async function fetchObjects() {
    objectsIsLoading.value = true;

    const response = await api.object.list({
        company_id: props.company.id,
        'per-page': 0,
        expand: 'commercialOffers.blocks,offerMix.offer'
    });

    objects.value = response.data;

    objectsIsLoading.value = false;
}

async function fetchRequests() {
    requestsIsLoading.value = true;

    const response = await api.request.search({ company_id: props.company.id, status: 1 });

    requests.value = response.data;

    requestsIsLoading.value = false;
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
</script>
