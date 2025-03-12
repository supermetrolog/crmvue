<template>
    <div class="messenger-quiz messenger-chat__content">
        <Loader v-if="isLoading" global :label="currentLoadingLabel" />
        <MessengerChatHeader />
        <MessengerQuizPreviews
            v-show="!isGeneralLoading"
            @last-survey-loaded="lastSurveyOnLoad"
            class="my-2"
        />
        <Spinner
            v-if="isGeneralLoading || lastSurveyIsLoading"
            class="absolute-center"
            label="Загрузка данных.."
        />
        <template v-else>
            <div class="messenger-quiz__wrapper">
                <MessengerQuizContacts
                    v-model:contact="currentRecipient"
                    @suggest-create="suggestCreateContact"
                    @edit="editContact"
                    @show-archived="archivedContactsIsVisible = true"
                    label="Список доступных контактов"
                    :contacts="availableContacts"
                    :selected-contacts="selectedContacts"
                    :archived-contacts-count="archivedContactsCount"
                />
                <MessengerQuizForm
                    ref="quizForm"
                    v-model:contact="currentRecipient"
                    v-model:selected-contacts="selectedContacts"
                    @suggest-create-contact="suggestCreateContact"
                    @schedule-call="scheduleCall"
                    @select-next-contact="selectNextContact"
                    @change-last-contact="changeLastContact"
                    @object-sold="onObjectSold"
                    @object-destroyed="onObjectDestroyed"
                    :contacts="availableContacts"
                    :available-contacts="notSelectedContacts"
                    :disabled="disabled"
                    :can-be-created="canBeCreated"
                    :last-survey="lastSurvey"
                />
                <MessengerQuizFooter
                    v-if="contacts.length && !disabled && canBeCreated"
                    @complete="send"
                    :disabled="isCompleted"
                />
                <MessengerQuizComplete v-if="isCompleted" @close="close" />
            </div>
        </template>
        <Modal
            title="Выбор контакта"
            :width="1200"
            :show="contactPickerIsVisible"
            :close-on-press-esc="false"
            :close-on-outside-click="false"
        >
            <DashboardChip class="dashboard-bg-warning-l mb-2 mx-auto w-auto text-center">
                Подтвердите контакт, с которым в итоге происходил разговор по
                объекту/предложению/компании!
            </DashboardChip>
            <MessengerQuizContacts
                @selected="finalContact = $event"
                label="Список прозвоненных контактов"
                :contacts="finalSelectedContacts"
            />
            <template #footer>
                <Button @click="submitContactPicker" :disabled="!finalContact" small success>
                    Сохранить
                </Button>
            </template>
        </Modal>
        <MessengerQuizContactTaskSuggestModal
            v-model:visible="taskSuggestionIsVisible"
            @create-task="confirmTaskSuggestion"
            @create-contact="createContact"
        />
        <UiModal
            v-model:visible="archivedContactsIsVisible"
            :width="1100"
            :min-height="400"
            title="Список архивных контактов компании"
        >
            <MessengerQuizArchivedContacts @edit="editContact" :company-id="company?.id" />
        </UiModal>
        <teleport to="body">
            <FormCompanyContact
                v-if="formIsVisible"
                @close="closeForm"
                @created="onContactCreated"
                @updated="onContactUpdated"
                :formdata="updatingContact"
                :company_id="company?.id"
            />
        </teleport>
    </div>
</template>
<script setup>
import { useStore } from 'vuex';
import { computed, onMounted, reactive, ref, shallowRef, useTemplateRef } from 'vue';
import { useNotify } from '@/utils/use/useNotify.js';
import { useConfirm } from '@/composables/useConfirm.js';
import api from '@/api/api.js';
import MessengerQuizComplete from '@/components/Messenger/Quiz/MessengerQuizComplete.vue';
import Loader from '@/components/common/Loader.vue';
import MessengerChatHeader from '@/components/Messenger/Chat/Header/MessengerChatHeader.vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import Modal from '@/components/common/Modal.vue';
import MessengerQuizContacts from '@/components/Messenger/Quiz/MessengerQuizContacts.vue';
import Button from '@/components/common/Button.vue';
import Spinner from '@/components/common/Spinner.vue';
import { useAsyncPopup } from '@/composables/useAsyncPopup.js';
import MessengerQuizForm from '@/components/Messenger/Quiz/Form/MessengerQuizForm.vue';
import { TASK_FORM_STEPS, useTaskManager } from '@/composables/useTaskManager.js';
import dayjs from 'dayjs';
import { useAuth } from '@/composables/useAuth.js';
import { messenger } from '@/const/messenger.js';
import { getCompanyShortName } from '@/utils/formatters/models/company.js';
import { contactOptions } from '@/const/options/contact.options.js';
import FormCompanyContact from '@/components/Forms/Company/FormCompanyContact.vue';
import MessengerQuizFooter from '@/components/Messenger/Quiz/MessengerQuizFooter.vue';
import { useMessengerQuizContactSuggest } from '@/components/Messenger/Quiz/useMessengerQuizContactSuggest.js';
import MessengerQuizPreviews from '@/components/Messenger/Quiz/MessengerQuizPreviews.vue';
import MessengerQuizContactTaskSuggestModal from '@/components/Messenger/Quiz/MessengerQuizContactTaskSuggestModal.vue';
import { getContactFullName } from '@/utils/formatters/models/contact.js';
import { useMessengerQuiz } from '@/components/Messenger/Quiz/useMessengerQuiz.js';
import UiModal from '@/components/common/UI/UiModal.vue';
import MessengerQuizArchivedContacts from '@/components/Messenger/Quiz/MessengerQuizArchivedContacts.vue';
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import { isNullish } from '@/utils/helpers/common/isNullish.js';
import { useSurveyEditing } from '@/components/Survey/useSurveyEditing.js';

