<template>
    <UiMinimizeModal
        ref="minimizeModal"
        @close="close"
        @minimized="onMinimized"
        :can-be-closed="!isLoading"
        :can-be-minimized="!survey"
        :close-on-outside-click="false"
        :minimized-title="title"
        :width="1800"
        class="survey-form"
        custom-close
        show
        :container-attrs="{
            'data-tour-id': 'survey-form:container'
        }"
    >
        <template #header>
            <template v-if="isEditMode">
                <span>Редактирование</span>
                <span>|</span>
            </template>
            <span>{{ companyName }}</span>
            <span class="text-grey fs-3">
                <span class="mr-1">|</span>
                <span v-if="targetSurvey">
                    Опрос #{{ targetSurvey.id }} от {{ targetSurveyDate }}
                </span>
                <span v-else>Новый опрос</span>
            </span>
        </template>
        <template #before-body>
            <SurveyFormHeader
                v-if="!isLoading && company"
                @to-chat="minimize"
                @update-logo="onUpdateLogo"
                @update-company="onUpdateCompany"
                @create-task="createCompanyTask"
                @call-scheduled="onCompanyCallScheduled"
                @show-tour="runTour"
                :company
                :last-surveys
                :survey="surveyDraft ?? survey"
                :surveys-count
                class="survey-form__header"
            />
            <SurveyFormWarningPending
                v-if="isDelayedSurvey"
                @continue="continueSurvey"
                :draft="surveyDraft"
            />
        </template>
        <template #default="{ minimized }">
            <div class="survey-form__wrapper position-relative">
                <Spinner
                    v-if="isLoading || initialDataIsLoading"
                    class="absolute-center"
                    label="Загрузка компании.."
                />
                <SurveyFormCompanySuggest
                    v-else-if="companySuggestIsVisible"
                    @create-task="createSuggestCompanyTask"
                    @closed="$emit('close')"
                    :company
                />
                <SurveyFormStepper
                    v-else-if="canBeCreated || isEditMode"
                    ref="stepper"
                    @canceled="onCanceled"
                    @delayed="$emit('close')"
                    @completed="$emit('close')"
                    @draft-expired="surveyDraft = null"
                    @draft-deleted="$emit('close')"
                    @draft-created="surveyDraft = $event"
                    @draft-updated="onUpdateDraft"
                    @survey-updated="onUpdateSurvey"
                    @contact-created="onContactCreated"
                    @contact-updated="onContactUpdated"
                    @add-contact="suggestCreateContact"
                    :chat-member-id
                    :company
                    :contacts
                    :passive-contacts
                    :draft="surveyDraft"
                    :survey
                    :disabled="isDelayedSurvey"
                    :options
                />
                <MessengerQuizFormWarningNoContacts
                    v-else-if="contacts.length === 0"
                    @enabled="fetchContacts"
                    @suggest-create-contact="suggestCreateContact"
                    :passive-contacts="passiveContacts"
                />
                <MessengerQuizFormWarningAlreadyCreated
                    v-else-if="lastSurveys.length"
                    @show="showLastSurvey"
                    @edit="$emit('close')"
                    :last-survey="lastSurveys[0]"
                />
                <teleport to="body">
                    <MessengerQuizContactTaskSuggestModal
                        v-model:visible="taskSuggestionIsVisible"
                        @create-task="confirmTaskSuggestion"
                        @create-contact="createContact"
                    />
                    <FormCompanyContact
                        v-if="contactFormIsVisible"
                        @close="closeContactForm"
                        @created="onContactCreated"
                        :company_id="company?.id"
                    />
                    <UiModal
                        v-model:visible="closeModalIsVisible"
                        @close="closeModalIsVisible = false"
                        :close-on-press-esc="!draftIsSaving && !isDeleting && !minimized"
                        :close-on-outside-click="!draftIsSaving && !isDeleting && !minimized"
                        :width="550"
                        custom-close
                        class="confirm"
                        title="Подтверждение действия"
                        hide-header
                        :container-attrs="{
                            'data-tour-id': 'survey-form:stepper-close'
                        }"
                    >
                        <div class="confirm__content">
                            <div class="confirm__description">
                                <p class="confirm__title">Сохранить опрос?</p>
                                <p class="confirm__message">
                                    Сохранить заполненные данные из опроса для продолжения позже?
                                </p>
                            </div>
                        </div>
                        <template #actions>
                            <UiButton
                                @click="saveDraftAndClose"
                                color="success"
                                icon="fa-solid fa-check"
                                bolder
                                :disabled="isDeleting"
                                :loading="draftIsSaving"
                            >
                                Сохранить
                            </UiButton>
                            <UiButton
                                @click="deleteDraftAndClose"
                                color="danger"
                                icon="fa-solid fa-trash"
                                bolder
                                :loading="isDeleting"
                                :disabled="draftIsSaving"
                            >
                                Не сохранять
                            </UiButton>
                        </template>
                    </UiModal>
                </teleport>
            </div>
        </template>
    </UiMinimizeModal>
