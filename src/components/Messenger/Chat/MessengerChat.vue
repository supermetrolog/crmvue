<template>
    <div class="messenger-chat">
        <MessengerChatLoader v-if="isLoading" />
        <template v-else-if="currentPanel && currentChat">
            <MessengerChatContent />
            <AnimationTransition :speed="0.8">
                <MessengerQuiz ref="quiz" class="messenger-chat__quiz" />
            </AnimationTransition>
            <AnimationTransition :speed="0.8">
                <MessengerQuizHelper ref="quizHelper" />
            </AnimationTransition>
            <MessengerChatSettings ref="chatSettings" />
        </template>
        <MessengerChatEmpty v-else />
        <teleport to="body">
            <MessengerSchedule ref="schedule" />
            <FormModalTaskStatus ref="taskStatusEditor" />
            <FormModalMessageAlert />
            <FormModalMessageReminder />
            <FormModalMessage ref="messageUpdate" />
        </teleport>
    </div>
</template>
<script setup>
import { useStore } from 'vuex';
import MessengerChatLoader from '@/components/Messenger/Chat/MessengerChatLoader.vue';
import MessengerChatContent from '@/components/Messenger/Chat/MessengerChatContent.vue';
import MessengerChatEmpty from '@/components/Messenger/Chat/MessengerChatEmpty.vue';
import MessengerQuiz from '@/components/Messenger/Quiz/MessengerQuiz.vue';
import AnimationTransition from '@/components/common/AnimationTransition.vue';
import MessengerSchedule from '@/components/Messenger/Schedule/MessengerSchedule.vue';
import MessengerQuizHelper from '@/components/Messenger/Quiz/MessengerQuizHelper.vue';
import MessengerChatSettings from '@/components/Messenger/Chat/Settings/MessengerChatSettings.vue';
import FormModalMessageAlert from '@/components/Forms/FormModalMessageAlert.vue';
import FormModalMessageReminder from '@/components/Forms/FormModalMessageReminder.vue';
import FormModalMessage from '@/components/Forms/FormModalMessage.vue';
import FormModalTaskStatus from '@/components/Forms/FormModalTaskStatus.vue';
import api from '@/api/api.js';
import { computed, provide, ref, watch } from 'vue';
import { ucFirst } from '@/utils/formatter.js';
import { useNotify } from '@/utils/useNotify.js';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import { useAsyncPopup } from '@/composables/useAsyncPopup.js';

const store = useStore();
const notify = useNotify();

const { show: showTaskCreator } = useAsyncPopup('taskCreator');
const { show: showAlertCreator } = useAsyncPopup('alertCreator');
const { show: showReminderCreator } = useAsyncPopup('reminderCreator');

const creators = {
    task: showTaskCreator,
    alert: showAlertCreator,
    reminder: showReminderCreator
};

const schedule = ref(null);
const taskStatusEditor = ref(null);
const messageUpdate = ref(null);
const quiz = ref(null);
const quizHelper = ref(null);
const chatSettings = ref(null);

const createAddition = async ({ messageID, additionType, successMessage, errorMessage = null }) => {
    const creatorResponse = await creators[additionType]();
    if (!creatorResponse) return;

    const response = await store.dispatch('Messenger/add' + ucFirst(additionType), {
        messageID,
        options: creatorResponse
    });

    if (response) notify.success(successMessage);
    else notify.error(errorMessage ?? 'Произошла ошибка. Попробуйте позже');
};

const editAddition = async ({
    messageID,
    addition,
    additionType,
    successMessage,
    errorMessage = null
}) => {
    const creatorResponse = await creators[additionType](addition);
    if (!creatorResponse) return;

    const response = store.dispatch('Messenger/updateAddition', {
        messageID,
        additionID: addition.id,
        additionType,
        payload: creatorResponse
    });

    if (response) notify.success(successMessage);
    else notify.error(errorMessage ?? 'Произошла ошибка. Попробуйте позже');
};

const editTaskStatus = async (messageID, task) => {
    const response = await taskStatusEditor.value.open(task);

    if (response) {
        const statusUpdated = api.task.changeStatus(task.id, response.status);

        if (statusUpdated) {
            task.status = response.status;
            notify.success('Статус задачи успешно изменен.');
        }
    }
};

provide('$createAddition', createAddition);
provide('$editAddition', editAddition);
provide('$editTaskStatus', editTaskStatus);
provide('$openSchedule', async () => await schedule.value.open());
provide('$toggleQuiz', () => quiz.value.toggle());
provide('$toggleQuizHelper', () => quizHelper.value.toggle());
provide('$toggleSettings', () => chatSettings.value.toggle());
provide('$messageUpdate', props => messageUpdate.value.open(props));

const currentChat = computed(() => store.state.Messenger.currentChat);
const currentPanel = computed(() => store.state.Messenger.currentPanel);

const { isLoading } = useDelayedLoader();
watch(
    () => store.state.Messenger.loadingChat,
    value => {
        isLoading.value = value;
    }
);
</script>
