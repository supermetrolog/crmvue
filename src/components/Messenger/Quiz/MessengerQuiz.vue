<template>
    <div class="messenger-quiz messenger-chat__content">
        <MessengerChatHeader />
        <div v-if="shouldCall" class="messenger-quiz__info">
            <DashboardChip class="mw-100 dashboard-bg-warning">
                <i class="fa-solid fa-exclamation-triangle" />
                <span>
                    Дата последнего звонка по объекту/запросу устарела. Пожалуйста, созвонитесь с
                    прикрепленным к объекту/запросу лицом и актуализируйте информацию.
                </span>
            </DashboardChip>
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
                @change="recipientFormIsVisible = true"
                @edit="editContact"
                :recipient="currentRecipient"
                :loading="isLoading"
            />
            <Modal
                @close="recipientFormIsVisible = false"
                title="Выбор контакта для опроса"
                width="700"
                :show="recipientFormIsVisible"
            >
                <MessengerChatFormRecipient
                    @change="setCurrentRecipient"
                    :current="currentRecipient"
                    without-auto-toggle
                    class="messenger-quiz__recipient-form"
                />
                <MessengerChatFormRecipientCard
                    v-if="currentRecipient"
                    :contact="currentRecipient"
                    class="w-100 my-3"
                />
                <EmptyData v-else class="my-3">Опрос будет заполнен без контакта</EmptyData>
                <MessengerButton
                    @click="recipientFormIsVisible = false"
                    color="success"
                    class="mt-2 w-100"
                >
                    Закрыть
                </MessengerButton>
            </Modal>
            <p @click="$toggleQuizHelper" class="messenger-quiz__action">
                <i class="fa-solid fa-chevron-left"></i>
                <span>Отркыть список возможных вопросов клиенту</span>
            </p>
            <Loader v-if="isLoading" class="my-4" />
            <div class="messenger-quiz__content">
                <MessengerQuizQuestion
                    v-for="question in questions"
                    ref="questionRefs"
                    :key="question.id"
                    :question="question"
                    class="messenger-quiz__question"
                />
            </div>
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
    </div>
</template>
<script setup>
import MessengerQuizQuestion from '@/components/Messenger/Quiz/MessengerQuizQuestion.vue';
import MessengerButton from '@/components/Messenger/MessengerButton.vue';
import { useStore } from 'vuex';
import { computed, inject, onBeforeMount, onMounted, ref, shallowRef } from 'vue';
import { useNotify } from '@/utils/useNotify.js';
import { useConfirm } from '@/composables/useConfirm.js';
import api from '@/api/api.js';
import MessengerQuizComplete from '@/components/Messenger/Quiz/MessengerQuizComplete.vue';
import Loader from '@/components/common/Loader.vue';
import MessengerChatHeader from '@/components/Messenger/Chat/Header/MessengerChatHeader.vue';
import DashboardChip from '@/components/Dashboard/DashboardChip.vue';
import Modal from '@/components/common/Modal.vue';
import MessengerChatFormRecipient from '@/components/Messenger/Chat/Form/MessengerChatFormRecipient.vue';
import MessengerChatFormRecipientCard from '@/components/Messenger/Chat/Form/MessengerChatFormRecipientCard.vue';
import EmptyData from '@/components/common/EmptyData.vue';
import MessengerQuizHeader from '@/components/Messenger/Quiz/MessengerQuizHeader.vue';
import FormCompanyContact from '@/components/Forms/Company/FormCompanyContact.vue';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import MessengerQuizInlineElement from '@/components/Messenger/Quiz/MessengerQuizInlineElement.vue';
import Button from '@/components/common/Button.vue';
import Spinner from '@/components/common/Spinner.vue';
import MessengerQuizPreview from '@/components/Messenger/Quiz/MessengerQuizPreview.vue';

const emit = defineEmits(['complete']);

const store = useStore();
const notify = useNotify();
const { confirm } = useConfirm();

const $openSchedule = inject('$openSchedule');
const $toggleQuizHelper = inject('$toggleQuizHelper');

const isLoading = shallowRef(false);
const isCompleted = shallowRef(false);
const updateContactModalVisible = shallowRef(false);
const questionRefs = ref([]);
const recipientFormIsVisible = shallowRef(false);
const currentRecipient = ref(store.state.Messenger.currentRecipient);
const surveys = ref([]);
const surveysCount = shallowRef(0);
const surveyPreviewIsOpen = shallowRef(false);
const previewedSurveyId = shallowRef(null);

const THIS_USER = computed(() => store.getters.THIS_USER);
const questions = computed(() => store.state.Quizz.questions);

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

const fetchQuestions = async () => {
    isLoading.value = true;
    await store.dispatch('fetchQuestions');
    isLoading.value = false;
};
const send = async () => {
    if (currentRecipient.value === null) {
        notify.info(
            'Пожалуйста, выберите контакта, от корого вы узнали информацию.',
            'Контакт для опроса'
        );
        return;
    }

    const confirmed = await confirm('Подтвердите заполнение опросника');
    if (!confirmed) return;

    isLoading.value = true;

    const forms = questionRefs.value.map(element => element.getForm());

    const created = await api.survey.create({
        contact_id: currentRecipient.value.id,
        user_id: THIS_USER.value.id,
        chat_member_id: store.state.Messenger.currentDialog.id,
        question_answers: forms.flat()
    });

    isLoading.value = false;

    if (created) {
        isCompleted.value = true;
        notify.success('Опросник успешно сохранен');
        updateLastCall();
    }
};

const setCurrentRecipient = recipient => {
    currentRecipient.value = recipient;
};

const updateLastCall = async () => {
    const callObject = await api.call.createForChatMember(store.state.Messenger.currentDialog.id, {
        user_id: store.getters.THIS_USER.id,
        contact_id: currentRecipient.value.id
    });

    if (callObject) {
        notify.success('Дата последнего звонка успешно обновлена');
        store.state.Messenger.currentDialog.last_call = callObject;
        store.commit('Messenger/onQuizCompleted', callObject);
    } else {
        notify.info('Произошла ошибка. Попробуйте еще раз.');
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
    surveysCount.value = response.pagination.pageCount;

    surveysIsLoading.value = false;
};

onBeforeMount(() => {
    if (!questions.value.length) fetchQuestions();
});

const showSurvey = surveyId => {
    previewedSurveyId.value = surveyId;
    surveyPreviewIsOpen.value = true;
};

const showSurveys = () => {
    notify.info('Функция находится в разработке..', 'Функция недоступна');
};

onMounted(() => {
    if (store.getters['Messenger/currentChatHasLastCall']) fetchSurveys();
});
</script>