</template>
<script setup lang="ts">
import { computed, reactive, ref, shallowRef, useTemplateRef, watch } from 'vue';
import { useFormData } from '@/utils/use/useFormData.js';
import SurveyFormHeader from '@/components/SurveyForm/SurveyFormHeader.vue';
import api from '@/api/api.js';
import Spinner from '@/components/common/Spinner.vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish';
import SurveyFormStepper from '@/components/SurveyForm/SurveyFormStepper.vue';
import { useAsync } from '@/composables/useAsync.js';
import { isNullish } from '@/utils/helpers/common/isNullish';
import { getCompanyName, getCompanyShortName } from '@/utils/formatters/models/company.js';
import UiMinimizeModal from '@/components/common/UI/UiMinimizeModal.vue';
import { contactOptions } from '@/const/options/contact.options.js';
import { isPassiveContact, isPersonalContact } from '@/utils/helpers/models/contact.js';
import { useAsyncPopup } from '@/composables/useAsyncPopup.js';
import { TASK_FORM_STEPS, useTaskManager } from '@/composables/useTaskManager.js';
import { messenger } from '@/const/messenger.js';
import { useNotify } from '@/utils/use/useNotify.js';
import MessengerQuizContactTaskSuggestModal from '@/components/MessengerQuiz/MessengerQuizContactTaskSuggestModal.vue';
import FormCompanyContact from '@/components/Forms/Company/FormCompanyContact.vue';
import MessengerQuizFormWarningNoContacts from '@/components/Messenger/Quiz/Form/Warning/MessengerQuizFormWarningNoContacts.vue';
import MessengerQuizFormWarningAlreadyCreated from '@/components/Messenger/Quiz/Form/Warning/MessengerQuizFormWarningAlreadyCreated.vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import UiButton from '@/components/common/UI/UiButton.vue';
import { dayjsFromServer, toDateFormat } from '@/utils/formatters/date';
import { SurveyView } from '@/types/survey';
import { useEventBus, useTimeoutFn } from '@vueuse/core';
import SurveyFormWarningPending from '@/components/SurveyForm/SurveyFormWarningPending.vue';
import { createTourStepElementGenerator } from '@/composables/useTour/useTourStep';
import { useTour } from '@/composables/useTour/useTour';
import dayjs from 'dayjs';
import SurveyFormCompanySuggest from '@/components/SurveyForm/SurveyFormCompanySuggest.vue';
import { SurveyFormOptions } from '@/composables/useSurveyForm';
import { Contact } from '@/types/contact/contact';

const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'minimized', handler: () => void): void;
}>();

interface Props {
    survey?: SurveyView;
    initialStep?: number;
    companyId?: number;
    options?: SurveyFormOptions;
}

const props = defineProps<Props>();

const { isEditMode } = useFormData(reactive({}), props.survey);

const title = computed(() => {
    if (isEditMode.value && isNotNullish(company.value)) {
        return `Редактирование опроса | ${getCompanyName(company.value)} | Опрос #${props.survey?.id}`;
    }

    if (isNotNullish(company.value)) {
        if (isNotNullish(surveyDraft.value)) {
            return `Опрос #${surveyDraft.value!.id} | ${getCompanyName(company.value)}`;
        }

        return `Новый опрос | ${getCompanyName(company.value)}`;
    }

    return 'Опрос клиента';
});

const companyName = computed(() => {
    if (isNotNullish(company.value)) {
        return getCompanyName(company.value);
    }

    return null;
});

// company

const company = ref(null);
const companyIsLoading = ref(false);

async function fetchCompany() {
    companyIsLoading.value = true;

    try {
        company.value = await api.companies.getCompany(props.companyId);
    } finally {
        companyIsLoading.value = false;
    }
}

