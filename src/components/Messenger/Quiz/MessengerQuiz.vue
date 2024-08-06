<template>
    <div v-if="isOpened" class="messenger-quiz">
        <div class="messenger-quiz__header">
            <p>
                {{ THIS_USER.userProfile.full_name }}, {{ recipient }}, от
                {{ currentDate }}
            </p>
            <i @click="close" class="fa-regular fa-circle-xmark"></i>
        </div>
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
            <MessengerButton @click="openSchedule" disabled>Запланировать звонок</MessengerButton>
            <MessengerButton disabled>Контакт не актуален</MessengerButton>
            <MessengerButton disabled color="danger">Снесен</MessengerButton>
        </div>
        <MessengerQuizComplete v-if="isCompleted" @close="close" />
    </div>
</template>
<script setup>
import MessengerQuizQuestion from '@/components/Messenger/Quiz/MessengerQuizQuestion.vue';
import MessengerButton from '@/components/Messenger/MessengerButton.vue';
import { useStore } from 'vuex';
import dayjs from 'dayjs';
import { computed, inject, ref, shallowRef } from 'vue';
import { useNotify } from '@/utils/useNotify.js';
import { useConfirm } from '@/composables/useConfirm.js';
import api from '@/api/api.js';
import MessengerQuizComplete from '@/components/Messenger/Quiz/MessengerQuizComplete.vue';
import Loader from '@/components/common/Loader.vue';

const store = useStore();
const notify = useNotify();
const { confirm } = useConfirm();

const $openSchedule = inject('$openSchedule');
const $toggleQuizHelper = inject('$toggleQuizHelper');

const isOpened = shallowRef(false);
const isLoading = shallowRef(false);
const isCompleted = shallowRef(false);
const currentDate = shallowRef(dayjs().format('DD.MM.YYYY'));
const questionRefs = ref([]);

const THIS_USER = computed(() => store.getters.THIS_USER);
const questions = computed(() => store.state.Quizz.questions);

const currentRecipient = computed(() => store.state.Messenger.currentRecipient);
const recipient = computed(() => {
    if (currentRecipient.value) return `с ${currentRecipient.value.full_name}`;
    return 'без звонка';
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

const close = () => {
    isCompleted.value = false;
    isOpened.value = false;
};

const open = () => {
    isOpened.value = true;
};

const fetchQuestions = async () => {
    isLoading.value = true;
    await store.dispatch('fetchQuestions');
    isLoading.value = false;
};

const toggle = () => {
    if (!isOpened.value && questions.value.length === 0) fetchQuestions();
    if (isOpened.value) close();
    else open();
};

defineExpose({ toggle });

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
        notify.success();

        setTimeout(() => {
            close();
            isCompleted.value = false;
        }, 5000);
    }
};
</script>
