<template>
    <div class="messenger-quiz messenger-chat__content">
        <MessengerChatHeader />
        <div v-if="shouldCall" class="messenger-quiz__info">
            <MessengerQuizWarning />
        </div>
        <div class="mt-2">
            <Spinner v-if="surveysIsLoading" class="small" label="Загрузка опросов"></Spinner>
            <div v-else-if="surveys.length" class="messenger-quiz__surveys">
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
        </div>
        <div class="messenger-quiz__wrapper">
            <MessengerQuizHeader v-model:contact="currentRecipient" />
            <Loader v-if="isLoading" class="my-4" />
            <MessengerQuizForm ref="quizForm" />
            <div class="messenger-quiz__footer">
                <MessengerButton @click="send" color="success" :disabled="isCompleted">
                    Готово
                </MessengerButton>
                <MessengerButton @click="scheduleCall" :disabled="!currentRecipient">
                    Запланировать звонок
                </MessengerButton>
                <MessengerButton disabled>Контакты утеряны</MessengerButton>
                <MessengerButton
                    v-if="isObjectChatMember"
                    @click="onObjectDestroyed"
                    :disabled="objectIsPassive"
                    color="danger"
                >
                    Объект снесен
                </MessengerButton>
                <MessengerButton
                    v-else
                    @click="onCompanyDestroyed"
                    :disabled="companyIsPassive"
                    color="danger"
                >
                    Компания ликвидирована
                </MessengerButton>
            </div>
            <MessengerQuizComplete v-if="isCompleted" @close="close" />
        </div>
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
            title="Создание задачи"
            :width="400"
            :show="taskSuggestionIsVisible"
        >
            <h3 class="text-center">Создать задачу для офис.менеджера или другого сотрудника?</h3>

            <template #footer>
                <Button @click="createTaskTemplate" :disabled="!currentRecipient" small success>
                    Создать задачу
                </Button>
                <Button @click="closeTaskSuggestion" small>Пропустить</Button>
            </template>
        </Modal>
    </div>
</template>
<script setup>
import MessengerButton from '@/components/Messenger/MessengerButton.vue';
import { useStore } from 'vuex';
import { computed, onMounted, ref, shallowRef, useTemplateRef } from 'vue';
import { useNotify } from '@/utils/useNotify.js';
import { useConfirm } from '@/composables/useConfirm.js';
import api from '@/api/api.js';
import MessengerQuizComplete from '@/components/Messenger/Quiz/MessengerQuizComplete.vue';
import Loader from '@/components/common/Loader.vue';
import MessengerChatHeader from '@/components/Messenger/Chat/Header/MessengerChatHeader.vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import Modal from '@/components/common/Modal.vue';
import MessengerQuizHeader from '@/components/Messenger/Quiz/MessengerQuizHeader.vue';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import MessengerQuizInlineElement from '@/components/Messenger/Quiz/MessengerQuizInlineElement.vue';
import Button from '@/components/common/Button.vue';
import Spinner from '@/components/common/Spinner.vue';
import MessengerQuizPreview from '@/components/Messenger/Quiz/MessengerQuizPreview.vue';
import { useAsyncPopup } from '@/composables/useAsyncPopup.js';
import MessengerQuizRecipientPicker from '@/components/Messenger/Quiz/MessengerQuizRecipientPicker.vue';
import MessengerQuizForm from '@/components/Messenger/Quiz/MessengerQuizForm.vue';
import MessengerQuizWarning from '@/components/Messenger/Quiz/MessengerQuizWarning.vue';
import { TASK_FORM_STEPS, useTaskManager } from '@/composables/useTaskManager.js';
import dayjs from 'dayjs';
import { toBoldHTML } from '@/utils/formatters/html.js';
import { useAuth } from '@/composables/useAuth.js';
import { messenger } from '@/const/messenger.js';
import { getCompanyShortName } from '@/utils/formatters/models/company.js';

const SCHEDULING_CALL_DURATION = 30; // days
const TASK_DURATION = 7; // days

const emit = defineEmits(['complete']);

const store = useStore();
const notify = useNotify();
const { confirm } = useConfirm();
const quizForm = useTemplateRef('quizForm');
const { createTaskWithTemplate } = useTaskManager();
const { currentUser } = useAuth();

const {
    show: showContactPicker,
    isVisible: contactPickerIsVisible,
    cancel: closeContactPicker,
    submit: submitContactPicker
} = useAsyncPopup('quizContactPicker');