async function onUpdateCompany() {
    company.value = await api.companies.getCompany(company.value!.id);
}

function onUpdateLogo(logo) {
    company.value!.logo = logo;
}

// chat member

const {
    isLoading: chatMemberIsLoading,
    execute: fetchChatMember,
    data: chatMemberId
} = useAsync(api.messenger.getChatMemberIdByQuery, {
    payload: () => [
        {
            model_type: 'company',
            model_id: props.companyId
        }
    ]
});

// surveys

const surveysIsLoading = ref(false);
const lastSurveys = shallowRef([]);
const surveysCount = ref(0);

async function fetchLastSurveys() {
    surveysIsLoading.value = true;

    try {
        const response = await api.survey.list({
            chat_member_id: chatMemberId.value,
            sort: '-completed_at',
            'per-page': 5,
            statuses: ['completed', 'canceled'],
            type: 'advanced'
        });

        lastSurveys.value = response.data;
        surveysCount.value = response.pagination.totalCount;
    } finally {
        surveysIsLoading.value = false;
    }
}

// draft

const surveyDraft = ref(null);

const { isLoading: surveyDraftIsSearching, execute: searchPendingSurvey } = useAsync(
    api.survey.findPendingByChatMemberId,
    {
        onFetchResponse({ response }) {
            surveyDraft.value = response;
        },
        payload: () => [chatMemberId.value]
    }
);

function onUpdateDraft(draft) {
    surveyDraft.value.updated_at = draft.updated_at;
}

function onUpdateSurvey() {
    emit('close');
}

const initialDataIsLoading = ref(false);

async function fetchInitialData() {
    initialDataIsLoading.value = true;

    const promises = [fetchCompany(), fetchContacts()];

    await fetchChatMember();

    promises.push(fetchLastSurveys());

    if (!isEditMode.value) {
        await searchPendingSurvey();
    }

    await Promise.allSettled(promises);

    initialDataIsLoading.value = false;
}

// close

const stepper = useTemplateRef('stepper');

function close() {
    if (surveyDraft.value && !isDelayedSurvey.value) {
        showCloseModal();
    } else {
        emit('close');
    }
}

const closeModalIsVisible = ref(false);

async function showCloseModal() {
    closeModalIsVisible.value = true;
}

const draftIsSaving = ref(false);

async function saveDraft() {
    if (isNullish(stepper.value)) return;

    draftIsSaving.value = true;

    if (isNotNullish(surveyDraft.value)) {
        await stepper.value.updateDraft();
    } else {
        await stepper.value.createDraft();
    }

    draftIsSaving.value = false;
}

async function saveDraftAndClose() {
    await saveDraft();
    emit('close');
}

const bus = useEventBus('survey');

const isDeleting = ref(false);

async function deleteDraftAndClose() {
    if (!surveyDraft.value) {
        emit('close');
        return;
    }

    isDeleting.value = true;

    await api.survey.delete(surveyDraft.value.id);

    isDeleting.value = false;

    bus.emit('deleted', { companyId: props.companyId ?? company.value?.id });
    emit('close');
}

// contacts

const contactsIsLoading = ref(false);
const contacts = ref([]);
const passiveContacts = ref([]);

function getContactCallsCount(contact: Contact) {
    return contact.calls?.length ?? 0;
}

async function fetchContacts() {
    contactsIsLoading.value = true;

    try {
        const response = await api.contacts.getByCompany(props.companyId!);

        contacts.value = response
            .filter(
                contact =>
                    contact.status === contactOptions.statusStatement.ACTIVE &&
                    isPersonalContact(contact)
            )
            .sort((first, second) => {
                const offerContactId = props.options?.offer_contact_id;

                console.log(offerContactId);

                if (offerContactId) {
                    if (first.id === offerContactId && second.id !== offerContactId) return -1;
                    if (second.id === offerContactId && first.id !== offerContactId) return 1;
                }

                const firstCallsCount = getContactCallsCount(first);
                const secondCallsCount = getContactCallsCount(second);

                if (firstCallsCount !== secondCallsCount) {
                    return secondCallsCount - firstCallsCount;
                }

                return first.id - second.id;
            });

        passiveContacts.value = response.filter(
            contact => isPassiveContact(contact) && isPersonalContact(contact)
        );
    } finally {
        contactsIsLoading.value = false;
    }
}

