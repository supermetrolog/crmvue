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
        <div class="messenger-quiz__wrapper">
            <div class="messenger-quiz__header">
                <span v-if="currentRecipient">Разговор c</span>
                <button @click="recipientFormIsVisible = true" class="messenger-quiz__recipient">
                    <i
                        v-if="currentRecipient?.isMain"
                        class="mr-2 fa-solid fa-crown messenger-quiz__icon"
                    />
                    <span>
                        {{ recipient }}
                    </span>
                    <i class="ml-2 fa-solid fa-pen messenger-quiz__icon" />
                </button>
            </div>
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
                <span>Отрыть список возможных вопросов клиенту</span>
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
    </div>
</template>
<script setup>
import MessengerQuizQuestion from '@/components/Messenger/Quiz/MessengerQuizQuestion.vue';
import MessengerButton from '@/components/Messenger/MessengerButton.vue';
import { useStore } from 'vuex';
import { computed, inject, onBeforeMount, ref, shallowRef } from 'vue';
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

const emit = defineEmits(['complete']);

const store = useStore();
const notify = useNotify();
const { confirm } = useConfirm();

const $openSchedule = inject('$openSchedule');
const $toggleQuizHelper = inject('$toggleQuizHelper');

const isLoading = shallowRef(false);
const isCompleted = shallowRef(false);
const questionRefs = ref([]);
const recipientFormIsVisible = shallowRef(false);

const THIS_USER = computed(() => store.getters.THIS_USER);
const questions = computed(() => store.state.Quizz.questions);

const currentRecipient = ref(store.state.Messenger.currentRecipient);
const recipient = computed(() => {
    if (!currentRecipient.value) return 'Без звонка';
    return currentRecipient.value.full_name;
});

const shouldCall = computed(() => {
    return (
        store.getters['Messenger/currentDaysCountAfterLastCall'] >
        import.meta.env.VITE_VUE_APP_MESSENGER_DATE_FROM_CALL_WARNING
    );
});

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
    } else {
        notify.info('Произошла ошибка. Попробуйте еще раз.');
    }
};

const close = () => {
    emit('completed');
};

onBeforeMount(() => {
    if (!questions.value.length) fetchQuestions();
});
</script>
