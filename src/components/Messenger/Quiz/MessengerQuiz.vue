<template>
    <div class="messenger-quiz messenger-chat__content">
        <MessengerChatHeader />
        <Spinner v-if="isGeneralLoading" class="absolute-center" label="Загрузка данных.." />
        <template v-else>
            <div v-if="surveys.length" class="messenger-quiz__surveys mt-2">
                <Button v-tippy="'В разработке..'" @click="showSurveys" class="ml-auto" small icon>
                    <i class="fa-solid fa-eye"></i>
                    <span>Посмотреть полный список завершенных опросов ({{ surveysCount }})</span>
                </Button>
                <MessengerQuizInlineElement
                    v-for="survey in surveys"
                    :key="survey.id"
                    @show="showSurvey(survey.id)"
                    :quiz="survey"
                />
            </div>
            <div class="messenger-quiz__wrapper">
                <Loader v-if="isLoading" class="my-4" />
                <MessengerQuizContacts
                    v-model:contact="currentRecipient"
                    @suggest="suggestTask"
                    @edit="editContact"
                    label="Список доступных контактов"
                    :contacts="availableContacts"
                />
                <MessengerQuizForm
                    ref="quizForm"
                    v-model:contact="currentRecipient"
                    @suggest-contact="suggestTask"
                    @schedule-call="scheduleCall(currentRecipient)"
                    @mark-contact-as-unavailable="markContactAsUnavailable"
                    :disabled="!contacts.length"
                    :contacts="availableContacts"
                    :unavailable-contacts="unavailableContacts"
                />
                <MessengerQuizFooter
                    v-if="contacts.length"
                    @complete="send"
                    @object-destroyed="onObjectDestroyed"
                    @object-sold="onObjectSold"
                    :disabled="isCompleted"
                />
                <MessengerQuizComplete v-if="isCompleted" @close="close" />
            </div>
        </template>
        <Modal
            @close="surveyPreviewIsOpen = false"
            :show="surveyPreviewIsOpen"
            :width="900"
            :min-height="700"
            title="Просмотр результатов опросника"
        >
            <MessengerQuizPreview :quiz-id="previewedSurveyId" />
        </Modal>
        <Modal
            @close="closeContactPicker"
            title="Выбор контакта"
            :width="1200"
            :show="contactPickerIsVisible"
        >
            <DashboardChip class="dashboard-bg-warning-l mb-2 mx-auto w-auto text-center">
                Подтвердите контакт, с которым происходил разговор по объекту/предложению/компании!
            </DashboardChip>
            <MessengerQuizRecipientPicker v-model="currentRecipient" />
            <template #footer>
                <Button @click="submitContactPicker" :disabled="!currentRecipient" small success>
                    Сохранить
                </Button>
                <Button @click="closeContactPicker" small>Отменить</Button>
            </template>
        </Modal>
        <Modal
            @close="closeTaskSuggestion"
            title="Создание контакта"
            :width="600"
            :show="taskSuggestionIsVisible"
        >
            <h3 class="text-center">
                Заполнить данные контакта или создать задачу для офис-менеджера?
            </h3>
            <template #footer>
                <Button @click="createContact" small>Заполнить контакта</Button>
                <Button @click="confirmTaskSuggestion" small>Создать задачу</Button>
            </template>
        </Modal>
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
import { computed, onMounted, ref, shallowRef, useTemplateRef } from 'vue';
import { useNotify } from '@/utils/use/useNotify.js';
import { useConfirm } from '@/composables/useConfirm.js';
import api from '@/api/api.js';
import MessengerQuizComplete from '@/components/Messenger/Quiz/MessengerQuizComplete.vue';
import Loader from '@/components/common/Loader.vue';
import MessengerChatHeader from '@/components/Messenger/Chat/Header/MessengerChatHeader.vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import Modal from '@/components/common/Modal.vue';
import MessengerQuizContacts from '@/components/Messenger/Quiz/MessengerQuizContacts.vue';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import MessengerQuizInlineElement from '@/components/Messenger/Quiz/MessengerQuizInlineElement.vue';
import Button from '@/components/common/Button.vue';
import Spinner from '@/components/common/Spinner.vue';
import MessengerQuizPreview from '@/components/Messenger/Quiz/Preview/MessengerQuizPreview.vue';
import { useAsyncPopup } from '@/composables/useAsyncPopup.js';
import MessengerQuizRecipientPicker from '@/components/Messenger/Quiz/MessengerQuizRecipientPicker.vue';
import MessengerQuizForm from '@/components/Messenger/Quiz/MessengerQuizForm.vue';
import { TASK_FORM_STEPS, useTaskManager } from '@/composables/useTaskManager.js';
import dayjs from 'dayjs';
import { toBoldHTML } from '@/utils/formatters/html.js';
import { useAuth } from '@/composables/useAuth.js';
import { messenger, messengerTemplates } from '@/const/messenger.js';
import { getCompanyShortName } from '@/utils/formatters/models/company.js';
import { contactOptions } from '@/const/options/contact.options.js';
import FormCompanyContact from '@/components/Forms/Company/FormCompanyContact.vue';
import MessengerQuizFooter from '@/components/Messenger/Quiz/MessengerQuizFooter.vue';
import { useMessengerQuizTaskSuggest } from '@/components/Messenger/Quiz/useMessengerQuizTaskSuggest.js';

