<template>
    <div class="messenger-chat-settings" :class="{ active: opened }">
        <div class="messenger-chat-settings__wrapper">
            <div class="messenger-chat-settings__header">
                <p>Файлы, опросы и прочее</p>
                <i @click="toggle" class="fa-regular fa-circle-xmark"></i>
            </div>
            <Spinner v-if="isLoading" center />
            <div v-else-if="opened" class="messenger-chat-settings__body">
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
                        Список всех фотографий
                    </MessengerChatSettingsLink>
                    <MessengerChatSettingsLink
                        @click="togglePanel('files')"
                        :class="{ active: currentPanel === 'files' }"
                    >
                        Список всех файлов
                    </MessengerChatSettingsLink>
                    <MessengerChatSettingsLink
                        @click="togglePanel('quizzes')"
                        :class="{ active: currentPanel === 'quizzes' }"
                    >
                        Список завершенных опросов
                    </MessengerChatSettingsLink>
                </div>
                <div class="messenger-chat-settings__footer">
                    <MessengerButton color="danger" class="w-100">
                        Отправить чат в архив
                    </MessengerButton>
                </div>
            </div>
        </div>
        <MessengerChatSettingsPanel v-model="currentPanel" />
    </div>
</template>
<script>
import { mapState } from 'vuex';
import Spinner from '@/components/common/Spinner.vue';
import { LoaderMixin } from '@/components/Messenger/loader.mixin';
import MessengerChatSettingsLink from '@/components/Messenger/Chat/Settings/MessengerChatSettingsLink.vue';
import MessengerButton from '@/components/Messenger/MessengerButton.vue';
import MessengerChatSettingsPanel from '@/components/Messenger/Chat/Settings/MessengerChatSettingsPanel.vue';

export default {
    name: 'MessengerChatSettings',
    components: {
        MessengerChatSettingsPanel,
        MessengerButton,
        MessengerChatSettingsLink,
        Spinner
    },
    mixins: [LoaderMixin],
    data() {
        return {
            opened: false,
            loading: false,
            currentPanel: null
        };
    },
    computed: {
        ...mapState({ currentDialog: state => state.Messenger.currentDialog }),
        originalLoader() {
            return this.loading;
        }
    },
    methods: {
        toggle() {
            this.opened = !this.opened;

            if (this.opened) {
                this.loading = true;
                setTimeout(() => (this.loading = false), 500);
            } else {
                this.currentPanel = null;
            }
        },
        togglePanel(panelName) {
            this.currentPanel = this.currentPanel === panelName ? null : panelName;
        }
    }
};
</script>
