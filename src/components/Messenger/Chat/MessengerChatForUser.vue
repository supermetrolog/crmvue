<template>
    <div class="messenger-chat">
        <MessengerTabs :current="currentTab" :tabs="tabs">
            <template #quiz>Чат</template>
        </MessengerTabs>
        <MessengerChatLoader v-if="isLoading" />
        <div v-else-if="currentPanel && currentChat" class="messenger-chat__wrapper">
            <MessengerChatContent />
            <MessengerChatSettings ref="chatSettings" />
        </div>
        <MessengerChatEmpty v-else />
        <teleport to="body">
            <MessengerSchedule ref="schedule" />
            <FormModalTaskStatus ref="taskStatusEditor" />
            <FormModalMessageAlert />
            <FormModalMessage ref="messageUpdate" />
        </teleport>
    </div>
</template>
<script setup>
import { useStore } from 'vuex';
import MessengerChatLoader from '@/components/Messenger/Chat/MessengerChatLoader.vue';
import MessengerChatEmpty from '@/components/Messenger/Chat/MessengerChatEmpty.vue';
import MessengerSchedule from '@/components/Messenger/Schedule/MessengerSchedule.vue';
import MessengerChatSettings from '@/components/Messenger/Chat/Settings/MessengerChatSettings.vue';
import FormModalMessageAlert from '@/components/Forms/FormModalMessageAlert.vue';
import FormModalMessage from '@/components/Forms/FormModalMessage.vue';
import FormModalTaskStatus from '@/components/Forms/FormModalTaskStatus.vue';
import api from '@/api/api.js';
import { computed, provide, ref, shallowRef, watch } from 'vue';
import { ucFirst } from '@/utils/formatters/string.js';
import { useNotify } from '@/utils/use/useNotify.js';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import { useAsyncPopup } from '@/composables/useAsyncPopup.js';
import MessengerChatContent from '@/components/Messenger/Chat/MessengerChatContent.vue';
import MessengerTabs from '@/components/Messenger/MessengerTabs.vue';

const CHAT_TABS = {
    CHAT: 1
};
const tabs = [{ id: CHAT_TABS.CHAT, key: 'chat', label: 'Чат' }];

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
const chatSettings = ref(null);
const currentTab = shallowRef(CHAT_TABS.CHAT);

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
        const statusUpdated = await api.task.changeStatus(task.id, response.status);

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
