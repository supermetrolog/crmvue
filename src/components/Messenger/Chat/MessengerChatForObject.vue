<template>
    <div class="messenger-chat">
        <MessengerTabs @switch="switchTab" :current="currentTab" :tabs="tabs">
            <template #quiz>
                <MessengerChatForObjectCallTab
                    :loading="isLoading"
                    :company
                    :dialog="currentDialog"
                />
            </template>
        </MessengerTabs>
        <MessengerChatLoader v-if="isLoading" />
        <div v-else-if="currentPanel && currentChat" class="messenger-chat__wrapper">
            <AnimationTransition :speed="0.4">
                <MessengerChatContent
                    v-if="currentTab === messenger.chatTabs.CHAT"
                    :disabled="isWithoutActiveContacts"
                />
                <MessengerQuiz
                    v-else
                    @completed="switchTab(messenger.chatTabs.CHAT)"
                    :disabled="!hasActiveContact"
                />
            </AnimationTransition>
            <MessengerQuizHelper ref="quizHelper" />
            <MessengerChatSettings ref="chatSettings" />
        </div>
        <MessengerChatEmpty v-else />
        <teleport to="body">
            <MessengerSchedule ref="schedule" />
            <FormModalMessageAlert />
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
import MessengerChatSettings from '@/components/Messenger/Chat/Settings/MessengerChatSettings.vue';
import FormModalMessageAlert from '@/components/Forms/FormModalMessageAlert.vue';
import { computed, provide, useTemplateRef, watch } from 'vue';
import { ucFirst } from '@/utils/formatters/string.js';
import { useNotify } from '@/utils/use/useNotify.js';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import { useAsyncPopup } from '@/composables/useAsyncPopup.js';
import MessengerTabs from '@/components/Messenger/MessengerTabs.vue';
import MessengerQuizHelper from '@/components/Messenger/Quiz/MessengerQuizHelper.vue';
import { messenger } from '@/const/messenger.js';
import { isActiveContact, isPersonalContact } from '@/utils/helpers/models/contact.js';
import MessengerChatForObjectCallTab from '@/components/Messenger/Chat/MessengerChatForObjectCallTab.vue';
import { CALL_STATUSES } from '@/components/Messenger/Quiz/useMessengerQuiz.js';

const store = useStore();
const notify = useNotify();

const { show: showTaskCreator } = useAsyncPopup('taskCreator');
const { show: showAlertCreator } = useAsyncPopup('alertCreator');

const creators = {
    task: showTaskCreator,
    alert: showAlertCreator
};

const schedule = useTemplateRef('schedule');
const quizHelper = useTemplateRef('quizHelper');
const chatSettings = useTemplateRef('chatSettings');

const currentTab = computed(() => store.state.Messenger.currentChatTab);
const currentDialog = computed(() => store.state.Messenger.currentDialog);

const quizTabClass = computed(() => {
    if (company.value && !hasActiveContact.value)
        return 'not-selectable dashboard-bg-gray text-white';

    const daysAfterLastCall = store.getters['Messenger/currentDaysCountAfterLastCall'];
    let baseClass = 'not-selectable';

    if (daysAfterLastCall <= import.meta.env.VITE_VUE_APP_MESSENGER_DATE_FROM_CALL_WARNING) {
        if (currentDialog.value.last_call.status !== CALL_STATUSES.COMPLETED)
            return `${baseClass} dashboard-bg-gray text-white`;
        return `${baseClass} success`;
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
        class: !isLoading.value && currentDialog.value ? quizTabClass.value : 'not-selectable'
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
provide('$openSchedule', async () => await schedule.value.open());
provide('$toggleQuizHelper', () => quizHelper.value.toggle());
provide('$toggleSettings', () => chatSettings.value.toggle());

const currentChat = computed(() => store.state.Messenger.currentChat);
const currentPanel = computed(() => store.state.Messenger.currentPanel);

const { isLoading } = useDelayedLoader();
watch(
    () => store.state.Messenger.loadingChat,
    value => {
        isLoading.value = value;
    }
);

const switchTab = tabId => {
    if (tabId === messenger.chatTabs.CHAT) {
        store.dispatch('Messenger/refreshMessages');
    }

    store.state.Messenger.currentChatTab = tabId;
};

// contacts

const company = computed(() => store.state.Messenger.currentPanel);

const contacts = computed(() => {
    return company.value.contacts.filter(isPersonalContact);
});

const isWithoutActiveContacts = computed(() => company.value.active_contacts_count === 0);

const hasActiveContact = computed(() => {
    if (company.value) return contacts.value.some(isActiveContact);
    return false;
});
</script>
