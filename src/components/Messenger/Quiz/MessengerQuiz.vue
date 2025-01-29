<template>
    <div class="messenger-quiz messenger-chat__content">
        <MessengerChatHeader />
        <MessengerQuizPreviews v-show="!isGeneralLoading" class="my-2" />
        <Spinner v-if="isGeneralLoading" class="absolute-center" label="Загрузка данных.." />
        <template v-else>
            <div class="messenger-quiz__wrapper">
                <Loader v-if="loaders.final" :label="currentLoadingLabel" class="my-4" />
                <MessengerQuizContacts
                    v-model:contact="currentRecipient"
                    @suggest-create="suggestCreateContact"
                    @edit="editContact"
                    label="Список доступных контактов"
                    :contacts="availableContacts"
                    :selected-contacts="selectedContacts"
                />
                <MessengerQuizForm
                    ref="quizForm"
                    v-model:contact="currentRecipient"
                    v-model:selected-contacts="selectedContacts"
                    @suggest-create-contact="suggestCreateContact"
                    @toggle-call-schedule="toggleCallSchedule"
                    @select-next-contact="selectNextContact"
                    @change-last-contact="changeLastContact"
                    :contacts="availableContacts"
                    :available-contacts="notSelectedContacts"
                    :disabled
                />
                <MessengerQuizFooter
                    v-if="contacts.length && !disabled"
                    @complete="send"
                    @object-destroyed="onObjectDestroyed"
                    @object-sold="onObjectSold"
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
            @created-contact="createContact"
        />
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
import { isNotNullish } from '@/utils/helpers/common/isNotNullish.js';
import { useMessengerQuiz } from '@/components/Messenger/Quiz/useMessengerQuiz.js';

const SCHEDULING_CALL_DURATION = 7; // days

const emit = defineEmits(['complete']);
defineProps({ disabled: Boolean });

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

const loaders = reactive({
    final: false,
    surveyCreating: false,
    messageSearching: false,
    messageCreating: false,
    tasksCreating: false,
    callsCreating: false,
    scheduledCallsCreating: false
});

const currentLoadingLabel = computed(() => {
    if (loaders.surveyCreating) return 'Сохранение результатов опроса..';
    if (loaders.messageSearching) return 'Отправка сообщений в чат..';
    if (loaders.messageCreating) return 'Отправка сообщений в чат..';
    if (loaders.tasksCreating) return 'Создание задач..';
    if (loaders.callsCreating) return 'Фиксация звонков..';
    if (loaders.scheduledCallsCreating) return 'Сохранение запланированных звонков..';
    if (loaders.final) return 'Загрузка результатов..';
    return null;
});

const finalContact = ref(null);
const finalSelectedContacts = shallowRef([]);

const {
    createSurvey,
    findSurveyMessage,
    createPotentialTasks,
    createCallsWithContacts,
    createScheduledCallTasks,
    sendMessageAboutSurveyIsUnavailable
} = useMessengerQuiz();

async function send() {
    const valid = quizForm.value.validate();
    if (!valid) return;

    const confirmed = await confirm(
        'Подтвердите заполнение опросника. Вы закончили заполнение информации?'
    );
    if (!confirmed) return;

    const chatMemberId = store.state.Messenger.currentDialog.id;

    const answers = quizForm.value.getForm();
    finalSelectedContacts.value = selectedContacts.value.map(element => element.entity);

    const hasAnswers = answers.some(element => {
        return isNotNullish(element.type) && element.type === 'main' && element.value !== undefined;
    });

    if (hasAnswers) {
        finalContact.value = currentRecipient.value;

        await showFinalContactPicker();

        loaders.final = true;

        loaders.surveyCreating = true;
        const createdSurvey = await createSurvey(finalContact.value, answers);
        loaders.surveyCreating = false;

        if (!createdSurvey) {
            notify.info('Произошла ошибка при сохранении опросника, попробуйте позже');
            loaders.final = false;
            return;
        }

        loaders.callsCreating = true;
        await createCallsWithContacts(
            selectedContacts.value.filter(element => element.entity.id !== finalContact.value.id),
            chatMemberId
        );
        loaders.callsCreating = false;

        loaders.messageSearching = true;
        const surveyMessage = await findSurveyMessage(createdSurvey.id, chatMemberId);
        loaders.messageSearching = false;

        if (!surveyMessage) {
            notify.info(
                'Не удалось установить связь с чатом, создайте задачи по контактам вручную..'
            );
            loaders.final = false;
            return;
        }

        loaders.tasksCreating = true;
        await createPotentialTasks(selectedContacts.value, surveyMessage.id, createdSurvey.id);
        loaders.tasksCreating = false;

        loaders.scheduledCallsCreating = true;
        await createScheduledCallTasks(scheduledCalls.value, surveyMessage.id, createdSurvey.id);
        loaders.scheduledCallsCreating = false;

        loaders.final = false;
    } else {
        loaders.final = true;

        loaders.callsCreating = true;
        await createCallsWithContacts(selectedContacts.value, chatMemberId);
        loaders.callsCreating = false;

        loaders.messageCreating = true;
        const createdMessage = await sendMessageAboutSurveyIsUnavailable(
            chatMemberId,
            selectedContacts.value
        );
        loaders.messageCreating = false;

        if (createdMessage) {
            loaders.tasksCreating = true;
            await createPotentialTasks(selectedContacts.value, createdMessage.id);
            loaders.tasksCreating = false;
        }

        loaders.scheduledCallsCreating = true;
        await createScheduledCallTasks(scheduledCalls.value, createdMessage.id);
        loaders.scheduledCallsCreating = false;

        loaders.final = false;
    }

    store.dispatch('Messenger/onSurveyCompleted', chatMemberId);
    isCompleted.value = true;

    notify.success('Задачи и звонки успешно созданы..');
}

