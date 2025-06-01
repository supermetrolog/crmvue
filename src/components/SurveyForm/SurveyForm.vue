<template>
    <UiMinimizeModal
        @close="close"
        @minimized="saveDraft"
        :title
        :minimized-title="title"
        :width="1800"
        :close-on-outside-click="false"
        :can-be-closed="!isLoading"
        custom-close
        show
        class="survey-form"
    >
        <template #before-body>
            <SurveyFormHeader
                v-if="!isLoading && company"
                @update-logo="onUpdateLogo"
                @update-company="onUpdateCompany"
                :company
                :last-surveys
                :surveys-count
                class="survey-form__header"
            />
        </template>
        <template #default="{ minimized }">
            <div v-if="!minimized" class="survey-form__wrapper position-relative">
                <Spinner
                    v-if="isLoading || initialDataIsLoading"
                    class="absolute-center"
                    label="Загрузка компании.."
                />
                <SurveyFormStepper
                    v-else-if="canBeCreated"
                    ref="stepper"
                    @completed="$emit('close')"
                    @close="close"
                    @draft-expired="surveyDraft = null"
                    @draft-deleted="$emit('close')"
                    @draft-created="surveyDraft = $event"
                    @draft-updated="onUpdateDraft"
                    @contact-created="onContactCreated"
                    @contact-updated="onContactUpdated"
                    :chat-member-id
                    :company
                    :survey
                    :contacts
                    :draft="surveyDraft"
                />
                <MessengerQuizFormWarningNoContacts
                    v-else-if="contacts.length === 0"
                    @suggest-create-contact="suggestCreateContact"
                />
                <MessengerQuizFormWarningAlreadyCreated
                    v-else-if="lastSurveys.length || 1"
                    @show="showLastSurvey"
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
                        title="Закрыть опрос"
                        hide-header
                    >
                        <div class="fs-4">
                            <p class="font-weight-semi">Сохранить черновик опроса?</p>
                            <p>В противном случае прогресс заполнения будет утерян</p>
                        </div>
                        <template #actions="{ close }">
                            <UiButton
                                @click="saveDraftAndClose"
                                icon="fa-solid fa-paper-plane"
                                color="success-light"
                                :loading="draftIsSaving"
                            >
                                Сохранить черновик
                            </UiButton>
                            <UiButton
                                @click="$emit('close')"
                                icon="fa-solid fa-xmark"
                                color="danger-light"
                            >
                                Закрыть опрос
                            </UiButton>
                            <UiButton @click="close" icon="fa-solid fa-ban" color="light">
                                Отмена
                            </UiButton>
                        </template>
                    </UiModal>
                </teleport>
            </div>
        </template>
    </UiMinimizeModal>
</template>
<script setup>
import { computed, reactive, ref, shallowRef, toRef, useTemplateRef } from 'vue';
import UiModal from '@/components/common/UI/UiModal.vue';
import { useFormData } from '@/utils/use/useFormData.js';
import SurveyFormHeader from '@/components/SurveyForm/SurveyFormHeader.vue';
import api from '@/api/api.js';
import Spinner from '@/components/common/Spinner.vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import SurveyFormStepper from '@/components/SurveyForm/SurveyFormStepper.vue';
import { useAsync } from '@/composables/useAsync.js';
import UiButton from '@/components/common/UI/UiButton.vue';
import { isNullish } from '@/utils/helpers/common/isNullish.js';
import { getCompanyShortName } from '@/utils/formatters/models/company.js';
import UiMinimizeModal from '@/components/common/UI/UiMinimizeModal.vue';
import { contactOptions } from '@/const/options/contact.options.js';
import { isPersonalContact } from '@/utils/helpers/models/contact.js';
import { useSurveyEditing } from '@/components/Survey/useSurveyEditing.js';
import { useAsyncPopup } from '@/composables/useAsyncPopup.js';
import { TASK_FORM_STEPS, useTaskManager } from '@/composables/useTaskManager.js';
import { messenger } from '@/const/messenger.js';
import { useNotify } from '@/utils/use/useNotify.js';
import MessengerQuizContactTaskSuggestModal from '@/components/MessengerQuiz/MessengerQuizContactTaskSuggestModal.vue';
import FormCompanyContact from '@/components/Forms/Company/FormCompanyContact.vue';
import MessengerQuizFormWarningNoContacts from '@/components/Messenger/Quiz/Form/Warning/MessengerQuizFormWarningNoContacts.vue';
import MessengerQuizFormWarningAlreadyCreated from '@/components/Messenger/Quiz/Form/Warning/MessengerQuizFormWarningAlreadyCreated.vue';

const emit = defineEmits(['close']);
const props = defineProps({
    survey: Object,
    initialStep: Number,
    companyId: Number
});

const { isEditMode } = useFormData(reactive({}), props.survey);

const title = computed(() => {
    if (isEditMode.value) {
        return `Редактирование опроса | ${getCompanyShortName(company.value)} | Опрос #${props.formData?.id}`;
    }

    if (isNotNullish(company.value)) {
        if (isNotNullish(surveyDraft.value)) {
            return `Опрос #${surveyDraft.value.id} | ${getCompanyShortName(company.value)}`;
        }

        return `Новый опрос | ${getCompanyShortName(company.value)}`;
    }

    return 'Опрос клиента';
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
            status: 'completed',
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
    surveyDraft.value.data = draft.data;
    surveyDraft.value.updated_at = draft.updated_at;
}

const initialDataIsLoading = ref(false);

async function fetchInitialData() {
    initialDataIsLoading.value = true;

    fetchCompany();
    fetchContacts();
    await fetchChatMember();
    fetchLastSurveys();
    await searchSurveyDraft();

    initialDataIsLoading.value = false;
}

// close

const closeModalIsVisible = ref(false);

const stepper = useTemplateRef('stepper');

function close() {
    if (!canBeCreated.value) {
        return emit('close');
    }

    if (isNullish(surveyDraft.value)) {
        closeModalIsVisible.value = true;
    } else {
        saveDraftAndClose();
    }
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

// contacts

const contactsIsLoading = ref(false);
const contacts = ref([]);

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
        step: TASK_FORM_STEPS.MESSAGE
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

// surveys

const { remainingTimeInMinutes } = useSurveyEditing(
    toRef(() => lastSurveys.value?.[0]),
    { adminCanEdit: false }
);

const canBeCreated = computed(() => {
    if (contacts.value.length === 0) {
        return false;
    }

    if (lastSurveys.value.length > 0) {
        return remainingTimeInMinutes.value <= 0;
    }

    return true;
});

const { show: showSurvey } = useAsyncPopup('surveyPreview');

function showLastSurvey() {
    showSurvey({ surveyId: lastSurveys.value[0].id });
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
</script>