function onContactCreated(contact) {
    contacts.value.unshift(contact);
}

async function onContactUpdated(contact) {
    const contactIndex = contacts.value.findIndex(element => element.id === contact.id);

    if (contactIndex !== -1) {
        if (contact.status === contactOptions.statusStatement.PASSIVE)
            contacts.value.splice(contactIndex, 1);
        else Object.assign(contacts.value[contactIndex], contact);
    }
}

const taskSuggestionIsVisible = ref(false);

const { createTaskWithTemplate } = useTaskManager();
const notify = useNotify();

async function createContactTask() {
    const taskPayload = await createTaskWithTemplate({
        title: `Добавить новый контакт в компании ${getCompanyShortName(company.value)}`,
        step: TASK_FORM_STEPS.MESSAGE,
        relations: getTaskRelations(),
        type: 'contact_handling'
    });

    if (!taskPayload) return;

    const messagePayload = {
        message: `Добавлен новый контакт компании!`
    };

    const currentCompanyDialogId = await api.messenger.getChatMemberIdByQuery({
        model_type: messenger.dialogTypes.COMPANY,
        model_id: company.value.id
    });

    const createdMessage = await api.messenger.sendMessageWithTask(
        currentCompanyDialogId,
        messagePayload,
        taskPayload
    );

    if (createdMessage) {
        notify.success('Сообщение и задача успешно созданы');
    } else {
        notify.error('Произошла ошибка. Попробуйте еще раз..');
    }
}

function getTaskRelations() {
    const relations = [{ entity_type: 'company', entity_id: company.value?.id ?? props.companyId }];

    if (props.survey || surveyDraft.value) {
        relations.push({
            entity_type: 'survey',
            entity_id: props.survey?.id ?? surveyDraft.value?.id
        });
    }

    return relations;
}

const targetSurvey = computed(() => props.survey ?? surveyDraft.value);

const targetSurveyDate = computed(() => {
    if (!targetSurvey.value) return null;
    return toDateFormat(
        targetSurvey.value.completed_at ?? targetSurvey.value.created_at,
        'D.MM.YY'
    );
});

function tryAddSurveyTask(task) {
    if (targetSurvey.value) {
        if (targetSurvey.value.tasks) {
            targetSurvey.value.tasks.push(task);
        } else {
            targetSurvey.value.tasks = [task];
        }
    }
}

async function createCompanyTask() {
    const taskPayload = await createTaskWithTemplate({
        title: `${getCompanyShortName(company.value)}, `,
        relations: getTaskRelations()
    });

    if (!taskPayload) return;

    const task = await api.task.create(taskPayload);
    notify.success('Задача успешно создана');

    tryAddSurveyTask(task);
}

function suggestCreateContact() {
    taskSuggestionIsVisible.value = true;
}

function closeTaskSuggestion() {
    taskSuggestionIsVisible.value = false;
}

const contactFormIsVisible = ref(false);

function createContact() {
    closeTaskSuggestion();
    contactFormIsVisible.value = true;
}

function confirmTaskSuggestion() {
    closeTaskSuggestion();
    createContactTask();
}

function closeContactForm() {
    contactFormIsVisible.value = false;
}

function onCompanyCallScheduled(date) {
    company.value.scheduled = date;
}

// surveys

const canBeCreated = computed(() => {
    if (contacts.value.length === 0) {
        return false;
    }

    if (lastSurveys.value.length === 0) {
        return true;
    }

    const lastSurvey = lastSurveys.value[0];

    if (lastSurvey.status === 'canceled') {
        return true;
    }

    return (
        dayjs().diff(dayjsFromServer(lastSurvey.completed_at ?? lastSurvey.updated_at), 'minutes') >
        60 * 24
    );
});

const { show: showSurvey } = useAsyncPopup('surveyPreview');

function showLastSurvey() {
    showSurvey({ surveyId: lastSurveys.value[0].id });
    emit('close');
}

// initialization

const isLoading = computed(
    () =>
        companyIsLoading.value ||
        surveysIsLoading.value ||
        chatMemberIsLoading.value ||
        surveyDraftIsSearching.value ||
        contactsIsLoading.value
);

if (isNotNullish(props.companyId)) {
    fetchInitialData();
}

// minimize

const minimizeModal = useTemplateRef('minimizeModal');

