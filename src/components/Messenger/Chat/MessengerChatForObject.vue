<template>
    <div class="messenger-chat">
        <MessengerTabs @switch="switchTab" :current="messenger.chatTabs.CHAT" :tabs="tabs">
            <template #quiz>
                <MessengerChatForObjectCallTab
                    :loading="isLoading"
                    :company="currentPanel"
                    :dialog="currentDialog"
                />
            </template>
        </MessengerTabs>
        <MessengerChatLoader v-if="isLoading" />
        <div v-else-if="currentPanel && currentChat" class="messenger-chat__wrapper">
            <MessengerChatHeader />
            <MessengerChatContent :disabled="isWithoutActiveContacts" />
            <MessengerChatSettings ref="chatSettings" />
        </div>
        <MessengerChatEmpty v-else />
        <teleport to="body">
            <FormModalMessageAlert />
        </teleport>
    </div>
</template>
<script setup>
import { useStore } from 'vuex';
import MessengerChatLoader from '@/components/Messenger/Chat/MessengerChatLoader.vue';
import MessengerChatContent from '@/components/Messenger/Chat/MessengerChatContent.vue';
import MessengerChatEmpty from '@/components/Messenger/Chat/MessengerChatEmpty.vue';
import MessengerChatSettings from '@/components/Messenger/Chat/Settings/MessengerChatSettings.vue';
import FormModalMessageAlert from '@/components/Forms/FormModalMessageAlert.vue';
import { computed, provide, useTemplateRef, watch } from 'vue';
import { ucFirst } from '@/utils/formatters/string.js';
import { useNotify } from '@/utils/use/useNotify.js';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import { useAsyncPopup } from '@/composables/useAsyncPopup.js';
import MessengerTabs from '@/components/Messenger/MessengerTabs.vue';
import { messenger } from '@/const/messenger.js';
import { isActiveContact, isPersonalContact } from '@/utils/helpers/models/contact.js';
import MessengerChatForObjectCallTab from '@/components/Messenger/Chat/MessengerChatForObjectCallTab.vue';
import { CALL_STATUSES } from '@/components/MessengerQuiz/useMessengerQuiz.js';
import MessengerChatHeader from '@/components/Messenger/Chat/Header/MessengerChatHeader.vue';
import { useSurveyForm } from '@/composables/useSurveyForm.ts';

const store = useStore();
const notify = useNotify();

const { show: showTaskCreator } = useAsyncPopup('taskCreator');
const { show: showAlertCreator } = useAsyncPopup('alertCreator');

const creators = {
    task: showTaskCreator,
    alert: showAlertCreator
};

const chatSettings = useTemplateRef('chatSettings');

const currentDialog = computed(() => store.state.Messenger.currentDialog);

const quizTabClass = computed(() => {
    if (currentPanel.value && !hasActiveContact.value)
        return 'not-selectable dashboard-bg-gray text-white';

    const daysAfterLastCall = store.getters['Messenger/currentDaysCountAfterLastCall'];
    let baseClass = 'not-selectable';

    if (daysAfterLastCall <= import.meta.env.VITE_VUE_APP_MESSENGER_DATE_FROM_CALL_WARNING) {
        if (
            currentDialog.value.last_call &&
            currentDialog.value.last_call.status === CALL_STATUSES.COMPLETED
        )
            return `${baseClass} success`;
        return `${baseClass} dashboard-bg-gray text-white`;
    }

    if (daysAfterLastCall <= import.meta.env.VITE_VUE_APP_MESSENGER_DATE_FROM_CALL_DANGER) {
        return `${baseClass} bg-warning`;
    }

    return `${baseClass} bg-danger text-white`;
});

const tabs = computed(() => [
    { id: messenger.chatTabs.CHAT, key: 'chat', label: 'Чат' },
    {
        id: messenger.chatTabs.SURVEY,
        key: 'quiz',
        label: 'Заполните опрос',
        class:
            !isLoading.value && currentDialog.value && currentPanel.value
                ? quizTabClass.value
                : 'not-selectable',
        disabled: true
    }
]);

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

const currentChat = computed(() => store.state.Messenger.currentChat);
const currentPanel = computed(() => store.state.Messenger.currentPanel);

const { isLoading } = useDelayedLoader(store.state.Messenger.loadingChat);
watch(
    () => store.state.Messenger.loadingChat,
    value => {
        isLoading.value = value;
    }
);

const { openSurvey } = useSurveyForm();

const switchTab = tabId => {
    if (tabId === messenger.chatTabs.SURVEY) {
        openSurvey(currentPanel.value.id);
    }
};

// contacts

const contacts = computed(() => {
    return currentPanel.value.contacts.filter(isPersonalContact);
});

const isWithoutActiveContacts = computed(() => currentPanel.value?.active_contacts_count === 0);

const hasActiveContact = computed(() => {
    if (currentPanel.value) return contacts.value.some(isActiveContact);
    return false;
});
</script>
