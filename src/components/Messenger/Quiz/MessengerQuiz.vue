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
            <MessengerQuizHeader
                @change="showContactPicker"
                @edit="editContact"
                :recipient="currentRecipient"
                :loading="isLoading"
            />
            <p @click="$toggleQuizHelper" class="messenger-quiz__action">
                <i class="fa-solid fa-chevron-left"></i>
                <span>Открыть список возможных вопросов клиенту</span>
            </p>
            <Loader v-if="isLoading" class="my-4" />
            <MessengerQuizForm ref="quizForm" />
            <div class="messenger-quiz__footer">
                <MessengerButton @click="send" color="success" :disabled="isCompleted">
                    Готово
                </MessengerButton>
                <MessengerButton @click="openSchedule" disabled>
                    Запланировать звонок
                </MessengerButton>
                <MessengerButton disabled>Контакт не актуален</MessengerButton>
                <MessengerButton disabled color="danger">Снесен</MessengerButton>
            </div>
            <MessengerQuizComplete v-if="isCompleted" @close="close" />
        </div>
        <teleport to="body">
            <FormCompanyContact
                v-if="updateContactModalVisible"
                @close="updateContactModalVisible = false"
                @updated="onContactUpdated"
                :formdata="currentRecipient"
            />
        </teleport>
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
                Выберите контакт, с которым происходил разговор по объекту/предложению/компании!
            </DashboardChip>
            <MessengerQuizRecipientPicker v-model="currentRecipient" />
            <template #footer>
                <Button @click="sendQuiz" :disabled="!currentRecipient" small success>
                    Сохранить
                </Button>
                <Button small>Отменить</Button>
            </template>
        </Modal>
    </div>
</template>
<script setup>
import MessengerButton from '@/components/Messenger/MessengerButton.vue';
import { useStore } from 'vuex';
import { computed, inject, onMounted, ref, shallowRef, useTemplateRef } from 'vue';
import { useNotify } from '@/utils/useNotify.js';
import { useConfirm } from '@/composables/useConfirm.js';
import api from '@/api/api.js';
import MessengerQuizComplete from '@/components/Messenger/Quiz/MessengerQuizComplete.vue';
import Loader from '@/components/common/Loader.vue';
import MessengerChatHeader from '@/components/Messenger/Chat/Header/MessengerChatHeader.vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import Modal from '@/components/common/Modal.vue';
import MessengerQuizHeader from '@/components/Messenger/Quiz/MessengerQuizHeader.vue';
import FormCompanyContact from '@/components/Forms/Company/FormCompanyContact.vue';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import MessengerQuizInlineElement from '@/components/Messenger/Quiz/MessengerQuizInlineElement.vue';
import Button from '@/components/common/Button.vue';
import Spinner from '@/components/common/Spinner.vue';
import MessengerQuizPreview from '@/components/Messenger/Quiz/MessengerQuizPreview.vue';
import { useAsyncPopup } from '@/composables/useAsyncPopup.js';
import MessengerQuizRecipientPicker from '@/components/Messenger/Quiz/MessengerQuizRecipientPicker.vue';
import MessengerQuizForm from '@/components/Messenger/Quiz/MessengerQuizForm.vue';
import MessengerQuizWarning from '@/components/Messenger/Quiz/MessengerQuizWarning.vue';

const emit = defineEmits(['complete']);

const store = useStore();
const notify = useNotify();
const { confirm } = useConfirm();

const {
    show: showContactPicker,
    isVisible: contactPickerIsVisible,
    cancel: closeContactPicker,
    submit: sendQuiz
} = useAsyncPopup('quizContactPicker');

const $openSchedule = inject('$openSchedule');
const $toggleQuizHelper = inject('$toggleQuizHelper');

const quizForm = useTemplateRef('quizForm');

const isLoading = shallowRef(false);
const isCompleted = shallowRef(false);
const updateContactModalVisible = shallowRef(false);
const currentRecipient = ref(store.state.Messenger.currentRecipient);
const surveys = ref([]);
const surveysCount = shallowRef(0);
const surveyPreviewIsOpen = shallowRef(false);
const previewedSurveyId = shallowRef(null);

const THIS_USER = computed(() => store.getters.THIS_USER);

const shouldCall = computed(() => {
    return (
        store.getters['Messenger/currentDaysCountAfterLastCall'] >
        import.meta.env.VITE_VUE_APP_MESSENGER_DATE_FROM_CALL_WARNING
    );
});

const { isLoading: surveysIsLoading } = useDelayedLoader(
    store.getters['Messenger/currentChatHasLastCall']
);

const openSchedule = async () => {
    const schedule = await $openSchedule();

    if (schedule) {
        await store.dispatch('Messenger/addCall', {
            date: schedule,
            contact: currentRecipient.value
        });
        notify.info('Дата следующего звонка успешно выбрана');
    }
};

const send = async () => {
    const confirmed = await confirm(
        'Подтвердите заполнение опросника. Вы закончили заполнение полученной информации?'
    );
    if (!confirmed) return;

    const contact = await showContactPicker({});
    if (!contact) return;

    isLoading.value = true;

    const answers = quizForm.value.getForm();

    const createdSurvey = await api.survey.create({
        contact_id: currentRecipient.value.id,
        user_id: THIS_USER.value.id,
        chat_member_id: store.state.Messenger.currentDialog.id,
        question_answers: answers
    });

    isLoading.value = false;

    if (createdSurvey) {
        isCompleted.value = true;
        notify.success('Опрос успешно сохранен');
    }
};

const close = () => {
    emit('completed');
};

const editContact = () => {
    updateContactModalVisible.value = true;
};

const onContactUpdated = async contactId => {
    const contacts = await api.contacts.getByCompany(currentRecipient.value?.company_id);
    const newContact = contacts.find(contact => contact.id === contactId);

    if (newContact) store.commit('Messenger/onContactUpdated', newContact);
};

const fetchSurveys = async () => {
    surveysIsLoading.value = true;

    const response = await store.dispatch('Messenger/getCurrentChatQuizzes');
    surveys.value = response.data.slice(0, 3);
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

onMounted(() => {
    if (store.getters['Messenger/currentChatHasLastCall']) fetchSurveys();
    if (!store.state.User.consultantList.length) store.dispatch('FETCH_CONSULTANT_LIST');
});
</script>