function minimize() {
    if (minimizeModal.value) {
        minimizeModal.value?.minimize();
    }
}

function expand() {
    if (minimizeModal.value) {
        minimizeModal.value?.expand();
    }
}

function onMinimized() {
    emit('minimized', expand);

    if (isNotNullish(props.survey)) return;

    saveDraft();
}

function continueSurvey() {
    surveyDraft.value.status = 'draft';
}

const isDelayedSurvey = computed(() => surveyDraft.value && surveyDraft.value.status === 'delayed');

// cancel

const companySuggestIsVisible = ref(false);

function onCanceled(payload) {
    const contactsInCallsCount = new Set(payload.calls.map(call => call.contact_id)).size;

    if (contactsInCallsCount === contacts.value.length) {
        companySuggestIsVisible.value = true;
    } else {
        emit('close');
    }
}

async function createSuggestCompanyTask(payload = {}) {
    const taskPayload = await createTaskWithTemplate({
        ...payload,
        relations: getTaskRelations()
    });

    if (!taskPayload) return;

    await api.task.create(taskPayload);
    notify.success('Задача успешно создана');

    companySuggestIsVisible.value = false;
    emit('close');
}

// tour

const createTourStepElement = createTourStepElementGenerator('survey-form');

watch(
    initialDataIsLoading,
    value => {
        if (!value && !isEditMode.value && canBeCreated.value) {
            softRunTour();
        }
    },
    { once: true }
);

const { softRun: softRunTour, run: runTour } = useTour('survey-form', {
    autorun: false,
    steps: [
        {
            key: 0,
            popover: {
                title: 'Опрос клиента',
                description:
                    'Добро пожаловать в важный компонент системы - опрос клиентов. Здесь можно заполнять актуальную информацию по клиенту, создавать быстрые задачи и ознакомиться со всеми предложениями/запросами клиента'
            }
        },
        {
            key: 1,
            element: createTourStepElement('header-company'),
            popover: {
                title: 'Информация о компании',
                description:
                    'В этой части опроса можно ознакомиться с основными характеристиками компании. Посмотреть описание, документы или старые опросы.',
                side: 'bottom',
                align: 'center'
            }
        },
        {
            key: 2,
            element: createTourStepElement('header-company-actions'),
            popover: {
                title: 'Управление компанией',
                description:
                    'Управление компанией, создание задач и перемещение в папки доступно в несколько кликов.',
                side: 'left',
                align: 'center'
            },
            onHighlighted(element) {
                element?.click();
            }
        },
        {
            key: 3,
            element: createTourStepElement('stepper-navigation'),
            popover: {
                title: 'Навигация по опросу',
                description:
                    'Опрос состоит из 4 шагов. Переходите по ним, чтобы заполнить информацию по предложения и запросам клиента.',
                side: 'bottom',
                align: 'center'
            }
        },
        {
            key: 4,
            element: createTourStepElement('stepper-helper'),
            popover: {
                title: 'Дополнительные вопросы',
                description:
                    'Эти дополнительные вопросы необходимо обсудить с клиентом в процессе разговора.',
                side: 'bottom',
                align: 'center'
            }
        },
        {
            key: 6,
            element: createTourStepElement('stepper-contact-info'),
            popover: {
                title: 'Информация о контакте',
                description:
                    'В этой части вы можете ознакомиться с предыдущими звонками контакту, с номером телефонов и почтой для связи.',
                side: 'right',
                align: 'center'
            }
        },
        {
            key: 14,
            element: createTourStepElement('stepper-actions'),
            popover: {
                title: 'Завершение опроса',
                description:
                    'После созвона с контактом вам станет доступна возможность завершить опрос. Вы сможете сохранить результаты или перенести опрос на несколько дней, если не удалось связаться с контактами.',
                side: 'top',
                align: 'center',
                onNextClick(element, step, opts) {
                    closeModalIsVisible.value = true;

                    useTimeoutFn(() => {
                        opts.driver.moveNext();
                    }, 200);
                }
            }
        },
        {
            key: 15,
            element: createTourStepElement('stepper-close'),
            popover: {
                title: 'Сохранение черновика',
                description:
                    'Вы можете сохранить текущий опрос в черновике или продолжить его заполнение, чтобы завершить его в будущем.',
                side: 'top',
                align: 'center'
            },
            onDeselected() {
                closeModalIsVisible.value = false;
            }
        }
    ]
});
</script>