const SCHEDULING_CALL_DURATION = 30; // days

const emit = defineEmits(['complete']);

const store = useStore();
const notify = useNotify();
const { confirm } = useConfirm();
const quizForm = useTemplateRef('quizForm');
const { currentUser } = useAuth();

const {
    show: showContactPicker,
    isVisible: contactPickerIsVisible,
    cancel: closeContactPicker,
    submit: submitContactPicker
} = useAsyncPopup('quizContactPicker');

const isLoading = ref(false);
const isCompleted = ref(false);
const surveys = ref([]);
const surveysCount = ref(0);
const surveyPreviewIsOpen = ref(false);
const previewedSurveyId = ref(null);

const { isLoading: surveysIsLoading } = useDelayedLoader(
    store.getters['Messenger/currentChatHasLastCall']
);

const send = async () => {
    const confirmed = await confirm(
        'Подтвердите заполнение опросника. Вы закончили заполнение полученной информации?'
    );
    if (!confirmed) return;

    if (!availableContacts.value.length) {
        isLoading.value = true;

        const messageCreated = await sendMessageAboutSurveyIsUnavailable();

        isLoading.value = false;

        if (messageCreated) {
            isCompleted.value = true;
        }

        return;
    }

    const contact = await showContactPicker({});
    if (!contact) return;

    isLoading.value = true;

    const answers = quizForm.value.getForm();

    const createdSurvey = await api.survey.create({
        contact_id: currentRecipient.value.id,
        user_id: currentUser.value.id,
        chat_member_id: store.state.Messenger.currentDialog.id,
        question_answers: answers
    });

    if (createdSurvey) {
        store.dispatch('Messenger/onSurveyCreated', createdSurvey);
        isCompleted.value = true;
        notify.success('Опрос успешно сохранен');
    }

    isLoading.value = false;
};

async function sendMessageAboutSurveyIsUnavailable() {
    const messagePayload = {
        message: 'Не удалось дозвониться до контактов опросника',
        template: messengerTemplates.UNAVAILABLE_SURVEY
    };

    const createdMessage = await api.messenger.sendMessage(
        store.state.Messenger.currentDialog.id,
        messagePayload
    );

    if (createdMessage) {
        notify.success('Сообщение успешно создано');

        return true;
    }

    return false;
}

const close = () => {
    emit('completed');
};

const fetchSurveys = async () => {
    surveysIsLoading.value = true;

    const response = await store.dispatch('Messenger/getCurrentChatQuizzes', {
        sort: '-created_at'
    });
    surveys.value = response.data.slice(0, 3).reverse();
    surveysCount.value = response.pagination.totalCount;

    surveysIsLoading.value = false;
};

const showSurvey = surveyId => {
    previewedSurveyId.value = surveyId;
    surveyPreviewIsOpen.value = true;
};

const showSurveys = () => {
    notify.info('Функция находится в разработке..', 'Функция недоступна');
};

// TASKS

const { createTaskWithTemplate } = useTaskManager();

async function scheduleCall(contact) {
    const taskPayload = await createTaskWithTemplate({
        message: `Прозвонить контакта (${contact.full_name ?? `Общий контакт компании #${contact.company_id}`})`,
        step: TASK_FORM_STEPS.DATE,
        end: dayjs().add(SCHEDULING_CALL_DURATION, 'day').toDate(),
        user_id: currentUser.value.id
    });

    if (!taskPayload) return;

    const messagePayload = {
        message: `Запланировал звонок на ${toBoldHTML(dayjs(taskPayload.end).format('D.MM.YY'))}`,
        contact_ids: [contact.id]
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

function suggestTask() {
    taskSuggestionIsVisible.value = true;
}

function closeTaskSuggestion() {
    taskSuggestionIsVisible.value = false;
}

onMounted(async () => {
    if (store.getters['Messenger/currentChatHasLastCall']) fetchSurveys();
    if (!store.state.User.consultantList.length) store.dispatch('FETCH_CONSULTANT_LIST');

    await fetchContacts();
    setInitialCurrentContact();
});

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
}

async function fetchContacts() {
    contactsIsLoading.value = true;

    const response = await api.contacts.getByCompany(company.value.id);

    if (response?.length) {
        contacts.value = response
            .filter(contact => contact.status === contactOptions.statusStatement.ACTIVE)
            .sort((first, second) => second.isMain - first.isMain);
    }

    contactsIsLoading.value = false;
}

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

function createContact() {
    closeTaskSuggestion();
    formIsVisible.value = true;
}

function confirmTaskSuggestion() {
    closeTaskSuggestion();
    createContactTask();
}

function closeForm() {
    formIsVisible.value = false;
    updatingContact.value = null;
}

function editContact(contact) {
    updatingContact.value = contact;
    formIsVisible.value = true;
}

const { markContactAsUnavailable, availableContacts, unavailableContacts } =
    useMessengerQuizTaskSuggest(contacts);

// COMPUTES

const isGeneralLoading = computed(
    () => contactsIsLoading.value || surveysIsLoading.value || isLoading.value
);
</script>
