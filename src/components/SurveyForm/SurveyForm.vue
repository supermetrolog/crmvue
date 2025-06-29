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
    >
        <template #header>
            <template v-if="isEditMode">
                <span>Редактирование</span>
                <span>|</span>
            </template>
            <span>{{ companyName }}</span>
            <span class="text-grey fs-3">
                <span class="mr-1">|</span>
                <span v-if="targetSurvey"
                    >Опрос #{{ targetSurvey.id }} от {{ targetSurveyDate }}</span
                >
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
                :company
                :last-surveys
                :survey="surveyDraft ?? survey"
                :surveys-count
                class="survey-form__header"
            />
        </template>
        <template #default="{ minimized }">
            <div class="survey-form__wrapper position-relative">
                <Spinner
                    v-if="isLoading || initialDataIsLoading"
                    class="absolute-center"
                    label="Загрузка компании.."
                />
                <SurveyFormStepper
                    v-else-if="canBeCreated || isEditMode"
                    ref="stepper"
                    @canceled="$emit('close')"
                    @completed="$emit('close')"
                    @draft-expired="surveyDraft = null"
                    @draft-deleted="$emit('close')"
                    @draft-created="surveyDraft = $event"
                    @draft-updated="onUpdateDraft"
                    @survey-updated="onUpdateSurvey"
                    @contact-created="onContactCreated"
                    @contact-updated="onContactUpdated"
                    :chat-member-id
                    :company
                    :contacts
                    :draft="surveyDraft"
                    :survey
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
import { computed, reactive, ref, shallowRef, toRef, useTemplateRef } from 'vue';
import { useFormData } from '@/utils/use/useFormData.js';
import SurveyFormHeader from '@/components/SurveyForm/SurveyFormHeader.vue';
import api from '@/api/api.js';
import Spinner from '@/components/common/Spinner.vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.ts';
import SurveyFormStepper from '@/components/SurveyForm/SurveyFormStepper.vue';
import { useAsync } from '@/composables/useAsync.js';
import { isNullish } from '@/utils/helpers/common/isNullish.ts';
import { getCompanyName, getCompanyShortName } from '@/utils/formatters/models/company.js';
import UiMinimizeModal from '@/components/common/UI/UiMinimizeModal.vue';
import { contactOptions } from '@/const/options/contact.options.js';
import { isPassiveContact, isPersonalContact } from '@/utils/helpers/models/contact.js';
import { useSurveyEditing } from '@/components/Survey/useSurveyEditing.js';
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
import { toDateFormat } from '@/utils/formatters/date.js';
import { SurveyView } from '@/types/survey';
import { useEventBus } from '@vueuse/core';

const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'minimized', handler: () => void): void;
}>();

interface Props {
    survey?: SurveyView;
    initialStep?: number;
    companyId?: number;
}

const props = defineProps<Props>();

const { isEditMode } = useFormData(reactive({}), props.survey);

const title = computed(() => {
    if (isEditMode.value && isNotNullish(company.value)) {
        return `Редактирование опроса | ${getCompanyName(company.value)} | Опрос #${props.survey?.id}`;
    }

    if (isNotNullish(company.value)) {
        if (isNotNullish(surveyDraft.value)) {
            return `Опрос #${surveyDraft.value.id} | ${getCompanyName(company.value)}`;
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
    company.value = await api.companies.getCompany(company.value.id);
}

function onUpdateLogo(logo) {
    company.value.logo = logo;
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

const { isLoading: surveyDraftIsSearching, execute: searchSurveyDraft } = useAsync(
    api.survey.findDraftByChatMemberId,
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

    fetchCompany();
    fetchContacts();
    await fetchChatMember();
    fetchLastSurveys();

    if (!isEditMode.value) {
        await searchSurveyDraft();
    }

    initialDataIsLoading.value = false;
}

// close

const stepper = useTemplateRef('stepper');

function close() {
    if (surveyDraft.value) {
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

async function fetchContacts() {
    contactsIsLoading.value = true;

    try {
        const response = await api.contacts.getByCompany(props.companyId);

        contacts.value = response
            .filter(
                contact =>
                    contact.status === contactOptions.statusStatement.ACTIVE &&
                    isPersonalContact(contact)
            )
            .sort((first, second) => second.isMain - first.isMain);

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

const { remainingTimeInMinutes } = useSurveyEditing(
    toRef(() => lastSurveys.value?.[0]),
    { adminCanEdit: false }
);

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

    return remainingTimeInMinutes.value <= 0;
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
        minimizeModal.value.minimize();
    }
}

function expand() {
    if (minimizeModal.value) {
        minimizeModal.value.expand();
    }
}

function onMinimized() {
    emit('minimized', expand);

    if (isNotNullish(props.survey)) return;

    saveDraft();
}
</script>