const SCHEDULING_CALL_DURATION = 1; // days

const emit = defineEmits(['complete']);
defineProps({ disabled: Boolean });

// remaining last survey

const lastSurveyIsLoading = ref(true);
const lastSurvey = ref(null);

const { currentUserIsAdmin } = useAuth();
const { remainingTimeInMinutes } = useSurveyEditing(lastSurvey);

function lastSurveyOnLoad(survey) {
    if (isNotNullish(survey)) lastSurvey.value = survey;
    lastSurveyIsLoading.value = false;
}

const canBeCreated = computed(() => {
    return (
        currentUserIsAdmin.value ||
        (isNotNullish(lastSurvey.value) && remainingTimeInMinutes.value <= 0) ||
        (!lastSurveyIsLoading.value && isNullish(lastSurvey.value))
    );
});

//

const store = useStore();
const notify = useNotify();
const { confirm } = useConfirm();
const quizForm = useTemplateRef('quizForm');
const { currentUser } = useAuth();

const {
    show: showFinalContactPicker,
    isVisible: contactPickerIsVisible,
    submit: submitContactPicker
} = useAsyncPopup('quizContactPicker');

const isCompleted = ref(false);

const isLoading = ref(false);
const loaders = reactive({
    surveyCreating: false,
    messageSearching: false,
    messageCreating: false,
    tasksCreating: false,
    callsCreating: false,
    relationCreating: false,
    companySurveyCreating: false
});

const loadingLabels = {
    surveyCreating: 'Сохранение результатов опроса..',
    messageSearching: 'Поиск сообщений в чате..',
    messageCreating: 'Отправка сообщений в чат..',
    tasksCreating: 'Создание задач..',
    callsCreating: 'Фиксация звонков..',
    relationCreating: 'Сохранение связанных опросов..',
    companySurveyCreating: 'Сохранение опроса компании..'
};

const currentLoadingLabel = computed(() => {
    const keys = Object.keys(loaders).filter(key => loaders[key]);

    if (keys.length) return loadingLabels[keys[0]];

    return 'Загрузка результатов..';
});

const finalContact = ref(null);
const finalSelectedContacts = shallowRef([]);

const {
    createSurvey,
    findSurveyMessage,
    createPotentialTasks,
    createCallsWithContacts,
    sendMessageAboutSurveyIsUnavailable,
    createRelatedSurveys
} = useMessengerQuiz();

const isObjectChatMember = computed(() => {
    return (
        store.state.Messenger.currentDialogType === messenger.dialogTypes.OBJECT &&
        store.state.Messenger.currentDialog.model.type ===
            messenger.objectChatMemberTypes.RENT_OR_SALE
    );
});

function prepareAnswers(...answers) {
    return answers.map(element => ({
        question_answer_id: element.question_answer_id,
        value: element.value,
        files: element.files,
        file: element.file
    }));
}

