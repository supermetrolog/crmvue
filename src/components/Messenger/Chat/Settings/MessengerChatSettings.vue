<template>
    <div class="messenger-chat-settings" :class="{ active: isOpened }">
        <div class="messenger-chat-settings__wrapper">
            <div class="messenger-chat-settings__header">
                <p>Файлы, опросы и прочее</p>
                <i @click="toggle" class="fa-regular fa-circle-xmark"></i>
            </div>
            <Spinner v-if="isLoading" class="absolute-center" />
            <div v-else-if="isOpened" class="messenger-chat-settings__body">
                <div
                    v-if="currentDialog.model_type === 'object'"
                    class="messenger-chat-settings__preview"
                >
                    <span class="messenger-chat-settings__id">
                        {{ currentDialog.model.object.id }}
                    </span>
                    <img :src="currentDialog.model.object.thumb" alt="object preview" />
                </div>
                <div class="messenger-chat-settings__list">
                    <MessengerChatSettingsLink
                        @click="togglePanel('photos')"
                        :class="{ active: currentPanel === 'photos' }"
                    >
                        Фотографии
                    </MessengerChatSettingsLink>
                    <MessengerChatSettingsLink
                        @click="togglePanel('files')"
                        :class="{ active: currentPanel === 'files' }"
                    >
                        Файлы
                    </MessengerChatSettingsLink>
                    <MessengerChatSettingsLink
                        @click="togglePanel('quizzes')"
                        :class="{ active: currentPanel === 'quizzes' }"
                    >
                        Завершенные опросы
                    </MessengerChatSettingsLink>
                    <!--                    <MessengerChatSettingsLink-->
                    <!--                        @click="togglePanel('quizzes')"-->
                    <!--                        :class="{ active: currentPanel === 'quizzes' }"-->
                    <!--                    >-->
                    <!--                        Звонки клиентам-->
                    <!--                    </MessengerChatSettingsLink>-->
                </div>
                <div class="messenger-chat-settings__footer">
                    <MessengerButton disabled color="danger" class="w-100">
                        Отправить чат в архив
                    </MessengerButton>
                </div>
            </div>
        </div>
        <MessengerChatSettingsPanel v-model="currentPanel" />
    </div>
</template>
<script setup>
import { useStore } from 'vuex';
import Spinner from '@/components/common/Spinner.vue';
import MessengerChatSettingsLink from '@/components/Messenger/Chat/Settings/MessengerChatSettingsLink.vue';
import MessengerButton from '@/components/Messenger/MessengerButton.vue';
import MessengerChatSettingsPanel from '@/components/Messenger/Chat/Settings/MessengerChatSettingsPanel.vue';
import { useDelayedLoader } from '@/composables/useDelayedLoader.js';
import { computed, shallowRef } from 'vue';

const store = useStore();
const { isLoading } = useDelayedLoader();

const isOpened = shallowRef(false);
const currentPanel = shallowRef(null);

const currentDialog = computed(() => store.state.Messenger.currentDialog);

const toggle = () => {
    isOpened.value = !isOpened.value;

    if (isOpened.value) {
        isLoading.value = true;
        setTimeout(() => (isLoading.value = false), 500);
    } else {
        currentPanel.value = null;
    }
};

const togglePanel = panelName => {
    currentPanel.value = currentPanel.value === panelName ? null : panelName;
};

defineExpose({ toggle });
</script>
