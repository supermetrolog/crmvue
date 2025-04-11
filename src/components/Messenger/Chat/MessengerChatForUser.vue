<template>
    <div class="messenger-chat">
        <MessengerTabs :current="currentTab" :tabs="tabs">
            <template #quiz>Чат</template>
        </MessengerTabs>
        <MessengerChatLoader v-if="isLoading" />
        <div v-else-if="currentPanel && currentChat" class="messenger-chat__wrapper">
            <MessengerChatHeader />
            <MessengerChatContent />
            <MessengerChatSettings ref="chatSettings" />
        </div>
        <MessengerChatEmpty v-else />
        <teleport to="body">
            <FormModalMessageAlert />
            <FormModalMessage ref="messageUpdate" />
        </teleport>
    </div>
</template>
<script setup>
import { useStore } from 'vuex';
import MessengerChatLoader from '@/components/Messenger/Chat/MessengerChatLoader.vue';
import MessengerChatEmpty from '@/components/Messenger/Chat/MessengerChatEmpty.vue';
import MessengerChatSettings from '@/components/Messenger/Chat/Settings/MessengerChatSettings.vue';
import FormModalMessageAlert from '@/components/Forms/FormModalMessageAlert.vue';
import FormModalMessage from '@/components/Forms/FormModalMessage.vue';
import { computed, provide, ref, shallowRef, watch } from 'vue';
import { ucFirst } from '@/utils/formatters/string.js';
import { useNotify } from '@/utils/use/useNotify.js';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import { useAsyncPopup } from '@/composables/useAsyncPopup.js';
import MessengerChatContent from '@/components/Messenger/Chat/MessengerChatContent.vue';
import MessengerTabs from '@/components/Messenger/MessengerTabs.vue';
import MessengerChatHeader from '@/components/Messenger/Chat/Header/MessengerChatHeader.vue';

const CHAT_TABS = {
    CHAT: 1
};
const tabs = [{ id: CHAT_TABS.CHAT, key: 'chat', label: 'Чат' }];

const store = useStore();
const notify = useNotify();

const { show: showTaskCreator } = useAsyncPopup('taskCreator');
const { show: showAlertCreator } = useAsyncPopup('alertCreator');

const creators = {
    task: showTaskCreator,
    alert: showAlertCreator
};

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

provide('$createAddition', createAddition);
provide('$editAddition', editAddition);
provide('$toggleSettings', () => chatSettings.value.toggle());
provide('$messageUpdate', props => messageUpdate.value.open(props));

const currentChat = computed(() => store.state.Messenger.currentChat);
const currentPanel = computed(() => store.state.Messenger.currentPanel);

const { isLoading } = useDelayedLoader(store.state.Messenger.loadingChat);

watch(
    () => store.state.Messenger.loadingChat,
    value => {
        isLoading.value = value;
    }
);
</script>