async function send() {
    const valid = quizForm.value.validate();
    if (!valid) return;

    const confirmed = await confirm(
        'Подтвердите заполнение опросника. Вы закончили заполнение информации?'
    );
    if (!confirmed) return;

    let targetChatMemberId = store.state.Messenger.currentDialog.id;

    const { isCanceled, answers, offersAnswers } = quizForm.value.getForm();

    finalSelectedContacts.value = selectedContacts.value.map(element => element.entity);

    if (!isCanceled) {
        finalContact.value = currentRecipient.value;

        await showFinalContactPicker();

        isLoading.value = true;

        loaders.surveyCreating = true;

        if (isObjectChatMember.value) {
            targetChatMemberId = await api.messenger.getChatMemberIdByQuery({
                model_type: messenger.dialogTypes.COMPANY,
                model_id: store.state.Messenger.currentDialog.model.object.company_id
            });
        }

        let createdSurvey;

        try {
            createdSurvey = await createSurvey(
                finalContact.value,
                prepareAnswers(...answers),
                targetChatMemberId
            );
        } catch (error) {
            notify.info('Произошла ошибка при сохранении опросника, попробуйте позже');
            isLoading.value = false;

            return;
        } finally {
            loaders.surveyCreating = false;
        }

        try {
            loaders.callsCreating = true;

            await createCallsWithContacts(
                selectedContacts.value.filter(
                    element => element.entity.id !== finalContact.value.id
                ),
                targetChatMemberId
            );
        } finally {
            loaders.callsCreating = false;
        }

        let surveyMessage;

        try {
            loaders.messageSearching = true;

            surveyMessage = await findSurveyMessage(createdSurvey.id, targetChatMemberId);
        } catch (error) {
            notify.info(
                'Не удалось установить связь с чатом, создайте задачи по контактам вручную..'
            );
            isLoading.value = false;
            return;
        } finally {
            loaders.messageSearching = false;
        }

        if (offersAnswers.length) {
            try {
                loaders.relationCreating = true;
                await createRelatedSurveys(finalContact.value, offersAnswers, createdSurvey);
            } finally {
                loaders.relationCreating = false;
            }
        }

        try {
            loaders.tasksCreating = true;
            await createPotentialTasks(selectedContacts.value, surveyMessage.id, createdSurvey.id);
            loaders.tasksCreating = false;
        } finally {
            loaders.tasksCreating = false;
        }

        isLoading.value = false;
    } else {
        isLoading.value = true;

        try {
            loaders.callsCreating = true;
            await createCallsWithContacts(selectedContacts.value, targetChatMemberId);
            loaders.callsCreating = false;

            loaders.messageCreating = true;
            const createdMessage = await sendMessageAboutSurveyIsUnavailable(
                targetChatMemberId,
                selectedContacts.value
            );
            loaders.messageCreating = false;

            loaders.tasksCreating = true;
            await createPotentialTasks(selectedContacts.value, createdMessage.id);
            loaders.tasksCreating = false;
        } catch (error) {
            loaders.messageCreating = false;
            loaders.tasksCreating = false;
            loaders.callsCreating = false;
        }

        isLoading.value = false;
    }

    store.dispatch('Messenger/onSurveyCompleted', targetChatMemberId);
    isCompleted.value = true;

    notify.success('Задачи и звонки успешно созданы..');
}

const close = () => {
    emit('completed');
};

// schedule call

const { createTaskWithTemplate } = useTaskManager();

const scheduledCalls = ref([]);

async function createScheduleCallTask(contact) {
    const contactFullName = getContactFullName(contact);

    const taskPayload = await createTaskWithTemplate({
        message: `Прозвонить ${contactFullName} (компания #${contact.company_id})`,
        step: TASK_FORM_STEPS.DATE,
        end: dayjs().add(SCHEDULING_CALL_DURATION, 'day').toDate(),
        user_id: currentUser.value.id,
        callPresets: true
    });

    if (!taskPayload) return;

    scheduledCalls.value.push({ payload: taskPayload, contactId: contact.id });

    const contactIndex = selectedContacts.value.findIndex(
        element => element.entity.id === contact.id
    );
    if (contactIndex !== -1) selectedContacts.value[contactIndex].form.scheduled = taskPayload.end;

    let targetChatMemberId = store.state.Messenger.currentDialog.id;

    if (isObjectChatMember.value) {
        targetChatMemberId = await api.messenger.getChatMemberIdByQuery({
            model_type: messenger.dialogTypes.COMPANY,
            model_id: store.state.Messenger.currentDialog.model.object.company_id
        });
    }

    // TODO: Поменять end на start, когда поменяем форму
    // TODO: Добавить шаблон сообщения для schedule-call

    const messagePayload = {
        message: `Запланировал звонок с ${contactFullName} на ${dayjs(taskPayload.end).format('D.MM.YYYY, HH:mm')}!`,
        contact_ids: [contact.id],
        template: 'schedule-call'
    };

    try {
        const createdMessage = await api.messenger.sendMessageWithTask(
            targetChatMemberId,
            messagePayload,
            taskPayload
        );

        if (createdMessage) notify.success('Звонок контакту успешно запланирован');
    } catch (error) {
        notify.error('Не удалось запланировать звонок. Попробуйте еще раз');
    }
}

async function scheduleCall(contact) {
    await createScheduleCallTask(contact);
}

// object destroyed

