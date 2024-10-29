<template>
    <div class="messenger-chat">
        <MessengerTabs @switch="switchTab" :current="currentTab" :tabs="tabs">
            <template #quiz>
                <tippy tag="div" class="messenger-chat__tab-quiz">
                    <template #default>
                        <div v-if="isLoading" class="messenger-tabs__loading">
                            <Spinner class="absolute-center mini" />
                        </div>
                        <template v-else>
                            <i class="fa-solid fa-square-phone-flip messenger-chat__icon-phone" />
                            <span v-if="currentDialog?.last_call"> Опрос {{ lastCallDate }} </span>
                            <span v-else>ЗАПОЛНИТЕ ОПРОС!</span>
                        </template>
                    </template>
                    <template #content>
                        <div v-if="isLoading" class="d-flex align-items-center gap-2 p-2">
                            <Spinner class="mini" />
                            <p>Загрузка данных о последнем звонке..</p>
                        </div>
                        <div v-else-if="currentDialog">
                            <div v-if="shouldCall" class="mb-1">
                                <p class="messenger-warning">ИНФОРМАЦИЯ УСТАРЕЛА!</p>
                                <p class="messenger-warning">СОЗВОНИТЕСЬ И ЗАПОЛНИТЕ ОПРОСНИК!</p>
                            </div>
                            <p v-if="currentDialog?.last_call">
                                Последний опрос был заполнен {{ lastCallDate }}, звонивший:
                                {{ currentDialog.last_call.user.userProfile.medium_name }}
                            </p>
                            <p v-else>Звонок по объекту отсутствует или не заполнен.</p>
                        </div>
                    </template>
                </tippy>
            </template>
        </MessengerTabs>
        <MessengerChatLoader v-if="isLoading" />
        <div v-else-if="currentPanel && currentChat" class="messenger-chat__wrapper">
            <AnimationTransition :speed="0.4">
                <MessengerChatContent v-if="currentTab === CHAT_TABS.CHAT" />
                <MessengerQuiz v-else @completed="currentTab = CHAT_TABS.CHAT" />
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
import { computed, provide, shallowRef, useTemplateRef, watch } from 'vue';
import { toDateFormat, ucFirst } from '@/utils/formatter.js';
import { useNotify } from '@/utils/useNotify.js';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import { useAsyncPopup } from '@/composables/useAsyncPopup.js';
import MessengerTabs from '@/components/Messenger/MessengerTabs.vue';
import MessengerQuizHelper from '@/components/Messenger/Quiz/MessengerQuizHelper.vue';
import Spinner from '@/components/common/Spinner.vue';
import { Tippy } from 'vue-tippy';

const CHAT_TABS = {
    CHAT: 1,
    QUIZ: 2
};

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

const currentTab = shallowRef(CHAT_TABS.CHAT);

const currentDialog = computed(() => store.state.Messenger.currentDialog);
const shouldCall = computed(() => {
    return (
        store.getters['Messenger/currentDaysCountAfterLastCall'] >
        import.meta.env.VITE_VUE_APP_MESSENGER_DATE_FROM_CALL_WARNING
    );
});
const lastCallDate = computed(() =>
    toDateFormat(currentDialog.value.last_call.created_at, 'D.MM.YY')
);

const tabs = computed(() => [
    { id: CHAT_TABS.CHAT, key: 'chat', label: 'Чат' },
    {
        id: CHAT_TABS.QUIZ,
        key: 'quiz',
        label: 'Заполните опрос',
        class: shouldCall.value && !isLoading.value ? 'bg-danger text-white' : undefined
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
    currentTab.value = tabId;
};
</script>