const close = () => {
    emit('completed');
};

// schedule call

const { createTaskWithTemplate } = useTaskManager();

const scheduledCalls = ref([]);

async function scheduleCall(contact) {
    const taskPayload = await createTaskWithTemplate({
        message: `Прозвонить контакта (${getContactFullName(contact)})`,
        step: TASK_FORM_STEPS.DATE,
        end: dayjs().add(SCHEDULING_CALL_DURATION, 'day').toDate(),
        user_id: currentUser.value.id
    });

    if (taskPayload) {
        scheduledCalls.value.push({ payload: taskPayload, contactId: contact.id });

        const contactIndex = selectedContacts.value.findIndex(
            element => element.entity.id === contact.id
        );
        if (contactIndex !== -1)
            selectedContacts.value[contactIndex].form.scheduled = taskPayload.end;
    }
}

async function toggleCallSchedule(contact) {
    const contactIndex = scheduledCalls.value.findIndex(
        element => element.contactId === contact.id
    );
    if (contactIndex === -1) scheduleCall(contact);
    else {
        const confirmed = await confirm('Вы действительно хотите отменить звонок?');
        if (!confirmed) return;

        scheduledCalls.value.splice(contactIndex, 1);
        selectedContacts.value.find(element => element.entity.id === contact.id).form.scheduled =
            false;
    }
}

// object destroyed

async function onObjectDestroyed() {
    const object = store.state.Messenger.currentDialog.model.object;

    const taskPayload = await createTaskWithTemplate({
        message: `Объект #${object.id} снесен, отправить в пассив`,
        step: TASK_FORM_STEPS.MESSAGE
    });

    if (!taskPayload) return;

    const messagePayload = {
        message: `<b>Объект снесен!</b>`
    };

    const createdMessage = await api.messenger.sendMessageWithTask(
        store.state.Messenger.currentDialog.id,
        messagePayload,
        taskPayload
    );

    if (createdMessage) {
        notify.success('Сообщение и задача успешно созданы');
    } else {
        notify.error('Произошла ошибка. Попробуйте еще раз..');
    }
}

async function onObjectSold() {
    const object = store.state.Messenger.currentDialog.model.object;

    const taskPayload = await createTaskWithTemplate({
        message: `Объект #${object.id} продан `,
        step: TASK_FORM_STEPS.MESSAGE
    });

    if (!taskPayload) return;

    const messagePayload = {
        message: `<b>Объект продан!</b> Компания ${getCompanyShortName(store.state.Messenger.currentPanel)} больше не владелец`
    };

    const createdMessage = await api.messenger.sendMessageWithTask(
        store.state.Messenger.currentDialog.id,
        messagePayload,
        taskPayload
    );

    if (createdMessage) {
        notify.success('Сообщение и задача успешно созданы');
    } else {
        notify.error('Произошла ошибка. Попробуйте еще раз..');
    }
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

    const response = await api.contacts.getByCompany(company.value.id);

    if (response?.length) {
        contacts.value = response
            .filter(contact => contact.status === contactOptions.statusStatement.ACTIVE)
            .sort((first, second) => second.isMain - first.isMain);
    }

    setInitialCurrentContact();

    contactsIsLoading.value = false;
}

onMounted(async () => {
    if (!store.state.User.consultantList.length) store.dispatch('FETCH_CONSULTANT_LIST');

    await fetchContacts();
});

function onContactCreated(contact) {
    contacts.value.unshift(contact);
}

async function onContactUpdated(_, contact) {
    const contactIndex = contacts.value.findIndex(element => element.id === contact.id);
    if (contactIndex !== -1) {
        if (contact.status === contactOptions.statusStatement.PASSIVE)
            contacts.value.splice(contactIndex, 1);
        else Object.assign(contacts.value[contactIndex], contact);
    }

    store.commit('Messenger/onContactUpdated', contact);
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

// COMPUTES

const isGeneralLoading = computed(() => contactsIsLoading.value);
</script>