const {
    show: suggestTask,
    isVisible: taskSuggestionIsVisible,
    cancel: closeTaskSuggestion,
    submit: createTaskTemplate
} = useAsyncPopup('taskSuggestion');

const isLoading = ref(false);
const isCompleted = ref(false);

const currentRecipient = shallowRef(null);
const surveys = ref([]);
const surveysCount = ref(0);
const surveyPreviewIsOpen = ref(false);
const previewedSurveyId = ref(null);

const isObjectChatMember = computed(() => {
    return (
        store.state.Messenger.currentDialog?.model?.type ===
        messenger.objectChatMemberTypes.RENT_OR_SALE
    );
});

const shouldCall = computed(() => {
    return (
        store.getters['Messenger/currentDaysCountAfterLastCall'] >
        import.meta.env.VITE_VUE_APP_MESSENGER_DATE_FROM_CALL_WARNING
    );
});

const companyIsPassive = computed(() => !store.state.Messenger.currentPanel.status);
const objectIsPassive = computed(
    () => store.state.Messenger.currentDialog.model.object.status !== 1
);

const { isLoading: surveysIsLoading } = useDelayedLoader(
    store.getters['Messenger/currentChatHasLastCall']
);

const send = async () => {
    let taskPayload;

    const confirmed = await confirm(
        'Подтвердите заполнение опросника. Вы закончили заполнение полученной информации?'
    );
    if (!confirmed) return;

    const contact = await showContactPicker({});
    if (!contact) return;

    const taskShouldBeCreated = await suggestTask({});
    if (taskShouldBeCreated) {
        taskPayload = await createTaskWithTemplate({
            message: `Обработать информацию опроса! `,
            step: TASK_FORM_STEPS.MESSAGE,
            end: dayjs().add(TASK_DURATION, 'day').toDate()
        });

        if (!taskPayload) return;
    }

    isLoading.value = true;

    const answers = quizForm.value.getForm();

    const createdSurvey = await api.survey.create({
        contact_id: currentRecipient.value.id,
        user_id: currentUser.value.id,
        chat_member_id: store.state.Messenger.currentDialog.id,
        question_answers: answers
    });

    if (createdSurvey) {
        if (taskPayload) await createTask(taskPayload);

        store.dispatch('Messenger/onSurveyCreated', createdSurvey);
        isCompleted.value = true;
        notify.success('Опрос успешно сохранен');
    }

    isLoading.value = false;
};

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

async function createTask(taskPayload) {
    const messagePayload = {
        message: `Заполнил опросник. Прошу ознакомиться и обработать информацию!`,
        contact_ids: currentRecipient.value ? [currentRecipient.value.id] : []
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

const scheduleCall = async () => {
    const taskPayload = await createTaskWithTemplate({
        message: `Прозвонить контакта (${currentRecipient.value?.full_name ?? `Общий контакт компании #${currentRecipient.value?.company_id}`})`,
        step: TASK_FORM_STEPS.DATE,
        end: dayjs().add(SCHEDULING_CALL_DURATION, 'day').toDate(),
        user_id: currentUser.value.id
    });

    if (!taskPayload) return;

    const messagePayload = {
        message: `Запланировал звонок на ${toBoldHTML(dayjs(taskPayload.end).format('D.MM.YY'))}`,
        contact_ids: currentRecipient.value ? [currentRecipient.value.id] : []
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
};

async function onCompanyDestroyed() {
    const company = store.state.Messenger.currentPanel;

    const taskPayload = await createTaskWithTemplate({
        message: `Компания ${getCompanyShortName(company)} ликвидирована, отправить в пассив`,
        step: TASK_FORM_STEPS.MESSAGE,
        end: dayjs().add(SCHEDULING_CALL_DURATION, 'day').toDate()
    });

    if (!taskPayload) return;

    const messagePayload = {
        message: `<b>Компания ликвидирована!</b>`
    };

    const currentCompanyDialogId = await api.messenger.getChatMemberIdByQuery({
        model_type: messenger.dialogTypes.COMPANY,
        model_id: company.id
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

async function onObjectDestroyed() {
    const object = store.state.Messenger.currentDialog.model.object;

    const taskPayload = await createTaskWithTemplate({
        message: `Объект #${object.id} снесен, отправить в пассив`,
        step: TASK_FORM_STEPS.MESSAGE,
        end: dayjs().add(SCHEDULING_CALL_DURATION, 'day').toDate()
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

onMounted(() => {
    if (store.getters['Messenger/currentChatHasLastCall']) fetchSurveys();
    if (!store.state.User.consultantList.length) store.dispatch('FETCH_CONSULTANT_LIST');
});
</script>