async function createObjectMessageWithTask(object, messagePayload, taskPayload) {
    const targetChatMemberId = await api.messenger.getChatMemberIdByQuery({
        model_type: messenger.dialogTypes.OBJECT,
        model_id: object.id
    });

    const createdMessage = await api.messenger.sendMessageWithTask(
        targetChatMemberId,
        messagePayload,
        taskPayload
    );

    if (createdMessage) {
        notify.success('Сообщение и задача успешно созданы');
    } else {
        notify.error('Произошла ошибка. Попробуйте еще раз..');
    }
}

async function onObjectDestroyed(object) {
    const taskPayload = await createTaskWithTemplate({
        message: `Объект #${object.id} (${object.company_name}) снесен, отправить в пассив`,
        step: TASK_FORM_STEPS.MESSAGE
    });

    if (!taskPayload) return;

    const messagePayload = {
        message: `<b>Объект снесен!</b>`,
        template: 'object-destroyed'
    };

    await createObjectMessageWithTask(object, messagePayload, taskPayload);
}

async function onObjectSold(object) {
    const taskPayload = await createTaskWithTemplate({
        message: `Объект #${object.id} (${object.company_name}) продан`,
        step: TASK_FORM_STEPS.MESSAGE
    });

    if (!taskPayload) return;

    const messagePayload = {
        message: `<b>Объект продан!</b> Компания ${object.company_name} больше не владелец`,
        template: 'object-sold'
    };

    await createObjectMessageWithTask(object, messagePayload, taskPayload);
}

async function createContactTask() {
    const taskPayload = await createTaskWithTemplate({
        message: `Добавить новый контакт в компании ${getCompanyShortName(store.state.Messenger.currentPanel)}`,
        step: TASK_FORM_STEPS.MESSAGE
    });

    if (!taskPayload) return;

    const messagePayload = {
        message: `Добавлен новый контакт компании!`
    };

    const currentCompanyDialogId = await api.messenger.getChatMemberIdByQuery({
        model_type: messenger.dialogTypes.COMPANY,
        model_id: store.state.Messenger.currentPanel?.id
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

function createContact() {
    closeTaskSuggestion();
    formIsVisible.value = true;
}

function confirmTaskSuggestion() {
    closeTaskSuggestion();
    createContactTask();
}

// CONTACTS

const contactsIsLoading = ref(false);
const contacts = ref([]);
const currentRecipient = shallowRef(null);

const taskSuggestionIsVisible = ref(false);
const formIsVisible = ref(false);
const updatingContact = shallowRef(null);

const company = computed(() => store.state.Messenger.currentPanel);

function setInitialCurrentContact() {
    currentRecipient.value = contacts.value.find(contact => contact.isMain) ?? contacts.value[0];

    if (currentRecipient.value) selectContact(currentRecipient.value);
}

async function fetchContacts() {
    contactsIsLoading.value = true;

    try {
        const response = await api.contacts.getByCompany(company.value.id);

        contacts.value = response
            .filter(contact => contact.status === contactOptions.statusStatement.ACTIVE)
            .sort((first, second) => second.isMain - first.isMain);

        setInitialCurrentContact();
    } finally {
        contactsIsLoading.value = false;
    }
}

async function fetchArchivedContactsCount() {
    try {
        const response = await api.contacts.list({
            company_id: company.value.id,
            status: 0,
            type: 0
        });

        archivedContactsCount.value = response.data?.length;
    } catch (error) {
        archivedContactsCount.value = 0;
    }
}

async function fetchConsultantsIfNeeded() {
    if (!store.state.User.consultantList.length) await store.dispatch('FETCH_CONSULTANT_LIST');
}

onMounted(() => {
    fetchConsultantsIfNeeded();
    fetchContacts();
    fetchArchivedContactsCount();
});

function onContactCreated(contact) {
    contacts.value.unshift(contact);
    fetchArchivedContactsCount();
}

async function onContactUpdated(_, contact) {
    const contactIndex = contacts.value.findIndex(element => element.id === contact.id);

    if (contactIndex !== -1) {
        if (contact.status === contactOptions.statusStatement.PASSIVE)
            contacts.value.splice(contactIndex, 1);
        else Object.assign(contacts.value[contactIndex], contact);
    }

    store.commit('Messenger/onContactUpdated', contact);
    fetchArchivedContactsCount();
}

function closeForm() {
    formIsVisible.value = false;
    updatingContact.value = null;
}

function editContact(contact) {
    updatingContact.value = contact;
    formIsVisible.value = true;
}

const {
    availableContacts,
    notSelectedContacts,
    selectedContacts,
    selectContact,
    changeLastContact
} = useMessengerQuizContactSuggest(contacts);

function selectNextContact(contact) {
    selectContact(contact);
    currentRecipient.value = contact;
}

const archivedContactsIsVisible = ref(false);

const archivedContactsCount = ref(0);

// COMPUTES

const isGeneralLoading = computed(() => contactsIsLoading.value);
</script>
